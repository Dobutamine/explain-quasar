export default class DataCollector {
  model = {};
  data = [];
  name = "datalogger";
  description = "datalogger";
  is_enabled = false;
  is_initialized = false;

  constructor(model_ref) {
    // store a reference to the model object
    this.model = model_ref;

    // process the arguments/parameters
    // args.forEach((arg) => {
    //   this[arg["key"]] = arg["value"];
    // });
  }

  modelStep() {
    if (this.is_initialized) {
      if (this.is_enabled) {
        this.logData();
      }
    } else {
      this.initDatalogger();
    }
  }

  initDatalogger() {
    // if no specific initialization is necessary this routine is called only once
    this.is_initialized = true;
  }

  // this method is called during every model step when the initialization is complete and the model is enabled
  logData() {}
}
