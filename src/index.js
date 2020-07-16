import Phaser from "phaser";
import StartScreen from "./scenes/StartScreen";
import Game from "./scenes/Game";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [StartScreen, Game],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
