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
    targetPlayer: Sprite[];
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
        this.level.targetPlayer = [];

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
                        case ImageAsset.target_player_1:
                            this.level.targetPlayer.push(sprite);
                            break;
                    }
                }
            }
        }

        this.check();
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

    check(): boolean {
        //check each level target is filled
        let checkMetal = this.checkTarget(this.level.targetMetal, ImageAsset.crate_metal, LayerId.crate, ImageAsset.target_metal_1, ImageAsset.target_metal_2);
        let checkWood = this.checkTarget(this.level.targetWood, ImageAsset.crate_wood, LayerId.crate, ImageAsset.target_wood_1, ImageAsset.target_wood_2);
        let player = this.checkTarget(this.level.targetPlayer, ImageAsset.player, LayerId.player, ImageAsset.target_player_1, ImageAsset.target_player_2);

        let levelDone = checkWood && checkMetal && player;
        if (levelDone) console.log("levelDone", !!levelDone);
        return levelDone;
    }
    private checkTarget(targets: Sprite[], targetAsset: ImageAsset, layerId: LayerId, emptyImage: ImageAsset, doneImage: ImageAsset) {
        let allDone = true;
        for (let target of targets) {
            let targetSprite = this.map.getSprite(target.x, target.y, layerId);
            let isDone = targetSprite && targetSprite.asset === targetAsset;
            allDone = allDone && isDone;
            target.asset = isDone ? doneImage : emptyImage;
        }
        return allDone;
    }
}