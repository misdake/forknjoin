import {Assets, ImageAsset} from "./assets";

console.log("start!");

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d");

let w = canvas.clientWidth;
let h = canvas.clientHeight;

console.log(w, h);

canvas.width = w;
canvas.height = h;

context.clearRect(0, 0, w, h);
context.strokeStyle = "gray";
context.strokeRect(0, 0, w, h);

(async function () {
    await Assets.init();

    let image = Assets.get(ImageAsset.Character);
    context.drawImage(image, 0, 0, 64, 64);
})();