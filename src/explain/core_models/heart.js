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
  calcModel() {}
}
