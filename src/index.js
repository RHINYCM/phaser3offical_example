import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import { AddButtonRestart } from "./ButtonRestart.js";

let cursors;
let player;
let stars;
let platforms;
export let score = {value:0};
let scoreText;
let bombs;
let player1;

let gameOver;
let restartButton;

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;

    AddButtonRestart(this);
}

class MyGame extends Phaser.Scene {
    constructor() {
        super();

        this.a=1
    }

    preload() {
        this.load.image("logo", logoImg);
        this.load.image("sky", "/src/assets/sky.png");
        this.load.image("back", "/src/assets/Background_0.png");
        this.load.image("ground", "/src/assets/platform.png");
        this.load.image("star", "/src/assets/star.png");
        this.load.image("restartbutton", "/src/assets/restartbutton.png");
        this.load.image("bomb", "/src/assets/bomb.png");
        this.load.image("Layer", "/src/assets/Layer.png");
        this.load.spritesheet("mainPlayer", "/src/assets/player.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create() {
        this.add.image(400, 300, "back").setScale(1.5);

        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#fff",
        });

        platforms = this.physics.add.staticGroup();

        this.physics.world.debug = true;

        //platforms.create(400, 568, "ground").setScale(2).refreshBody();
        let layer = this.add.image(400,200,'Layer')
        layer.depth =0
        layer.setCrop(0,0,928,793)
        platforms.add(layer)
        let child = platforms.getChildren()[0]
        child.body.setSize(928,70)
        child.body.setOffset(0,730)
        
        player1 = this.physics.add.sprite(200, 450, "mainPlayer");

        player1.body.setSize(16, 32);

        player1.setBounce(0.2);

        player1.setCollideWorldBounds(true);

        this.anims.create({
            key: "turn1",
            frames: [{ key: "mainPlayer", frame: 0 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right1",
            frames: this.anims.generateFrameNumbers("mainPlayer", {
                start: 24,
                end: 32,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "left1",
            frames: this.anims.generateFrameNumbers("mainPlayer", {
                start: 24,
                end: 32,
            }),
            frameRate: 10,
            repeat: -1,
        });

        player1.body.setGravityY(1500);

        this.physics.add.collider(player1, platforms);

        cursors = this.input.keyboard.createCursorKeys();

        stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player1, stars, this.collectStar, null, this);

        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player1, bombs, hitBomb, null, this);
    }

    update() {
        if (cursors.left.isDown) {
            player1.setVelocityX(-200);

            //player1.setScale(-1, 1);
            player1.setFlipX(true)

            player1.anims.play("left1", true);
        } else if (cursors.right.isDown) {
            player1.setVelocityX(200);
            player1.setFlipX(false)

            player1.setScale(1, 1);

            player1.anims.play("right1", true);
        } else {
            player1.setVelocityX(0);

            player1.anims.play("turn1");
        }

        if (cursors.up.isDown && player1.body.touching.down) {
            player1.setVelocityY(-950);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        score.value += 10;
        scoreText.setText("Score: " + score.value);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }

        var x =
            player1.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: MyGame,
};

const game = new Phaser.Game(config);
