import { CoreModel } from "./core_model";

export class Oxygenation extends CoreModel {
  _model = {};
  oxy_cpp = {};

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // get the path to the wasm module
    const wasm_path = new URL("/public/wasm/oxygenation.wasm", import.meta.url);

    // load the wasm module
    WebAssembly.instantiateStreaming(fetch(wasm_path)).then((wasm) => {
      this.oxy_cpp = wasm;
      console.log(this.oxy_cpp);
    });
  }
}
