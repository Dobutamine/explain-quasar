// import all models present in the model_index module
import * as models from "./model_index";
import DataCollector from "./helpers/datacollector";

// declare a model object
let model = {
  components: {},
};

// declare the model initialization flag
let modelInitialized = false;

// store all models in a list
const available_models = [];
Object.values(models).forEach((model) => available_models.push(model));

// setup the workers communication handler
onmessage = (e) => {
  switch (e.data.type) {
    case "command":
      switch (e.data.message) {
        case "init":
          init(e.data.payload[0]);
          break;
        case "new":
          // newEmptyModel(e.data.payload[0]);
          break;
        case "add":
          break;
        case "remove":
          break;
        case "start":
          start();
          break;
        case "stop":
          stop();
          break;
        case "calculate":
          calculate(e.data.payload[0]);
          break;
      }
      break;
  }
};

function addComponent(component) {
  // check if the model is available in the available model list
  let index = available_models.findIndex(
    (model) => model.name === component.model_type
  );
  // if the component model was found then instantiate a model
  if (index > -1) {
    // copy the properties of the modeldefinition file to an args object
    let args = [];
    for (const [key, value] of Object.entries(component)) {
      args.push({ key, value });
    }
    // instantiate the new component with the args array and a reference to the model object
    let newComponent = new available_models[index](args, model);

    // add the new component to the model object
    model.components[newComponent.name] = newComponent;
  } else {
    // process any errors
    error = true;
    postMessage({
      type: "error",
      message: component.model_type + " model not found",
      payload: [],
    });
  }
}

function removeComponent(component_name) {
  // find component name in model.components dictionary
}

function newEmptyModel(modelDefinition) {
  // reset error flag
  let error = false;

  // clear current model object
  model = {
    components: {},
  };

  // clear model initialized flag
  modelInitialized = false;

  // try to process the modelDefinition object
  try {
    // initialize the model parameters, except the model components key which needs special processing
    for (const [key, value] of Object.entries(modelDefinition)) {
      if (key != "components") {
        // copy model parameter to the model object
        model[key] = value;
      }
    }
    // add a datacollector instance to the model object
    model["data"] = new DataCollector();

    if (!error) {
      // if no error signal the parent that everything went ok
      modelInitialized = true;
      postMessage({
        type: "status",
        message: "engine initialized",
        payload: [],
      });
    }
  } catch (e) {
    // if error signal the parent that there was an error
    modelInitialized = false;
    postMessage({
      type: "error",
      message: "invalid model definition",
      payload: [e],
    });
  }
}

function init(modelDefinition) {
  // reset error flag
  let error = false;

  // clear current model object
  model = {
    components: {},
  };

  // clear model initialized flag
  modelInitialized = false;

  // try to process the modelDefinition object
  try {
    // initialize the model parameters, except the model components key which needs special processing
    for (const [key, value] of Object.entries(modelDefinition)) {
      if (key != "components") {
        // copy model parameter to the model object
        model[key] = value;
      }
    }
    // add a datacollector instance to the model object
    model["data"] = new DataCollector();

    // initiliaze all model components
    Object.values(modelDefinition.components).forEach((component) => {
      // check if the model is available in the available model list
      let index = available_models.findIndex(
        (model) => model.name === component.model_type
      );
      // if the component model was found then instantiate a model
      if (index > -1) {
        // copy the properties of the modeldefinition file to an args object
        let args = [];
        for (const [key, value] of Object.entries(component)) {
          args.push({ key, value });
        }
        // instantiate the new component with the args array and a reference to the model object
        let newComponent = new available_models[index](args, model);

        // add the new component to the model object
        model.components[newComponent.name] = newComponent;
      } else {
        // process any errors
        error = true;
        postMessage({
          type: "error",
          message: component.model_type + " model not found",
          payload: [],
        });
      }
    });

    if (!error) {
      // if no error signal the parent that everything went ok
      modelInitialized = true;
      postMessage({
        type: "status",
        message: "engine initialized",
        payload: [],
      });
      //console.log(this.model.components);
      //model.components.AA_AAR.modelStep();
    }
  } catch (e) {
    // if error signal the parent that there was an error
    modelInitialized = false;
    postMessage({
      type: "error",
      message: "invalid model definsssition",
      payload: [e],
    });
  }
}

function start() {
  if (modelInitialized) {
  }
}

function stop() {
  if (modelInitialized) {
  }
}

function calculate(time_to_calculate = 10.0) {
  if (modelInitialized) {
  }
}

function modelStep() {}
