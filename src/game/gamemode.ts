import {StateNode} from "./history";
import {ActionType} from "./enums";
import {Level} from "./levels";
import {SpriteData} from "../renderer/sprite";

export abstract class GameMode {
    /**
     * 根据关卡进行初始化，得到一个关卡节点
     * @param level
     */
    abstract init(level: Level): StateNode;

    abstract tick(action: ActionType, prev: StateNode): StateNode;

    check(node: StateNode): boolean {
        //TODO 检查每个终点上是不是都有一个有操作的player
        let player = this.check1(node.staticData.targetPlayer, node.player.map(p => p.spriteData));
        let wood = this.check1(node.staticData.targetWood, node.dynamicData.crateWood);
        let metal = this.check1(node.staticData.targetMetal, node.dynamicData.crateMetal);
        return player && wood && metal;
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

    init(level: Level): StateNode {
        return undefined;
    }
    tick(action: ActionType, prev: StateNode): StateNode {
        return undefined;
    }

}