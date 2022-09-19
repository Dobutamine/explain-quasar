import { CoreModel } from "./core_model";

export class Oxygenation extends CoreModel {
  // define an object holding the wasm module and wasm memory
  oxy_cpp = {
    calculate: {},
    data: {},
  };

  // define an array holding the component names
  components = [];

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

      // set the oxygenation object on the components
      this.components.forEach((component_name) => {
        this.model.components[component_name]["oxygenation"] = {
          po2: 100,
          so2: 1.0,
        };
      });
      // set the is initialized flag to true
      this.is_initialized = true;

      this.calcModel();
    });
  }

  // this method is called during every model step when the initialization is complete and the model is enabled
  calcModel() {
    this.components.forEach((component_name) => {
      // get the component from the model
      let component = this.model.components[component_name];

      // get the properties of the component (to2, dpg, hemoglobin, be, temp)

      // calculate the po2 and so2 using the wasm module
      this.oxy_cpp.calculate(9.1, 5.0, 10.0, 0.0, 37.0);

      // set the results on the component from the wasm memory
      component.oxygenation.po2 = this.oxy_cpp.data[0];
      component.oxygenation.so2 = this.oxy_cpp.data[1];
    });
  }
}
