import {CELL_IMAGE_MAPPING, CELL_LAYER_MAPPING, Level} from "./levels";
import {DynamicData, PlayerData, StaticData} from "./history";
import {H, W} from "../util";
import {ImageAsset} from "./enums";

export function init(level: Level): { dynamicData: DynamicData, staticData: StaticData, players: PlayerData[] } {
    let dynamicData = new DynamicData();
    let staticData = new StaticData();
    let players : PlayerData[] = [];

    for (let j = 0; j < H; j++) {
        for (let i = 0; i < W; i++) {
            let index = i + j * W;
            let cell = level.map[index];
            let layerId = CELL_LAYER_MAPPING[cell];
            let image = CELL_IMAGE_MAPPING[cell];
            if (layerId && image) {
                switch (image) {
                    case ImageAsset.player_d:
                        players.push(new PlayerData());
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
                    case ImageAsset.crack_1:
                        this.level.cracks.push(sprite);
                        break;
                }
            }
        }
    }

}