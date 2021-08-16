import {ActionNode, PlayerData, StateNode} from "../history";
import {GameMode} from "../gamemode";
import {ActionType, DIRECTION_ASSET, DIRECTION_DX_DY, ImageAsset, LayerId, PLAYER_LAYERS} from "../enums";
import {mapFromDynamic} from "./logicMap";
import {Util} from "./util";

export class ForkJoinMode extends GameMode {
    static readonly instance = new ForkJoinMode();

    private static next_id = 100;

    act(inputAction: ActionType, curr: ActionNode) {
        switch (inputAction) {
            case ActionType.fork:
                let child1 = new ActionNode(curr.time + 1, ++ForkJoinMode.next_id, inputAction, curr);
                let child2 = new ActionNode(curr.time + 1, ++ForkJoinMode.next_id, inputAction, curr);
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
            r.players.push(child);
        });
        r.players.sort((a, b) => a.id - b.id);
        r.players.forEach((p, i) => p.layer = LayerId.player1 + i); //this is the only real layer assignment
        if (r.players.length > PLAYER_LAYERS.length) debugger;

        let dynamicMap = mapFromDynamic(r.dynamicData, r.players);

        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action) {
                case ActionType.up:
                case ActionType.down:
                case ActionType.left:
                case ActionType.right:
                    let [dx, dy] = DIRECTION_DX_DY.get(action);
                    Util.tryPush(p, dx, dy, dynamicMap, r.staticData);
                    break;
            }
        });
        r.players.forEach(p => {
            let action = actionMap.get(p.id);
            switch (action) {
                case ActionType.up:
                case ActionType.down:
                case ActionType.left:
                case ActionType.right:
                    let [dx, dy] = DIRECTION_DX_DY.get(action);
                    let d = DIRECTION_ASSET.get(action);
                    let asset = `player_${d}.png` as ImageAsset;
                    p.spriteData.asset = asset;
                    Util.tryMove(p, dx, dy, dynamicMap, r.staticData);
                    break;
            }
        });

        console.log("tick", actions, prev, r);
        return r;
    }
}