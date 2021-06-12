import {GameMap} from "../renderer/map";
import {H, W} from "../util";
import {Gamelogic} from "./gamelogic";
import {Action, ImageAsset, LayerId} from "./enums";
import {levels} from "./levels";

export class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private readonly map: GameMap;
    private readonly gamelogic: Gamelogic;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.map = new GameMap();

        this.init();

        this.gamelogic = new Gamelogic(this.map);
        this.gamelogic.load(0);

        this.map.draw(this.canvas, this.context);
    }

    init() {
        //bg
        this.map.visitLayer(LayerId.bg, layer => {
            for (let i = 0; i < W; i++) {
                for (let j = 0; j < H; j++) {
                    let n = Math.floor(Math.random() * 4) + 1;
                    let asset = ImageAsset.placeholder;
                    // @formatter:off
                    switch (n) {
                        case 1: asset = ImageAsset.bg1; break;
                        case 2: asset = ImageAsset.bg2; break;
                        case 3: asset = ImageAsset.bg3; break;
                        case 4: asset = ImageAsset.bg4; break;
                    }
                    // @formatter:on
                    layer.createSprite(i, j, asset);
                }
            }
        });

        //level buttons
        let buttonsHtml = "";
        for (let i = 0; i < levels.length; i++) {
            buttonsHtml = buttonsHtml + `<button id="load${i}" style="font-size: 16px;">${i + 1}</button>\n`;
        }
        document.getElementById("levels").innerHTML = buttonsHtml;
        for (let i = 0; i < levels.length; i++) {
            let button = document.getElementById(`load${i}`);
            button.onclick = () => {
                this.gamelogic.load(i);
                this.map.draw(this.canvas, this.context);
            };
        }
    }

    update(action: Action, param?: any) {
        //move
        this.gamelogic.keyboard(action, param);

        //tick
        this.gamelogic.tick();

        //check level finish
        let done = this.gamelogic.check();

        if (done) {
            let nextLevel = this.gamelogic.hasNextLevel();
            if (nextLevel > 0) {
                setTimeout(() => {
                    this.gamelogic.load(nextLevel);
                    this.map.draw(this.canvas, this.context);
                }, 500);
            } else {
                console.log("all done!");
                document.getElementById("alldone").style.display = "block";
            }
        }

        this.map.draw(this.canvas, this.context);
    }
}