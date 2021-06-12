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
                        case ImageAsset.target_wood_1:
                            this.level.targetWood.push(sprite);
                            break;
                        case ImageAsset.target_metal_1:
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

        if (!this.map.getSprite(nx, ny, LayerId.bg)) return;

        let wall = this.map.getSprite(nx, ny, LayerId.wall);
        if (wall) return;

        if (this.isEmpty(nx, ny)) {
            //empty => move
            this.level.playerSprite.move(nx, ny);
        } else {
            let crate = this.map.getSprite(nx, ny, LayerId.crate);
            if (crate) {
                //crate => try push
                let nnx = x + dx * 2;
                let nny = y + dy * 2;
                if (this.isEmpty(nnx, nny)) {
                    crate.move(nnx, nny);
                    this.level.playerSprite.move(nx, ny);
                }
            }
        }
    }
    private isEmpty(x: number, y: number) {
        return this.map.getSprite(x, y, LayerId.bg)
            && !this.map.getSprite(x, y, LayerId.wall, LayerId.player, LayerId.crate);
    }

    check() {
        let levelDone = true;

        //check each level target has crate
        for (let targetMetal of this.level.targetMetal) {
            let crate = this.map.getSprite(targetMetal.x, targetMetal.y, LayerId.crate);
            let filled = crate && crate.asset === ImageAsset.crate_metal;
            levelDone = levelDone && filled;
            targetMetal.asset = filled ? ImageAsset.target_metal_2 : ImageAsset.target_metal_1;
        }

        for (let targetWood of this.level.targetWood) {
            let crate = this.map.getSprite(targetWood.x, targetWood.y, LayerId.crate);
            let filled = crate && crate.asset === ImageAsset.crate_wood;
            levelDone = levelDone && filled;
            targetWood.asset = filled ? ImageAsset.target_wood_2 : ImageAsset.target_wood_1;
        }

        console.log("levelDone", levelDone);
    }
}