import {ImageAssets} from "./renderer/image";
import {Action, Game} from "./game/game";
import {H, TILE_SIZE, W} from "./util";

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
            case 'w': action = Action.Up; break;
            case 'a': action = Action.Left; break;
            case 's': action = Action.Down; break;
            case 'd': action = Action.Right; break;
            case 'j': action = Action.Join; break;
            case 'k': action = Action.Fork; break;
            case 'r': action = Action.Restart; break;
        }
        // @formatter:on

        if (action) {
            game.update(action);
        }
    };
})();
