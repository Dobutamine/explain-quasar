export default class DataCollector {
  model = {};
  data = [];
  name = "datalogger";
  description = "datalogger";
  is_enabled = true;
  is_initialized = false;

  update_freq = 1.0;
  _update_counter = 0;

  datalog_interval = 0.015;
  _datalog_counter = 0;

  data_ready = false;

  model_data = [];

  log_items = [{ model: "AA", prim_prop: "acidbase", sec_prop: "ph" }];

  constructor(model_ref) {
    // store a reference to the model object
    this.model = model_ref;
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
  logData() {
    if (this._datalog_counter >= this.datalog_interval) {
      this._datalog_counter = 0;
      let data_entry = {
        time: this.model.model_time_total,
      };
      this.log_items.forEach((log_item) => {
        let log_label =
          log_item.model + "." + log_item.prim_prop + "." + log_item.sec_prop;
        data_entry[log_label] =
          this.model.components[log_item.model][log_item.prim_prop];
        if (log_item.sec_prop) {
          data_entry[log_label] =
            this.model.components[log_item.model][log_item.prim_prop][
              log_item.sec_prop
            ];
        }

        this.data.push(data_entry);
      });
    }
    this._datalog_counter += this.model.modeling_stepsize;

    if (this._update_counter >= this.update_freq) {
      this._update_counter = 0;
      console.log(this.data);
      this.data = [];
    }
    this._update_counter += this.model.modeling_stepsize;
  }
}
