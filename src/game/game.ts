import {GameMap} from "../renderer/map";
import {H, W} from "../util";

export enum ImageAsset {
    placeholder = "placeholder.png",
    player = "player.png",

    wall = "wall.png",

    bg1 = "bg1.png",
    bg2 = "bg2.png",
    bg3 = "bg3.png",
    bg4 = "bg4.png",
}

export enum Action {
    Up = 1,
    Down,
    Left,
    Right,

    Fork = 10,
    Join,

    Restart = 20,
    Load, // param = level id
}

export enum LayerId {
    bg = 1,
    trace,
    crate,
    target,
    player,
    wall
}

export class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.map = new GameMap();

        this.init();
    }

    private map: GameMap;

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

        //charactor
        this.map.visitLayer(LayerId.player, layer => {
            layer.createSprite(3, 3, ImageAsset.player);
        });

        this.map.draw(this.canvas, this.context);
    }

    update(action: Action, param?: any) {
        console.log(action);
        this.map.draw(this.canvas, this.context);
    }

    //TODO load map


}