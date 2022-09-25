import { CoreModel } from "./core_model";

export class Blood extends CoreModel {
  // declare an ob ject holding all objects
  compounds = {};

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // initialize the model by loading the wasm file
    this.initModel();
  }

  initModel() {
    // set the compounds on the  component types which
    for (let component in this._model.components) {
      if (this._model.components[component].content === "blood") {
        // set the correct compounds on the component containing blood
        this._model.components[component]["compounds"] = { ...this.compounds };
      }
    }
    this.is_initialized = true;
  }

  // this method is called during every model step when the initialization is complete and the model is enabled
  calcModel() {}
}
