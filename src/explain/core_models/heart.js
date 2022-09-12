import { CoreModel } from "./core_model";

export class Heart extends CoreModel {
  // atrial activation function targets
  aaf_right_targets = [];
  aaf_left_targets = [];

  // ventricular activation function targets
  vaf_right_targets = [];
  vaf_left_targets = [];

  // coronaries
  coronaries = [];

  // activation function shape parameters
  atrial_a = 1.0;
  atrial_b = 0.5;
  atrial_c = 0.2;

  ventr_a1 = 0.5;
  ventr_b1 = 0.5;
  ventr_c1 = 0.2;

  ventr_a2 = 0.59;
  ventr_b2 = 0.6;
  ventr_c2 = 0.13;

  // ecg parameters
  heart_rate = 155;
  heart_rate_ref = 155;
  venticular_escape_rate = 40;
  rhythm_type = 0;
  pq_time = 0.1;
  av_delay = 0.02;
  qrs_time = 0.075;
  qt_time = 0.4;
  cqt_time = 0.198;
  amp_p = 1;
  skew_p = 2.5;
  width_p = 20;
  amp_q = -0.5;
  width_q = 20;
  skew_q = 2;
  amp_r = 10;
  width_r = 20;
  skew_r = 2.5;
  amp_s = -1.5;
  width_s = 20;
  skew_s = 10;
  amp_t = 2;
  skew_t = 2;
  width_t = 25;
  ecg_signal = 0;
  aaf = 0;
  vaf = 0;

  // local state properties
  _sa_node_period = 0;
  _sa_node_counter = 0;
  _pq_running = False;
  _pq_time_counter = 0;
  _qrs_running = False;
  _qrs_time_counter = 0;
  _qt_running = False;
  _ventricle_is_refractory = False;
  _qt_time_counter = 0;
  _measured_hr_time_counter = 0;
  _measured_qrs_counter = 0;
  _p_wave_signal_counter = 0;
  _qrs_wave_signal_counter = 0;
  _t_wave_signal_counter = 0;
  _ncc_atrial = 0;
  _ncc_ventricular = 0;

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  // override the initMode and calcModel functions of the base class
  initModel() {
    // if no specific initialization is necessary this routine is called only once
    // override it in the child class if you want to do a model specific initialization
    this.is_initialized = true;
  }

  // this method is called during every model step when the initialization is complete and the model is enabled
  calcModel() {
    // calculate the qt time
    this.cqt_time = this.qtc() - this.qrs_time;

    // calculate the sa_node_time in seconds depending on the heartrate
    this._sa_node_counter = 60;
    if (this.heart_rate > 0) {
      this._sa_node_period = 60 / this.heart_rate;
    }

    // has the sa node time elapsed?
    if (this._sa_node_counter > this._sa_node_period) {
      // reset the sa_node_counter
      this._sa_node_counter = 0;
      // signal that the pq time starts running
      this._pq_running = true;
      // reset the atrial activation curve counter
      this._ncc_atrial = -1;
    }

    // has the pq time elapsed?
    if (this._pq_time_counter > this.pq_time) {
      // reset the pq time counter
      this._pq_time_counter = 0;
      // signal that the pq time counter is stopped
      this._pq_running = false;
      // check whether the ventricles are in a refractory state
      if (!this._ventricle_is_refractory) {
        // signal that the qrs time starts running
        this._qrs_running = true;
        // reset the ventricular activation curve counter
        this._ncc_ventricular = -1;
        // increase the measured qrs counter with 1 beat
        this._measured_qrs_counter += 1;
      }
    }

    // has the qrs time elapsed?
    if (this._qrs_time_counter > this.qrs_time) {
      // reset the qrs time counter
      this._qrs_time_counter = 0;
      // reset the ecg signal to zero
      this.ecg_signal = 0;
      // signal that the qrs time counter has stopped
      this._qrs_running = false;
      // signal that the qt time start running
      this._qt_running = true;
      // signal that the ventricles are going into a refractory state
      this._ventricle_is_refractory = true;
    }

    //has the qt time elapsed
    if (this._qt_time_counter > this.qt_time) {
      // reset the qt time counter
      this._qt_time_counter = 0;
      // signal that the qt time counter has stopped
      this._qt_running = false;
      // signal that the ventricles are coming out of their refractory state
      this._ventricle_is_refractory = false;
    }

    // increase the ecg timers
    // the sa node timer is always running
    this._sa_node_counter += this.model.modeling_stepsize;
    // increase the pq time counter if the counter is running
    if (this._pq_running) {
      this._pq_time_counter += this.model.modeling_stepsize;
      // increase the p wave signal counter
      this._p_wave_signal_counter += 1;
      // build the p-wave
      this.buildPWave();
    } else {
      // reset the counter
      this._p_wave_signal_counter = 0;
    }

    // increase the qrs time counter if the counter is running
    if (this._qrs_running) {
      this._qrs_time_counter += this.model.modeling_stepsize;
      // increase the qrs wave signal counter
      this._qrs_wave_signal_counter += 1;
      // build the qrs wave
      this.buildQRSWave();
    } else {
      // reset the wave signal counter
      this._qrs_wave_signal_counter = 0;
    }

    // increase the qt time counter if the counter is running
    if (this._qt_running) {
      this._qt_time_counter += this.model.modeling_stepsize;
      // increase the t wave signal counter
      this._t_wave_signal_counter += 1;
      // build the t-wave
      this.buildTWave();
    } else {
      // reset the t wave counter
      this._t_wave_signal_counter = 0;
    }

    // if nothing is running, there's no electrical signal
    if (!this._pq_running && !this._qrs_running && !this._qt_running) {
      this.ecg_signal = 0;
    }

    // calculate the heartrate every 5 seconds
    if (this._measured_hr_time_counter > 5) {
      // reset the measured heartrate counter
      this._measured_hr_time_counter = 0;
      // calculate the measured heartrate
      this.measured_heart_rate =
        60.0 / (this._measured_hr_time_counter / this._measured_qrs_counter);
      this._measured_qrs_counter = 0;
    }

    // increase the time counter for measured heart_rate routine
    this._measured_hr_time_counter += this.model.modeling_stepsize;

    // increase the activation curve timers
    this._ncc_atrial += 1;
    this._ncc_ventricular += 1;

    // calculate the varying elastance function
    this.calcVaryingElastanceFactor();
  }

