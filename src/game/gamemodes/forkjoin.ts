import {ActionNode, PlayerData, StateNode} from "../history";
import {GameMode} from "../gamemode";
import {NormalMode} from "./normal";
import {ActionType} from "../enums";
import {mapFromDynamic} from "./logicMap";
import {Util} from "./util";

export class ForkJoinMode extends GameMode {
    static readonly instance = new ForkJoinMode();

    private static next_id = 0;

    act(inputAction: ActionType, curr: ActionNode) {
        switch (inputAction) {
            case ActionType.fork:
                let child1 = new ActionNode(curr.time + 1, ForkJoinMode.next_id++, inputAction, curr);
                let child2 = new ActionNode(curr.time + 1, ForkJoinMode.next_id++, inputAction, curr);
                curr.nextNodes = [child1, child2];
                curr.nextNode = child1;
                child1.prevNode = curr;
                child2.prevNode = curr;
                break;
            default:
                super.act(inputAction, curr);
        }
    }

    tick(actions: ActionNode[], prev: StateNode): StateNode {
        let actionMap = new Map<number, ActionType>(actions.map((v, i) => [v.id, v.action]));

        let prevPlayers = new Map<number, PlayerData>(prev.players.map(p => [p.id, p]));
        let forkActions = actions.filter(v => v.action === ActionType.fork && prevPlayers.has(v.prevNode.id));

        let r = new StateNode(prev.time + 1);
        r.staticData = prev.staticData;
        r.dynamicData = prev.dynamicData.clone();
        r.players = prev.players.map(p => p.clone());

        r.players = r.players.filter(p => actionMap.get(p.id));
        forkActions.forEach(action => {
            let parent = prevPlayers.get(action.prevNode.id);
            let child = parent.clone();
            child.id = action.id;
            r.players.push(child); //TODO two players will be at same spot in LogicMap.
        });
        r.players.sort((a, b) => a.id - b.id);

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