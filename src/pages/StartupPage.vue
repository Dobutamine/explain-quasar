<template>
  <q-page>
    <div class="stage" :style="{ display: display }">
      <canvas id="stage"></canvas>
    </div>

    <q-btn @click="test">calculate</q-btn>
    <q-btn @click="getModelData">getdata</q-btn>
    <q-resize-observer @resize="onResize" />
  </q-page>
</template>

<script>
import { explainModel } from "../boot/explain";
import { PIXI } from "../boot/pixijs";
import Compartment from "../actors/compartment";

export default {
  data() {
    return {
      myList: ["First Item", "Second Item", "Third Item"],
      display: "block",
      pixiApp: null,
      canvas: null,
      stage: {
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0,
        aspectRatio: 1.0,
      },
    };
  },
  methods: {
    test() {
      explainModel.calculate(30);
    },
    getModelData() {
      explainModel.getModelData();
    },
    dropComponent() {
      console.log("dropped");
    },
    handleDragStart() {},
    handleDragEnd() {},
    onResize() {
      // get stage sizes
      if (this.canvas) {
        this.stage.width = this.canvas.getBoundingClientRect().width;
        this.stage.height =
          this.canvas.getBoundingClientRect().height * this.stage.aspectRatio;
        // get the center of the stage
        this.stage.centerX = this.stage.width * 0.5;
        this.stage.centerY = this.stage.height * 0.5;
        // resize the pixi app
        if (this.pixiApp) {
          this.pixiApp.renderer.resize(this.stage.width, this.stage.height);
        }
      }
    },
    dataUpdate() {
      console.log(explainModel.modelData);
    },
    statusUpdate() {
      console.log(explainModel.statusMessage);
    },
  },
  beforeUnmount() {
    document.removeEventListener("data", this.dataUpdate);
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("status", this.statusUpdate);
    // get a reference to the stage element
    this.canvas = document.getElementById("stage");
    // set the PIXI resolution
    PIXI.settings.RESOLUTION = 2;
    // define a pixi app with the canvas as view
    this.pixiApp = new PIXI.Application({
      backgroundAlpha: 1.0,
      antialias: true,
      backgroundColor: 0x333333,
      view: this.canvas,
      sortableChildren: true,
    });
    // add the pixi application to the main view
    this.$el.appendChild(this.pixiApp.view);
    // set the renderer view style
    this.pixiApp.renderer.view.style.display = this.display;
    this.pixiApp.renderer.autoResize = true;
    this.pixiApp.stage.interactive = true;
    this.pixiApp.stage.sortableChildren = true;
    // handle the resize
    this.onResize();
    let test = new Compartment(this.pixiApp);
    this.pixiApp.stage.addChild(test.container);
  },
};
</script>

<style scoped>
#stage {
  height: 100%;
  width: 100%;
}
</style>
