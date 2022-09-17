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

    // define some memory for the wasm
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

    const i32 = new Uint32Array(memory.buffer);
    for (let i = 0; i < 10; i++) {
      i32[i] = i;
    }

    const importObject = {
      module: {},
      env: {
        memory: memory,
      },
    };

    // load the wasm module
    WebAssembly.instantiateStreaming(fetch(wasm_path), importObject).then(
      (wasm) => {
        this.oxy_cpp = wasm;
        console.log(this.oxy_cpp);
        this.oxy_cpp.instance.exports.oxygenation(9.7, 5, 10, 0, 37);
        let t = this.oxy_cpp.instance.exports.pO2();
        console.log(t);
        let s = this.oxy_cpp.instance.exports.sO2();
        console.log(s);
      }
    );
  }
}