  buildPWave() {}
  buildQRSWave() {}
  buildTWave() {}

  qtc() {
    if (this.heart_rate > 10) {
      return this.qt_time * Math.sqrt(60 / this.heart_rate);
    } else {
      return this.qt_time * Math.sqrt(60 / 10);
    }
  }

  calcVaryingElastanceFactor() {
    const _t = this.model.modeling_stepsize;

    if (this._ncc_atrial >= 0 && this._ncc_atrial < this.pq_time / _t) {
      // gaussian curve => y = a * exp(-((t - b) / c)^2) where
      // a = height
      // b = position of the peak
      // c = atrial duration

      const a = this.atrial_a;
      const b = this.atrial_b * atrial_duration;
      const c = this.atrial_c * atrial_duration;
      const t = this._ncc_atrial * _t;

      this.aaf = a * Math.exp(-Math.pow((t - b) / c, 2));
    }

    const ventricular_duration = this.cqt_time + this.qrs_time;

    // varying elastance activation function of the ventricles
    if (
      this.ncc_ventricular >= 0 &&
      this.ncc_ventricular < ventricular_duration / _t
    ) {
      // the ventricular activation curve consists of two gaussian curves on top of each other
      // gaussian curve => y = a * exp(-((t - b) / c)^2) where
      // a = height
      // b = position of the peak
      // c = atrial duration

      const a1 = 0.5;
      const b1 = 0.5 * ventricular_duration;
      const c1 = 0.2 * ventricular_duration;

      const a2 = 0.59;
      const b2 = 0.6 * ventricular_duration;
      const c2 = 0.13 * ventricular_duration;

      const t = this.ncc_ventricular * _t;
      const vaf1 = a1 * Math.exp(-Math.pow((t - b1) / c1, 2));
      const vaf2 = a2 * Math.exp(-Math.pow((t - b2) / c2, 2));

      this.vaf = vaf1 + vaf2;

      // set the state as systolic
      this.state = 1;
    } else {
      // set the state as diastolic
      this.state = 0;
    }

    // transfer the activation factors to the correct time varying elastances
    this.aaf_left_targets.forEach(
      (target) =>
        (this.model.components[target].varying_elastance_factor = this.aaf)
    );
    this.aaf_right_targets.forEach(
      (target) =>
        (this.model.components[target].varying_elastance_factor = this.aaf)
    );
    this.vaf_left_targets.forEach(
      (target) =>
        (this.model.components[target].varying_elastance_factor = this.vaf)
    );
    this.vaf_right_targets.forEach(
      (target) =>
        (this.model.components[target].varying_elastance_factor = this.vaf)
    );
  }
}
