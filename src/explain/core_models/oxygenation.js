import { CoreModel } from "./core_model";

export class Oxygenation extends CoreModel {
  _model = {};
  is_initialized = false;
  oxy_cpp = {
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
    const wasm_path = new URL("/public/wasm/oxygenation.wasm", import.meta.url);

    // load the wasm module
    WebAssembly.instantiateStreaming(fetch(wasm_path)).then((wasm) => {
      // store the calculate function of the c++ module in an js object for easy access
      this.oxy_cpp.calculate = wasm.instance.exports.calculate;
      // store a reference to the ArrayBuffer of the memory of the c++ module
      this.oxy_cpp.data = new Float64Array(
        wasm.instance.exports.memory.buffer,
        wasm.instance.exports.getMemAddress(),
        2
      );

      this.is_initialized = true;

      // // double _to2, double _dpg, double _hemoglobin, double _be, double _temp
      // this.oxy_cpp.calculate(9.14, 5.0, 10.0, 0.0, 37.0);
      // console.log(this.oxy_cpp.data);

      // this.oxy_cpp.calculate(9.84, 5.0, 10.0, 0.0, 37.0);
      // console.log(this.oxy_cpp.data);
    });
  }
}
