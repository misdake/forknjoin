import {GameMap} from "../renderer/map";
import {H, W} from "../util";
import {Gamelogic} from "./gamelogic";
import {Action, ImageAsset, LayerId, SoundAsset} from "./enums";
import {SoundAssets} from "../renderer/sound";

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
    }

    update(action: Action, param?: any) {
        //move
        this.gamelogic.keyboard(action, param);

        //tick
        this.gamelogic.tick();

        //check level finish
        let done = this.gamelogic.check();

        if (done) {
            SoundAssets.play(SoundAsset.done);
            setTimeout(() => {
                this.gamelogic.nextLevel();
                this.map.draw(this.canvas, this.context);
            }, 500);
        }

        this.map.draw(this.canvas, this.context);
    }
}