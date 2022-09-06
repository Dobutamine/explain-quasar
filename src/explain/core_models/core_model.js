export class CoreModel {
  model;
  is_enabled;
  is_initialized = false;

  constructor(args, model_ref) {
    this.model = model_ref;
    // set all the args
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  modelStep() {
    if (this.is_initialized) {
      this.calcStep();
    } else {
      this.initModel();
    }
  }

  initModel() {}

  calcModel() {}
}
