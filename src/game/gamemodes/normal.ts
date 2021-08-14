import {ActionNode, PlayerData, StateNode, StaticData} from "../history";
import {ActionType, LayerId} from "../enums";
import {GameMode} from "../gamemode";
import {LogicMap, mapFromDynamic} from "./util";
import {SpriteData} from "../../renderer/sprite";

export class NormalMode extends GameMode {
    private static getCrate(x: number, y: number, dynamicMap: LogicMap, _staticData: StaticData) : SpriteData {
        return dynamicMap.get(x, y, LayerId.crate);
    }
    private static isPlayerOk(x: number, y: number, dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !dynamicMap.has(x, y, LayerId.player)
            && !staticData.map.has(x, y, LayerId.wall);
    }
    private static isCrateOk(x: number, y: number, dynamicMap: LogicMap, staticData: StaticData) {
        return !dynamicMap.has(x, y, LayerId.crate)
            && !dynamicMap.has(x, y, LayerId.crack)
            && !dynamicMap.has(x, y, LayerId.player)
            && !staticData.map.has(x, y, LayerId.wall);
    }

    private static tryMove(player: PlayerData, dx: number, dy: number, dynamicMap: LogicMap, staticData: StaticData): boolean {
        let newX = player.spriteData.x + dx;
        let newY = player.spriteData.y + dy;
        if (this.isPlayerOk(newX, newY, dynamicMap, staticData)) {
            dynamicMap.move(LayerId.player, player.spriteData, newX, newY);
            return true;
        } else {
            return false;
        }
    }

    private static tryPush(player: PlayerData, dx: number, dy: number, dynamicMap: LogicMap, staticData: StaticData): boolean {
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

    tick(actions: ActionNode[], prev: StateNode): StateNode {
        let actionMap = new Map<number, ActionType>(actions.map((v, i) => [v.id, v.action]));

        let r = new StateNode(prev.time + 1);
        r.staticData = prev.staticData;
        r.dynamicData = prev.dynamicData.clone();
        r.players = prev.players.map(p => p.clone());

        let dynamicMap = mapFromDynamic(r.dynamicData, r.players);

        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action) {
                case ActionType.up:
                    NormalMode.tryPush(p, 0, -1, dynamicMap, r.staticData);
                    break;
                case ActionType.down:
                    NormalMode.tryPush(p, 0, 1, dynamicMap, r.staticData);
                    break;
                case ActionType.left:
                    NormalMode.tryPush(p, -1, 0, dynamicMap, r.staticData);
                    break;
                case ActionType.right:
                    NormalMode.tryPush(p, 1, 0, dynamicMap, r.staticData);
                    break;
            }
        });
        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action) {
                case ActionType.up:
                    NormalMode.tryMove(p, 0, -1, dynamicMap, r.staticData);
                    break;
                case ActionType.down:
                    NormalMode.tryMove(p, 0, 1, dynamicMap, r.staticData);
                    break;
                case ActionType.left:
                    NormalMode.tryMove(p, -1, 0, dynamicMap, r.staticData);
                    break;
                case ActionType.right:
                    NormalMode.tryMove(p, 1, 0, dynamicMap, r.staticData);
                    break;
            }
        });

        console.log("tick", actions, prev, r);
        return r;
    }
}