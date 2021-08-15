import {CELL_IMAGE_MAPPING, Level} from "./levels";
import {DynamicData, PlayerData, StaticData} from "./history";
import {H, W} from "../util";
import {ImageAsset, LayerId} from "./enums";
import {SpriteData} from "../renderer/sprite";
import {mapFromStatic} from "./gamemodes/logicMap";

export function loadLevelToData(level: Level): { dynamicData: DynamicData, staticData: StaticData, players: PlayerData[] } {
    let dynamicData = new DynamicData();
    let staticData = new StaticData();
    let players: PlayerData[] = [];

    for (let j = 0; j < H; j++) {
        for (let i = 0; i < W; i++) {
            let index = i + j * W;
            let cell = level.map[index];
            let image = CELL_IMAGE_MAPPING[cell];
            if (image) {
                let sprite = SpriteData.create(i, j, image);
                switch (image) {
                    case ImageAsset.player_d: {
                        let p = new PlayerData();
                        p.id = players.length + 1;
                        p.layer = LayerId.player1;
                        p.spriteData = sprite;
                        players.push(p);
                        break;
                    }
                    case ImageAsset.crate_wood:
                        dynamicData.crateWood.push(sprite);
                        break;
                    case ImageAsset.crate_metal:
                        dynamicData.crateMetal.push(sprite);
                        break;
                    case ImageAsset.crack_1:
                        dynamicData.cracks.push(sprite);
                        break;
                    case ImageAsset.target_wood_1:
                        staticData.targetWood.push(sprite);
                        break;
                    case ImageAsset.target_metal_1:
                        staticData.targetMetal.push(sprite);
                        break;
                    case ImageAsset.target_player_1:
                        staticData.targetPlayer.push(sprite);
                        break;
                    case ImageAsset.wall:
                        staticData.wall.push(sprite);
                        break;
                }
            }
        }
    }

    staticData.map = mapFromStatic(staticData);

    return {
        dynamicData,
        staticData,
        players,
    };
}