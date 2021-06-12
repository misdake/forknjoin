import {GameMap} from "../renderer/map";
import {Action, ImageAsset, LayerId} from "./enums";
import {CELL_IMAGE_MAPPING, CELL_LAYER_MAPPING, levels} from "./levels";
import {H, W} from "../util";
import {Sprite} from "../renderer/sprite";

class GameLevel {
    index: number;
    playerSprite: Sprite;
    crateWood: Sprite[];
    crateMetal: Sprite[];
    targetWood: Sprite[];
    targetMetal: Sprite[];
}

export class Gamelogic {
    private map: GameMap;

    private level: GameLevel;

    constructor(map: GameMap) {
        this.map = map;
    }

    load(index: number) {
        let levelData = levels[index];

        this.level = new GameLevel();
        this.level.playerSprite = null;
        this.level.crateWood = [];
        this.level.crateMetal = [];
        this.level.targetWood = [];
        this.level.targetMetal = [];

        if (levelData.map.length !== W * H) {
            console.log("map size doesn't match!");
            debugger;
        }

        this.map.getLayer(LayerId.trace).clear();
        this.map.getLayer(LayerId.player).clear();
        this.map.getLayer(LayerId.crate).clear();
        this.map.getLayer(LayerId.target).clear();
        this.map.getLayer(LayerId.wall).clear();

        for (let j = 0; j < H; j++) {
            for (let i = 0; i < W; i++) {
                let index = i + j * W;
                let cell = levelData.map[index];
                let layerId = CELL_LAYER_MAPPING[cell];
                let image = CELL_IMAGE_MAPPING[cell];
                if (layerId && image) {
                    let layer = this.map.getLayer(layerId);
                    let sprite = layer.createSprite(i, j, image);

                    switch (image) {
                        case ImageAsset.player:
                            this.level.playerSprite = sprite;
                            break;
                        case ImageAsset.crate_wood:
                            this.level.crateWood.push(sprite);
                            break;
                        case ImageAsset.crate_metal:
                            this.level.crateMetal.push(sprite);
                            break;
                        case ImageAsset.target_wood:
                            this.level.targetWood.push(sprite);
                            break;
                        case ImageAsset.target_metal:
                            this.level.targetMetal.push(sprite);
                            break;
                    }
                }
            }
        }
    }

    keyboard(action: Action, param: any) {
        //TODO fork/join and restart/load
        switch (action) {
            case Action.up:
                this.tryMove(0, -1);
                break;
            case Action.down:
                this.tryMove(0, 1);
                break;
            case Action.left:
                this.tryMove(-1, 0);
                break;
            case Action.right:
                this.tryMove(1, 0);
                break;
            case Action.fork:
                break;
            case Action.join:
                break;
            case Action.restart:
                break;
            case Action.load:
                break;
        }
    }

    private tryMove(dx: number, dy: number) {
        if (!(this.level && this.level.playerSprite)) return;

        let x = this.level.playerSprite.x;
        let y = this.level.playerSprite.y;
        let nx = x + dx;
        let ny = y + dy;

        let wall = this.map.getSprite(nx, ny, LayerId.wall);
        if (wall) return;

        let crate = this.map.getSprite(nx, ny, LayerId.crate);
        if (!crate) {
            this.level.playerSprite.move(nx, ny);
        }
    }

    check() {
        //TODO check each level target has crate
    }
}