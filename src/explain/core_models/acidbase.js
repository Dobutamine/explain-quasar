import { CoreModel } from "./core_model";

export class Acidbase extends CoreModel {
  _model = {};
  ab_cpp = {};

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // get the path to the wasm module
    let wasm_path = new URL("/public/wasm/acidbase.wasm", import.meta.url);

    // define some memory for the wasm
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

    const importObject = {
      module: {},
      env: {
        memory: memory,
      },
    };

    // load the wasm module
    WebAssembly.instantiateStreaming(fetch(wasm_path), importObject).then(
      (wasm) => {
        this.ab_cpp = wasm;
        console.log(this.ab_cpp);
      }
    );
  }
}
