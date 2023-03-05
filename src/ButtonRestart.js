import { score } from "./index";

export function AddButtonRestart(scene) {
    const restartbutton = scene.add.image(
        scene.game.config.width / 2,
        scene.game.config.height / 2,
        "restartbutton"
    );
    restartbutton.depth = 2; 
    restartbutton.setInteractive();
    restartbutton.on("pointerover", () => (restartbutton.tint = 0xcccccc));
    restartbutton.on("pointerout", () => (restartbutton.tint = 0xffffff));
    restartbutton.on("pointerdown", () => {
        score.value = 0
        restartbutton.tint = 0xffffff;
        scene.scene.restart();
    });
}
