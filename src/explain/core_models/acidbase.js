import { CoreModel } from "./core_model";

export class Acidbase extends CoreModel {
  _model = {};
  is_initialized = false;
  ab_cpp = {
    calculate: {},
    data: {},
  };

  constructor(args, model_ref) {
    // call the base class which defines the methods (modelStep, initModel and calcModel) and the common parameters (name, description, is_enabled)
    super(args, model_ref);

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // get the path to the wasm module
    const wasm_path = new URL("/public/wasm/acidbase.wasm", import.meta.url);

    // load the wasm module
    WebAssembly.instantiateStreaming(fetch(wasm_path)).then((wasm) => {
      // store the calculate function of the c++ module in an js object for easy access
      this.ab_cpp.calculate = wasm.instance.exports.calculate;
      // store a reference to the ArrayBuffer of the memory of the c++ module
      this.ab_cpp.data = new Float64Array(
        wasm.instance.exports.memory.buffer,
        wasm.instance.exports.getMemAddress(),
        4
      );

      this.is_initialized = true;

      // double _to2, double _dpg, double _hemoglobin, double _be, double _temp
      this.ab_cpp.calculate(25.1, 39.6, 30, 1.8, 4.0);
      console.log(this.ab_cpp.data);
    });
  }
}
