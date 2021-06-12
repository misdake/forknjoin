import {GameMap} from "../renderer/map";
import {Action, ImageAsset, LayerId} from "./enums";
import {CELL_IMAGE_MAPPING, CELL_LAYER_MAPPING, levels} from "./levels";
import {H, W} from "../util";

export class Gamelogic {
    private map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
    }

    load(index: number) {
        let level = levels[index];

        if (level.map.length !== W * H) {
            console.log("map size doesn't match!");
            debugger;
        }

        this.map.getLayer(LayerId.trace).clear();
        this.map.getLayer(LayerId.moveable).clear();
        this.map.getLayer(LayerId.target).clear();
        this.map.getLayer(LayerId.wall).clear();

        for (let j = 0; j < H; j++) {
            for (let i = 0; i < W; i++) {
                let index = i + j * W;
                let cell = level.map[index];
                let layer = CELL_LAYER_MAPPING[cell];
                let image = CELL_IMAGE_MAPPING[cell];
                if (layer && image) {
                    this.map.getLayer(layer).createSprite(i, j, image);
                }

                switch (image) {
                    case ImageAsset.player:
                        //TODO log player
                        break;
                    case ImageAsset.crate_wood:
                        //TODO log wood crate
                        break;
                    case ImageAsset.crate_metal:
                        break;
                    case ImageAsset.target_wood:
                        break;
                    case ImageAsset.target_metal:
                        break;
                }
            }
        }
    }

    private currentLevel = 0;

    keyboard(action: Action, param: any) {
        //TODO wasd or fork/join or restart/load
    }

    check() {

    }
}