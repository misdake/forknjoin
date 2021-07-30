import {HistoryNode} from "./history";
import {ActionType} from "./enums";
import {Level} from "./levels";

export abstract class GameMode {
    /**
     * 根据关卡进行初始化，得到一个关卡节点
     * @param level
     */
    abstract init(level: Level): HistoryNode;

    abstract tick(action: ActionType, prev: HistoryNode): HistoryNode;

    check(node: HistoryNode): boolean {
        //TODO 检查每个终点上是不是都有一个有操作的player

    }
}

export class ForkJoinMode extends GameMode {

    init(level: Level): HistoryNode {
        return undefined;
    }
    tick(action: ActionType, prev: HistoryNode): HistoryNode {
        return undefined;
    }

}