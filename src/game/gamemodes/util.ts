import {LogicMap} from "./logicMap";
import {PlayerData, PlayerState, StaticData} from "../history";
import {SpriteData} from "../../renderer/sprite";
import {LayerId} from "../enums";

export class Util {
    public static getCrate(x: number, y: number, dynamicMap: LogicMap, _staticData: StaticData): SpriteData {
        return dynamicMap.get(x, y, LayerId.crate);
    }
    public static isPlayerOk(x: number, y: number, players: PlayerData[], dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !staticData.map.has(x, y, LayerId.wall);
    }
    private static isPlayerState(players: PlayerData[], x: number, y: number, ...states: PlayerState[]) {
        for (let player of players) {
            if (player.spriteData.x === x && player.spriteData.y === y) {
                for (let state of states) {
                    if(player.state === state) return true;
                }
            }
        }
        return false;
    }
    public static isCrateOk(x: number, y: number, players: PlayerData[], dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !dynamicMap.has(x, y, LayerId.crack)
            && !this.isPlayerState(players, x, y, PlayerState.NORMAL)
            && !staticData.map.has(x, y, LayerId.wall);
    }

    public static tryMove(player: PlayerData, dx: number, dy: number, players: PlayerData[], dynamicMap: LogicMap, staticData: StaticData): boolean {
        let newX = player.spriteData.x + dx;
        let newY = player.spriteData.y + dy;
        if (this.isPlayerOk(newX, newY, players, dynamicMap, staticData)) {
            dynamicMap.move(player.layer, player.spriteData, newX, newY);
            return true;
        } else {
            return false;
        }
    }

    public static tryPush(player: PlayerData, dx: number, dy: number, players: PlayerData[], dynamicMap: LogicMap, staticData: StaticData): boolean {
        let nX = player.spriteData.x + dx;
        let nY = player.spriteData.y + dy;
        let nnX = nX + dx;
        let nnY = nY + dy;
        let crate = this.getCrate(nX, nY, dynamicMap, staticData);
        if (crate && this.isCrateOk(nnX, nnY, players, dynamicMap, staticData)) {
            dynamicMap.move(LayerId.crate, crate, nnX, nnY);
            return true;
        } else {
            return false;
        }
    }
}