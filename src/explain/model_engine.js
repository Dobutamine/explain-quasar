// import all models present in the model_index module
import * as models from "./model_index";
import DataCollector from "./helpers/datacollector";
import { mode } from "simple-statistics";

// declare a model object
let model = {
  components: {},
};

// declare the model initialization flag
let modelInitialized = false;

// declare a model data object
let model_data = [];

// store all models in a list
const available_models = [];
Object.values(models).forEach((model) => available_models.push(model));

// set the realtime updateinterval
let rt_interval = 0.015;
let rt_clock = null;

// setup the workers communication handler
onmessage = (e) => {
  switch (e.data.type) {
    case "get":
      switch (e.data.message) {
        case "data":
          getModelData();
          break;
        case "state":
          getModelState();
          break;
      }
      break;
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
        case "datalog_res":
          setDataloggingResolution(e.data.payload[0]);
          break;
        case "watch":
          watchProperty(e.data.payload);
          break;
        case "calculate":
          calculate(e.data.payload[0]);
          break;
      }
      break;
  }
};
function setDataloggingResolution(state) {
  model.data.setDataloggingResolution(state);
}
function watchProperty(prop) {
  model.data.addToWatcher(prop[0], prop[1], prop[2]);
}
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

function getModelState() {
  let model_structure = {};

  Object.keys(model.components).forEach((component_name) => {
    // conditionally copy all properties
    model_structure[component_name] = {};
    Object.keys(model.components[component_name]).forEach(
      (component_property_name) => {
        // don't copy the properties with an underscore before it because these are local properties of the component.
        if (Array.from(component_property_name)[0] !== "_") {
          // copy property
          model_structure[component_name][component_property_name] =
            model.components[component_name][component_property_name];
        }
      }
    );
  });
  postMessage({
    type: "state",
    message: "",
    payload: [model_structure],
  });
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
    model["data"] = new DataCollector(model);

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
    model["data"] = new DataCollector(model);

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

function start() {
  if (modelInitialized) {
    // call the modelStep every rt_interval seconds
    rt_clock = setInterval(modelStepRT, rt_interval * 1000.0);
  }
}

function stop() {
  if (modelInitialized) {
    clearInterval(rt_clock);
    rt_clock = null;
  }
}

function getModelData() {
  // get the data from the datacollector, this also clears the buffer from the datalogger
  model_data = model.data.getData();
}

function sendModelData() {
  // send the data to the model instance
  postMessage({
    type: "data",
    message: "",
    payload: model_data,
  });
}

function calculate(time_to_calculate = 10.0) {
  if (modelInitialized) {
    let no_steps = time_to_calculate / model.modeling_stepsize;
    postMessage({
      type: "status",
      message: `Calculating ${time_to_calculate} sec. in ${no_steps} steps.`,
      payload: [],
    });
    const start = performance.now();
    for (let i = 0; i < no_steps; i++) {
      modelStep();
    }
    const end = performance.now();
    postMessage({
      type: "status",
      message: `Execution time: ${(end - start).toFixed(0)} ms`,
      payload: [],
    });
    const step_time = (end - start) / no_steps;
    postMessage({
      type: "status",
      message: `Model step: ${step_time.toFixed(4)} ms`,
      payload: [],
    });

    // get the model data from the engine
    getModelData();

    // send the model data to the model instance
    sendModelData();
  }
}

function modelStepRT() {
  // so the rt_interval determines how often the model is calculated
  const no_steps = rt_interval / model.modeling_stepsize;
  for (let i = 0; i < no_steps; i++) {
    modelStep();
  }
}

function modelStep() {
  Object.values(model.components).forEach((component) => {
    component.modelStep();
  });
  // log the data from the model
  model.data.modelStep();
  // increase the model time
  model.model_time_total += model.modeling_stepsize;
}
