export default class DataCollector {
  model = {};
  data = [];
  name = "datalogger";
  description = "datalogger";
  is_enabled = true;
  is_initialized = false;

  datalog_interval = 0.01;
  _datalog_counter = 0;

  hi_res = false;

  log_items = [
    { model: "heart", prim_prop: "ncc_ventricular", sec_prop: "" },
    { model: "AA", prim_prop: "pres", sec_prop: "" },
  ];

  constructor(model_ref) {
    // store a reference to the model object
    this.model = model_ref;

    // initialize the start log_items
    this.log_items = [
      { model: "heart", prim_prop: "ncc_ventricular", sec_prop: "" },
      { model: "AA", prim_prop: "pres", sec_prop: "" },
    ];
  }

  setDataloggingResolution(state) {
    this.hi_res = state;
    if (this.hi_res) {
      this.datalog_interval = 0.001;
    } else {
      this.datalog_interval = 0.01;
    }
  }

  removeFromWatcher(model, prim_prop, sec_prop) {
    // prevent duplicates
    let found_at_index = -1;
    let index_counter = 0;
    this.log_items.forEach((log_item) => {
      if (
        log_item.model === model &&
        log_item.prim_prop === prim_prop &&
        log_item.sec_prop === sec_prop
      ) {
        found = true;
        found_at_index = index_counter;
      }
      index_counter += 1;
    });
    if (found) {
      // remove at index
      this.log_items.splice(found_at_index, 1);
    }
  }
  addToWatcher(model, prim_prop, sec_prop) {
    // prevent duplicates
    let found = false;
    this.log_items.forEach((log_item) => {
      if (
        log_item.model === model &&
        log_item.prim_prop === prim_prop &&
        log_item.sec_prop === sec_prop
      ) {
        found = true;
      }
    });
    if (!found) {
      this.log_items.push({
        model: model,
        prim_prop: prim_prop,
        sec_prop: sec_prop,
      });
    }
  }
  // datalogger is called every modelstep so every 0.5 sec
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

  getData() {
    // first copy the data
    let copied_data = [...this.data];
    // clear the data array
    this.data.length = 0;
    // return the data
    return copied_data;
  }
  // this method is called during every model step when the initialization is complete and the model is enabled
  // it updates the data object not every modelstep but depending on the set resolution 0.01 (20 modelcycles) sec or 0.001 sec (2 modelcycles)
  logData() {
    if (this._datalog_counter >= this.datalog_interval) {
      this._datalog_counter = 0;
      let data_entry = {
        time: this.model.model_time_total,
      };

      this.log_items.forEach((log_item) => {
        let log_label = log_item.model + "." + log_item.prim_prop;
        data_entry[log_label] =
          this.model.components[log_item.model][log_item.prim_prop];
        if (log_item.sec_prop) {
          log_label += "." + log_item.sec_prop;
          data_entry[log_label] =
            this.model.components[log_item.model][log_item.prim_prop][
              log_item.sec_prop
            ];
        }
      });
      this.data.push(data_entry);
    }
    this._datalog_counter += this.model.modeling_stepsize;
  }
}
