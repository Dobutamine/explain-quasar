import heart from "../assets/ecg2.jpg";
import { PIXI } from "../boot/pixijs";

export default class Compartment {
  app = {};
  container = {};
  graphics = {};
  text = {};

  changeSize() {
    this.container.scale.x = 5;
    this.container.scale.y = 5;
  }
  constructor(pixiApp) {
    // store a reference to the pixi application
    this.app = pixiApp;

    // define a container for this component and add it to the stage
    this.container = new PIXI.Container();
    //this.app.stage.addChild(this.container);

    // graphics object
    const graphics = new PIXI.Graphics();
    // Rectangle
    graphics.beginFill(0xde3249);
    graphics.drawCircle(0, 0, 50);
    graphics.endFill();
    this.container.addChild(graphics);

    // // create a texture
    // const texture = PIXI.Texture.from(heart);

    // // convert the texture to a sprite and add it to the container
    // const ecg = new PIXI.Sprite(texture);
    // this.container.addChild(ecg);

    // Create contents for the masked container
    let text = new PIXI.Text("COMPARTMENT", {
      fill: "white",
      fontSize: 16,
      fontFamily: "Tahoma",
      fontStyle: "bold",
      strokeThickness: 1,
      antialias: true,
    });
    text.anchor.set(0.5);
    text.y = 75;

    this.container.addChild(text);
    // don't forget to destroy a grpahics object when no longer needed (causes memory leaks otherwise)

    // move the container to center
    this.container.x = pixiApp.screen.width - 100;
    this.container.y = pixiApp.screen.height / 4;

    // set the pivot point of the container
    // this.container.pivot.x = this.container.width / 2;
    // this.container.pivot.y = this.container.height / 2;

    // set the scale of the container
    this.container.scale.x = 0.5;
    this.container.scale.y = 0.5;

    // create a filter
    const blurFilter = new PIXI.filters.BlurFilter();
    // container.filters = [blurFilter];
  }
}
