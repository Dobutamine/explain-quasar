import { CoreModel } from "./core_model";

export class Compliance extends CoreModel {
  // define the for this model specific parameters
  u_vol = 0;
  u_vol_fac = 1.0;
  el_base = 0;
  el_base_fac = 1.0;
  el_k = 0;
  el_k_fac = 1.0;

  // define the state variables
  pres = 0;
  pres_recoil = 0;
  pres_outside = 0;
  pres_max = 0;
  pres_min = 0;
  vol = 0;
  vol_max = 0;
  vol_min = 0;
  el = 0;

  // define some local variables
  _temp_pres_max = -1000;
  _temp_pres_min = 1000;
  _temp_vol_max = -1000;
  _temp_vol_min = 1000;

  _update_counter = 0;
  _update_interval = 2;

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  // override the calcModel function of the base class
  calcModel() {
    // calculate the volume above the unstressed volume
    let vol_above_u = this.vol - this.u_vol * this.u_vol_fac;

    // calculate the elastance, which is volume dependent in a non-linear way
    this.el =
      this.el_base * this.el_base_fac +
      this.el_k * this.el_k_fac * Math.pow(vol_above_u, 2);

    // calculate the recoil pressure in the compliance due to the elastacity of the compliance
    this.pres_recoil = vol_above_u * this.el;

    // calculate the pressure which refers to the pressure inside relative to the outside of a compartment.
    this.pres = this.pres_recoil + this.pres_outside;

    //reset the outside pressure as it needs to be set every model cycle
    this.pres_outside = 0;

    // calculate the minimal and maximal pressure and volume
    this.calcMinMax();
  }

  volumeIn(dvol, compFrom) {
    // this method is called when volume is added to this component
    if (this.is_enabled) {
      this.vol += dvol;
      // guard against negative volumes
      return this.protectMassBalance();
    } else {
      return 0;
    }
  }

  volumeOut(dvol) {
    // this method is called when volume is removed from this component
    if (this.is_enabled) {
      this.vol -= dvol;
      // guard against negative volumes
      return this.protectMassBalance();
    } else {
      return 0;
    }
  }

  protectMassBalance() {
    if (this.vol < 0) {
      // if there's a negative volume it might corrupt the mass balance of the model so we have to return the amount of volume which could not be displaced to the caller of this function
      let _nondisplaced_volume = -this.vol;
      // set the volume to zero
      this.vol = 0;
      // return the amount of blood which could not be removed
      return _nondisplaced_volume;
    } else {
      return 0;
    }
  }

  calcMinMax() {
    if (this._update_counter >= this._update_interval) {
      // store the min and max pres and vol
      this.pres_max = this._temp_pres_max;
      this.pres_min = this._temp_pres_min;
      this.vol_max = this._temp_vol_max;
      this.vol_min = this._temp_vol_min;
      // reset states
      this._temp_pres_max = -1000;
      this._temp_pres_min = 1000;
      this._temp_vol_max = -1000;
      this._temp_vol_min = 1000;
      this._update_counter = 0;
    }

    // find min and max pressures
    if (this.pres > this._temp_pres_max) {
      this._temp_pres_max = this.pres;
    }
    if (this.pres < this._temp_pres_min) {
      this._temp_pres_min = this.pres;
    }

    // find min and max volumes
    if (this.vol > this._temp_vol_max) {
      this._temp_vol_max = this.vol;
    }
    if (this.vol < this._temp_vol_min) {
      this._temp_vol_min = this.vol;
    }

    this._update_counter += this.model.modeling_stepsize;
  }
}
