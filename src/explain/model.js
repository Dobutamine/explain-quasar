export default class Model {
  // declare an object holding the worker thread
  modelEngine = {};

  // declare an object holding the model definition
  modelDefinition = {};

  // declare an object holding the model data coming from the engine
  modelData = [];

  // declare an object holding the model components coming from the engine
  modelState = [];

  // declare an object holding the model realtime data coming from the engine
  modelDataRT = [];

  // declare the events
  rt_event = new CustomEvent("rt");
  data_event = new CustomEvent("data");
  state_event = new CustomEvent("state");
  status_event = new CustomEvent("status");
  error_event = new CustomEvent("error");

  // declare an object holding the status log
  statusMessage = "";
  statusLog = [];
  maxStatusLog = 10;

  // decalre an object holding the error log
  errorMessage = "";
  errorLog = [];
  maxErrorLog = 10;

  constructor() {
    // spin up a worker thread
    this.modelEngine = new Worker(
      new URL("./model_engine.js", import.meta.url)
    );

    // setup the communication channel with the worker thread
    this.setUpCommChannel();

    // startup with the default model
    this.injectDefaultModelDefinition();
  }

  newModel(name, description, weight, modeling_stepsize) {
    this.sendMessage({
      type: "command",
      message: "new",
      payload: [
        {
          name: name,
          description: description,
          weight: weight,
          model_time_total: 0.0,
          modeling_stepsize: modeling_stepsize,
          components: {},
        },
      ],
    });
  }

  addComponentToModel(component) {
    this.sendMessage({ type: "command", message: "add", payload: [component] });
  }

  removeComponentFromModel(component) {
    this.sendMessage({
      type: "command",
      message: "remove",
      payload: [component],
    });
  }

  injectModelDefinition(model_json) {
    this.sendMessage({
      type: "command",
      message: "init",
      payload: [model_json],
    });
  }

  injectDefaultModelDefinition() {
    // load model definition file
    let defaultModelPath = new URL(
      "/public/definitions/normal_neonate.json",
      import.meta.url
    );
    fetch(defaultModelPath).then((response) =>
      response.json().then((data) => {
        this.sendMessage({
          type: "command",
          message: "init",
          payload: [data],
        });
      })
    );
  }

  importModelDefinition(modelDefinitionJson) {
    // convert the json model definition file to a javascript object
  }

  exportModelDefinition() {
    // convert the modelDefinition object to a json modelDefinition object
  }

  saveModelState() {
    // save the current model state
  }

  loadModelState(filename) {
    // load a saved model state
  }
  unwatchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "command",
      message: "unwatch",
      payload: [model, prim_prop, sec_prop],
    });
  }

  watchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "command",
      message: "watch",
      payload: [model, prim_prop, sec_prop],
    });
  }

  setDataloggingResolution(state) {
    this.sendMessage({
      type: "command",
      message: "datalog_res",
      payload: [state],
    });
  }

  start() {
    // start realtime model
    this.sendMessage({
      type: "command",
      message: "start",
      payload: [],
    });
  }

  stop() {
    // stop the realtime model
    this.sendMessage({
      type: "command",
      message: "stop",
      payload: [],
    });
  }

  calculate(time_to_calculate) {
    this.sendMessage({
      type: "command",
      message: "calculate",
      payload: [time_to_calculate],
    });
  }

  getModelState() {
    this.sendMessage({
      type: "get",
      message: "state",
      payload: [],
    });
  }

  getModelData() {
    this.sendMessage({
      type: "get",
      message: "data",
      payload: [],
    });
  }

  setUpCommChannel() {
    if (this.modelEngine) {
      this.modelEngine.onmessage = (e) => {
        switch (e.data.type) {
          case "status":
            this.statusMessage = e.data.message;
            this.statusLog.push(e.data.message);
            if (this.statusLog.length > this.maxStatusLog) {
              this.statusLog.shift();
            }
            // raise status event
            document.dispatchEvent(this.status_event);
            break;
          case "error":
            this.errorMessage = e.data.message;
            this.errorLog.push(e.data.message);
            if (this.errorLog.length > this.maxErrorLog) {
              this.errorLog.shift();
            }
            // raise error event
            document.dispatchEvent(this.error_event);
            break;
          case "data":
            this.modelData = e.data.payload;
            // raise data ready event
            document.dispatchEvent(this.data_event);
            break;
          case "state":
            this.modelState = e.data.payload[0];
            // reaise com ready event
            document.dispatchEvent(this.state_event);
            break;
          case "rt":
            this.modelData = e.data.payload;
            document.dispatchEvent(this.rt_event);
            break;
        }
      };
    }
  }

  sendMessage(message) {
    if (this.modelEngine) {
      this.modelEngine.postMessage(message);
    }
  }
}
