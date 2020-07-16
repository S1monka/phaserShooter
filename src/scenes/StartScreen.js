import Phaser from "phaser";

import bg from "../assets/background.png";

import player from "../assets/player.png";
import beam from "../assets/beam.png";

import ship1 from "../assets/ship.png";
import ship2 from "../assets/ship2.png";
import ship3 from "../assets/ship3.png";
import explosion from "../assets/explosion.png";

import powerUp from "../assets/power-up.png";

export default class StartScreen extends Phaser.Scene {
  constructor() {
    super("startScreen");
  }

  preload() {
    this.load.image("bg", bg);
    this.load.spritesheet("player", player, {
      frameWidth: 16,
      frameHeight: 24,
    });
    this.load.spritesheet("beam", beam, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("ship1", ship1, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("ship2", ship2, {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.spritesheet("ship3", ship3, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("explosion", explosion, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("power-up", powerUp, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  create() {
    const { width, height } = this.scale;

    this.background = this.add.image(0, 0, "bg");
    this.background.setOrigin(0, 0).setScale(3.15, 2.25);

    this.add.text(width / 2.66, height / 2, "Press space to start", {
      fontSize: 24,
      fontFamily: "Arial",
    });

    this.input.keyboard.once("keydown_SPACE", () => {
      this.scene.start("game");
    });

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship1"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: `ship3_anim`,
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1,
    });
  }
}
