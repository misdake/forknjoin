import {ActionNode, DynamicData, PlayerData, StateNode, StaticData} from "./history";
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
        let { dynamicData, staticData, players } = loadLevelToData(level);
        let r = new StateNode();
        r.time = 0;
        r.staticData = staticData;
        r.dynamicData = dynamicData;
        r.players = players;
        return r;
    }

    initActions(level: Level, state: StateNode) : ActionNode[] {

    }

    abstract tick(action: ActionType, prev: StateNode): StateNode;

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

export class ForkJoinMode extends GameMode {

    tick(action: ActionType, prev: StateNode): StateNode {
        return undefined;
    }

}