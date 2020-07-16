import Phaser from "phaser";
import Beam from "../game/beam";
import Explosion from "../game/explosion";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    const { width, height } = this.scale;

    this.background = this.add.tileSprite(0, 0, width, height, "bg");
    this.background.setOrigin(0, 0).setScale(3.15, 2.25);

    this.score = 0;
    this.scoreLabel = this.add.text(10, 5, "SCORE 0 ", { fontSize: 16 });

    this.player = this.physics.add
      .sprite(width / 2, height - 50, "player")
      .setScale(1.5);
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.projectiles = this.add.group();

    this.ship1 = this.add
      .sprite(Phaser.Math.Between(0, width), 0, "ship1")
      .setScale(1.5);
    this.ship2 = this.add
      .sprite(Phaser.Math.Between(0, width), 0, "ship2")
      .setScale(1.75);
    this.ship3 = this.add
      .sprite(Phaser.Math.Between(0, width), 0, "ship3")
      .setScale(2);

    this.powerUps = this.physics.add.group();

    const maxObjects = 4;
    for (let i = 0; i <= maxObjects; i++) {
      this.setPowerUp();
    }

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gameobjectdown", this.destroyShip, this);

    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      (projectile, powerUp) => {
        projectile.destroy();
      }
    );

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
  }

  update() {
    this.moveShip(this.ship1, 2);
    this.moveShip(this.ship2, 3);
    this.moveShip(this.ship3, 5);

    this.background.tilePositionY -= 0.5;

    this.movePlayerManage();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }
    for (let i = 0; i < this.projectiles.getChildren().length; i++) {
      const beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > this.scale.height) {
      this.resetShips(ship);
    }
  }

  resetShips(ship) {
    ship.y = -100;
    const randomX = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManage() {
    const speed = 300;

    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }
  }

  shootBeam() {
    const beam = new Beam(this);
  }

  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);

    this.score += 100;
    this.scoreLabel.text = "SCORE " + this.score;

    this.time.addEvent({
      delay: 5000,
      callback: this.setPowerUp,
      callbackScope: this,
      loop: false,
    });
  }

  setPowerUp() {
    const powerUp = this.physics.add.sprite(16, 16, "power-up");
    this.powerUps.add(powerUp);
    powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

    if (Math.random() > 0.5) {
      powerUp.play("red");
    } else {
      powerUp.play("gray");
    }

    powerUp.setVelocity(100, 100);
    powerUp.setBounce(1);

    powerUp.setScale(1.25);

    powerUp.setCollideWorldBounds(true);
  }

  hurtPlayer(player, enemy) {
    this.resetShips(enemy);

    if (this.player.alpha < 1) {
      return;
    }

    let explosion = new Explosion(this, player.x, player.y);

    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false,
    });
  }

  resetPlayer() {
    const x = this.scale.width / 2 - 10;
    const y = this.scale.height + 50;

    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    const tween = this.tweens.add({
      targets: this.player,
      y: this.scale.width - 50,
      ease: "Power1",
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this,
    });
  }

  hitEnemy(beam, enemy) {
    let explosion = new Explosion(this, enemy.x, enemy.y);

    beam.destroy();
    this.resetShips(enemy);
    this.score += 15;
    this.scoreLabel.text = "SCORE " + this.score;
  }
}
