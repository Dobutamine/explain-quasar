import { CoreModel } from "./core_model";

export class Resistor extends CoreModel {
  // define the for this class specific parameters
  no_flow = false;
  no_backflow = false;
  r_for = 1;
  r_for_fac = 1;
  r_back = 1;
  r_back_fac = 1;
  r_k = 1;
  r_k_fac = 1;
  _comp_from = "";
  _comp_to = "";
  res = 0;

  // define state variables
  flow = 0;

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  initModel() {
    // find the correct compliances/time-varying elastances
    this._comp_from = this._model.components[this.comp_from];
    this._comp_to = this._model.components[this.comp_to];

    if (this._comp_from && this._comp_to) {
      this.is_initialized = true;
      // console.log(`Initialized resistor ${this.name}`);
    } else {
      console.log(`Error initializing ${this.name}.`);
    }
  }

  calcModel() {
    // first get the pressures from the components
    let p1 = this._comp_from.pres;
    let p2 = this._comp_to.pres;

    // calculate the resistance depending on the flow of the previous step!
    let nonlin_fac = this.r_k * this.r_k_fac * Math.abs(this.flow);

    // calculate thes
    if (p1 > p2) {
      this.res = this.r_for * this.r_for_fac + nonlin_fac;
    } else {
      this.res = this.r_back * this.r_back_fac + nonlin_fac;
    }

    // calculate the flow
    if (this.no_flow) {
      this.flow = 0;
    } else {
      this.flow = (p1 - p2) / this.res;
      if (this.flow < 0 && this.no_backflow) {
        this.flow = 0;
      }
    }
    // now we have the flow in l/sec and we have to convert it to l by multiplying it by the modeling_stepsize to get the volume displacement in this stepsize
    let dvol = this.flow * this._model.modeling_stepsize;

    // now update the compliances
    if (dvol > 0) {
      // positive volume means _comp_from loses volume and _comp_to gains volume
      const mb_pos = this._comp_from.volumeOut(dvol);
      this._comp_to.volumeIn(dvol - mb_pos, this._comp_from);
    } else {
      // negative volume means _comp_from gains volume and _comp_to loses volume
      const mb_neg = this._comp_to.volumeOut(-dvol);
      this._comp_from.volumeIn(-dvol - mb_neg, this._comp_to);
    }
  }
}
