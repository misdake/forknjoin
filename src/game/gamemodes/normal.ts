import {ActionNode, StateNode} from "../history";
import {ActionType} from "../enums";
import {GameMode} from "../gamemode";
import {mapFromDynamic} from "./logicMap";
import {Util} from "./util";

export class NormalMode extends GameMode {
    static readonly instance = new NormalMode();

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
                    Util.tryPush(p, 0, -1, dynamicMap, r.staticData);
                    break;
                case ActionType.down:
                    Util.tryPush(p, 0, 1, dynamicMap, r.staticData);
                    break;
                case ActionType.left:
                    Util.tryPush(p, -1, 0, dynamicMap, r.staticData);
                    break;
                case ActionType.right:
                    Util.tryPush(p, 1, 0, dynamicMap, r.staticData);
                    break;
            }
        });
        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action) {
                case ActionType.up:
                    Util.tryMove(p, 0, -1, dynamicMap, r.staticData);
                    break;
                case ActionType.down:
                    Util.tryMove(p, 0, 1, dynamicMap, r.staticData);
                    break;
                case ActionType.left:
                    Util.tryMove(p, -1, 0, dynamicMap, r.staticData);
                    break;
                case ActionType.right:
                    Util.tryMove(p, 1, 0, dynamicMap, r.staticData);
                    break;
            }
        });

        console.log("tick", actions, prev, r);
        return r;
    }
}