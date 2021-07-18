import {GameMap} from "../renderer/map";
import {H, W} from "../util";
import {Gamelogic} from "./gamelogic";
import {Action, ImageAsset, LayerId} from "./enums";
import {levels, startLevel} from "./levels";

export class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private readonly map: GameMap;
    private readonly gamelogic: Gamelogic;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.map = new GameMap(canvas, context);

        this.init();

        // @ts-ignore
        window.loadlevel = (level) => {
            levels[0] = level;
            this.gamelogic.load(0);
        };

        this.gamelogic = new Gamelogic(this.map);
        this.gamelogic.load(startLevel);
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
            buttonsHtml = buttonsHtml + `
                <div style="position: relative;">
                    <div class="levelbutton-bg" id="load${i}bg"></div>
                    <button class="levelbutton" id="load${i}">${i + 1}</button>
                </div>\n
            `;
        }
        document.getElementById("levels").innerHTML = buttonsHtml;
        for (let i = 0; i < levels.length; i++) {
            let button = document.getElementById(`load${i}`);
            button.onclick = () => {
                this.gamelogic.load(i);
                button.blur();
            };
        }
    }

    update(action: Action) {
        //move
        this.gamelogic.update(action);

        //check level finish
        let done = this.gamelogic.check();

        if (done) {
            console.log("levelDone");
            let nextLevel = this.gamelogic.hasNextLevel();
            if (nextLevel > 0) {
                setTimeout(() => {
                    this.gamelogic.load(nextLevel);
                }, 500);
            } else {
                console.log("all done!");
                document.getElementById("alldone").style.display = "block";
            }
        }
    }
}