import {ImageAssets} from "./renderer/image";
import {Game} from "./game/game";
import {H, TILE_SIZE, W} from "./util";
import {Action} from "./game/enums";

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d");

let w = TILE_SIZE * W;
let h = TILE_SIZE * H;
canvas.width = w;
canvas.height = h;
canvas.style.width = w + "px";
canvas.style.height = h + "px";

context.clearRect(0, 0, w, h);
context.strokeStyle = "gray";
context.strokeRect(0, 0, w, h);

(async function () {
    await ImageAssets.init();

    let game = new Game(canvas, context);

    window.onkeypress = event => {
        // @formatter:off
        let action = null;
        switch (event.key) {
            case 'w': action = Action.up; break;
            case 'a': action = Action.left; break;
            case 's': action = Action.down; break;
            case 'd': action = Action.right; break;
            case 'j': action = Action.join; break;
            case 'k': action = Action.fork; break;
            case 'r': action = Action.restart; break;
        }
        // @formatter:on

        if (action) {
            game.update(action);
        }
    };
})();
