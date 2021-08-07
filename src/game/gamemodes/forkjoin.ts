import {ActionNode, StateNode} from "../history";
import {ActionType} from "../enums";
import {GameMode} from "../gamemode";

export class ForkJoinMode extends GameMode {
    tick(actions: ActionNode[], prev: StateNode): StateNode {
        let actionMap = new Map<number, ActionType>(actions.map((v, i) => [v.id, v.action]));

        let r = new StateNode(prev.time + 1);
        r.staticData = prev.staticData;
        r.dynamicData = prev.dynamicData.clone();
        r.players = prev.players.map(p => {
            let action = actionMap.get(p.id);
            let r = p.clone();
            let s = r.spriteData;
            switch (action) {
                case ActionType.up:
                    s.y = s.y - 1;
                    break;
                case ActionType.down:
                    s.y = s.y + 1;
                    break;
                case ActionType.left:
                    s.x = s.x - 1;
                    break;
                case ActionType.right:
                    s.x = s.x + 1;
                    break;
            }
            return r;
        });

        console.log("tick", actions, prev, r);
        return r;
    }
}