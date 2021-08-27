import {ActionNode, PlayerData, PlayerState, StateNode} from "../history";
import {ActResult, GameMode} from "../gamemode";
import {ActionType, DIRECTION_DX_DY, LayerId, PLAYER_LAYERS, playerAssetByIndexDirection} from "../enums";
import {mapFromDynamic} from "./logicMap";
import {Util} from "./util";

export class ForkJoinMode extends GameMode {
    static readonly instance = new ForkJoinMode();

    private static next_id = 100;

    act(inputAction: ActionType, curr: ActionNode, roots: ActionNode[]): ActResult {
        switch (inputAction) {
            case ActionType.fork:
                let child1 = new ActionNode(curr.time + 1, ++ForkJoinMode.next_id, inputAction, curr);
                let child2 = new ActionNode(curr.time + 1, ++ForkJoinMode.next_id, inputAction, curr);
                curr.nextNodes = [child1, child2];
                curr.nextNode = child2;
                child1.prevNode = curr;
                child2.prevNode = curr;
                return {nextNode: curr.nextNode, runTick: true};

            case ActionType.switch:
                //find next player
                let actions = ForkJoinMode.findActions(curr.time, roots);
                let next = ForkJoinMode.findNextPlayer(curr, actions);
                return {nextNode: next, runTick: false};

            default:
                return super.act(inputAction, curr, roots);
        }
    }

    private static findActions(time: number, roots: ActionNode[]): ActionNode[] {
        let r: ActionNode[] = [];
        ActionNode.visitAllChildren(roots, node => {
            if (node.time === time) {
                r.push(node);
            } else if (node.time < time && !node.nextNode) {
                r.push(node);
            }
            return node.time <= time;
        });
        return r;
    }
    private static findNextPlayer(curr: ActionNode, actions: ActionNode[]): ActionNode {
        let index = actions.indexOf(curr);
        if (index < 0) debugger;
        let nextIndex = (index + 1) % actions.length;
        return actions[nextIndex];
    }

    tick(actions: ActionNode[], prev: StateNode, curr: ActionNode): StateNode {
        let actionMap = new Map<number, ActionNode>(actions.map(v => [v.id, v]));
        let actionIsLast = new Map<number, boolean>(actions.map(v => [v.id, !v.nextNode]));

        let prevPlayers = new Map<number, PlayerData>(prev.players.map(p => [p.id, p]));
        let forkActions = actions.filter(v => v.action === ActionType.fork && prevPlayers.has(v.prevNode.id));

        let r = new StateNode(prev.time + 1);
        r.staticData = prev.staticData;
        r.dynamicData = prev.dynamicData.clone();
        r.players = prev.players.map(p => p.clone());

        //fork
        r.players = r.players.filter(p => {
            let action = actionMap.get(p.id);
            if (action) p.action = action;
            return action;
        });
        forkActions.forEach(action => {
            let parent = prevPlayers.get(action.prevNode.id);
            let child = parent.clone();
            child.id = action.id;
            r.players.push(child);
        });
        r.players.sort((a, b) => a.id - b.id);
        r.players.forEach((p, i) => {
            p.layer = LayerId.player0 + i;
            p.state = PlayerState.NORMAL;
            if (actionIsLast.get(p.id)) p.state = PlayerState.LAST;
            if (actionMap.get(p.id).action === ActionType.none) p.state = PlayerState.FINISHED;
        });
        if (r.players.length > PLAYER_LAYERS.length) debugger;

        //move and push
        let dynamicMap = mapFromDynamic(r.dynamicData, r.players);
        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action.action) {
                case ActionType.up:
                case ActionType.down:
                case ActionType.left:
                case ActionType.right:
                    let [dx, dy] = DIRECTION_DX_DY.get(action.action);
                    Util.tryPush(p, dx, dy, r.players, dynamicMap, r.staticData);
                    break;
            }
        });
        r.players.forEach((p, i) => {
            let action = actionMap.get(p.id);
            switch (action.action) {
                case ActionType.up:
                case ActionType.down:
                case ActionType.left:
                case ActionType.right:
                    let [dx, dy] = DIRECTION_DX_DY.get(action.action);
                    p.direction = action.action;
                    Util.tryMove(p, dx, dy, r.players, dynamicMap, r.staticData);
                    break;
            }
            p.spriteData.asset = playerAssetByIndexDirection(i, p.direction);
        });

        //join
        // r.players
        //TODO check last/none state, 0~n-1 x i+1~n-1,
        let finished = r.players.filter(p => p.state === PlayerState.FINISHED || (p.action !== curr && p.state === PlayerState.LAST));
        // let finished = r.players.filter(p => p.state === PlayerState.NORMAL);

        console.log("tick", actions, prev, r);
        return r;
    }
}