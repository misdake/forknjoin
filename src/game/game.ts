import {GameMap} from "../renderer/map";
import {H, W} from "../util";
import {Gamelogic} from "./gamelogic";
import {Action, ImageAsset, LayerId} from "./enums";

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

        //wall
        this.map.visitLayer(LayerId.wall, layer => {
            for (let i = 0; i < W; i++) {
                let asset = ImageAsset.wall;
                layer.createSprite(i, 0, asset);
                layer.createSprite(i, H - 1, asset);
            }
            for (let j = 1; j < H - 1; j++) {
                let asset = ImageAsset.wall;
                layer.createSprite(0, j, asset);
                layer.createSprite(W - 1, j, asset);
            }
        });

        this.map.draw(this.canvas, this.context);
    }

    update(action: Action, param?: any) {
        //move
        this.gamelogic.keyboard(action, param);

        //check level finish
        this.gamelogic.check();

        this.map.draw(this.canvas, this.context);
    }
}