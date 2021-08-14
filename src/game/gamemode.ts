import {ActionNode, StateNode} from "./history";
import {ActionType} from "./enums";
import {Level} from "./levels";
import {SpriteData} from "../renderer/sprite";
import {loadLevelToData} from "./loader";

export abstract class GameMode {
    /**
     * 根据关卡进行初始化，得到一个关卡节点
     * @param level
     */
    initState(level: Level): StateNode {
        let {dynamicData, staticData, players} = loadLevelToData(level);
        let r = new StateNode(0);
        r.time = 0;
        r.staticData = staticData;
        r.dynamicData = dynamicData;
        r.players = players;
        return r;
    }

    initActions(level: Level, state: StateNode) : ActionNode[] {
        let r = state.players.map((v, i) => new ActionNode(0, v.id, ActionType.none, null));
        return r;
    }

    act(inputAction: ActionType, curr: ActionNode) {
        let newAction = new ActionNode(curr.time + 1, curr.id, inputAction, curr);
        curr.nextNodes = [newAction];
        curr.nextNode = newAction;
        newAction.prevNode = curr;
    }

    abstract tick(actions: ActionNode[], prev: StateNode): StateNode;

    check(node: StateNode): boolean {
        let player1 = this.check1(node.staticData.targetPlayer, node.players.map(p => p.spriteData));
        let player2 = this.check1(node.players.map(p => p.spriteData), node.staticData.targetPlayer);
        let wood = this.check1(node.staticData.targetWood, node.dynamicData.crateWood);
        let metal = this.check1(node.staticData.targetMetal, node.dynamicData.crateMetal);
        return player1 && player2 && wood && metal;
    }

    private check1(targets: SpriteData[], sources: SpriteData[]) {
        for (let sprite of targets) {
            let found = sources.some(p => p.x === sprite.x && p.y === sprite.y);
            if (!found) return false;
        }
        return true;
    }
}

