import {ActionNode, PlayerData, StateNode, StaticData} from "../history";
import {ActionType, LayerId} from "../enums";
import {GameMode} from "../gamemode";
import {LogicMap, mapFromDynamic} from "./util";

export class NormalMode extends GameMode {
    private tryMove(player: PlayerData, dx: number, dy: number, dynamicMap: LogicMap, staticData: StaticData): boolean {
        let newX = player.spriteData.x + dx;
        let newY = player.spriteData.y + dy;
        if (staticData.map.has(newX, newY, LayerId.wall)) {
            return false;
        } else {
            player.spriteData.x = newX;
            player.spriteData.y = newY;
            return true;
        }
    }


    tick(actions: ActionNode[], prev: StateNode): StateNode {
        let actionMap = new Map<number, ActionType>(actions.map((v, i) => [v.id, v.action]));

        let r = new StateNode(prev.time + 1);
        r.staticData = prev.staticData;
        r.dynamicData = prev.dynamicData.clone();

        let dynamicMap = mapFromDynamic(r.dynamicData);

        r.players = prev.players.map(p => {
            let action = actionMap.get(p.id);
            let result = p.clone();
            switch (action) {
                case ActionType.up:
                    this.tryMove(result, 0, -1, dynamicMap, r.staticData);
                    break;
                case ActionType.down:
                    this.tryMove(result, 0, 1, dynamicMap, r.staticData);
                    break;
                case ActionType.left:
                    this.tryMove(result, -1, 0, dynamicMap, r.staticData);
                    break;
                case ActionType.right:
                    this.tryMove(result, 1, 0, dynamicMap, r.staticData);
                    break;
            }
            return result;
        });

        console.log("tick", actions, prev, r);
        return r;
    }
}