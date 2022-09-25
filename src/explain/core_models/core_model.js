export class CoreModel {
  _model = {};
  name = "";
  description = "";
  is_enabled = false;
  is_initialized = false;

  constructor(args, model_ref) {
    // store a reference to the model object
    this._model = model_ref;

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  modelStep() {
    if (this.is_initialized) {
      if (this.is_enabled) {
        this.calcModel();
      }
    } else {
      this.initModel();
    }
  }

  initModel() {
    // if no specific initialization is necessary this routine is called only once
    // override it in the child class if you want to do a model specific initialization
    this.is_initialized = true;
  }

  // this method is called during every model step when the initialization is complete and the model is enabled
  calcModel() {}
}
