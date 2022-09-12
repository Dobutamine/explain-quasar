export default class Model {
  // declare an object holding the worker thread
  modelEngine = {};

  // declare an object holding the model definition
  modelDefinition = {};

  constructor() {
    // spin up a worker thread
    this.modelEngine = new Worker(
      new URL("./model_engine.js", import.meta.url)
    );

    // setup the communication channel with the worker thread
    this.setUpCommChannel();

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

  start() {
    // start realtime model
  }

  stop() {
    // stop the realtime model
  }

  sendMessage(message) {
    if (this.modelEngine) {
      this.modelEngine.postMessage(message);
    }
  }

  setUpCommChannel() {
    if (this.modelEngine) {
      this.modelEngine.onmessage = (e) => {
        switch (e.data.type) {
          case "status":
            console.log(`ModelEngine: status => ${e.data.message}`);
            break;
          case "error":
            console.log(`ModelEngine: error =>  ${e.data.message}`);
            break;
        }
      };
    }
  }
}
