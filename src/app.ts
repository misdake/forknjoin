import {ImageAssets} from "./renderer/image";
import {Game} from "./game/game";
import {H, TILE_SIZE, W} from "./util";
import {Action} from "./game/enums";
import {SoundAssets} from "./renderer/sound";

let container = document.getElementById("container");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d");

let hints = document.getElementsByClassName("hint");

let w = TILE_SIZE * W;
let h = TILE_SIZE * H;
canvas.width = w;
canvas.height = h;
canvas.style.width = w + "px";
canvas.style.height = h + "px";
for (let hint of hints) {
    let element = hint as HTMLDivElement;
    element.style.width = w + "px";
    element.style.height = h + "px";
}
container.style.width = (w + 150) + "px";
container.style.height = h + "px";

context.clearRect(0, 0, w, h);
context.strokeStyle = "gray";
context.strokeRect(0, 0, w, h);

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

if (isTouchDevice()) {
    document.getElementById("touchbuttons").style.display = "block";
    document.getElementById("keymap").style.display = "none";
} else {
    document.getElementById("touchbuttons").style.display = "none";
    document.getElementById("keymap").style.display = "block";
}

(async function () {
    await ImageAssets.init();
    await SoundAssets.init();

    document.getElementById("loading").style.display = "none";

    let game = new Game(canvas, context);

    window.onkeypress = event => {
        // @formatter:off
        let action = null;
        switch (event.key) {
            case 'w': action = Action.up; break;
            case 'a': action = Action.left; break;
            case 's': action = Action.down; break;
            case 'd': action = Action.right; break;
            case ' ': action = Action.idle; break;

            case 'j': action = Action.join; break;
            case 'k': action = Action.fork; break;

            case 'z': action = Action.undo; break;
            case 'x': action = Action.redo; break;

            case 'r': action = Action.restart; break;
        }
        // @formatter:on

        if (action) {
            game.update(action);
        }
    };
})();
