import {LogicMap} from "./logicMap";
import {PlayerData, StaticData} from "../history";
import {SpriteData} from "../../renderer/sprite";
import {LayerId} from "../enums";

export class Util {
    public static getCrate(x: number, y: number, dynamicMap: LogicMap, _staticData: StaticData): SpriteData {
        return dynamicMap.get(x, y, LayerId.crate);
    }
    public static isPlayerOk(x: number, y: number, dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !dynamicMap.has(x, y, LayerId.player)
            && !staticData.map.has(x, y, LayerId.wall);
    }
    public static isCrateOk(x: number, y: number, dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !dynamicMap.has(x, y, LayerId.crack)
            && !dynamicMap.has(x, y, LayerId.player)
            && !staticData.map.has(x, y, LayerId.wall);
    }

    public static tryMove(player: PlayerData, dx: number, dy: number, dynamicMap: LogicMap, staticData: StaticData): boolean {
        let newX = player.spriteData.x + dx;
        let newY = player.spriteData.y + dy;
        if (this.isPlayerOk(newX, newY, dynamicMap, staticData)) {
            dynamicMap.move(LayerId.player, player.spriteData, newX, newY);
            return true;
        } else {
            return false;
        }
    }

    public static tryPush(player: PlayerData, dx: number, dy: number, dynamicMap: LogicMap, staticData: StaticData): boolean {
        let nX = player.spriteData.x + dx;
        let nY = player.spriteData.y + dy;
        let nnX = nX + dx;
        let nnY = nY + dy;
        let crate = this.getCrate(nX, nY, dynamicMap, staticData);
        if (crate && this.isCrateOk(nnX, nnY, dynamicMap, staticData)) {
            dynamicMap.move(LayerId.crate, crate, nnX, nnY);
            return true;
        } else {
            return false;
        }
    }
}