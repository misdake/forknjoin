import {SpriteData} from "../renderer/sprite";
import {ActionType} from "./enums";

export class History {
    root: Node;
    current: Node;

    forkStatus: string; //guide to follow the right branch when redo

    init(node: HistoryNode) {
        this.current = node;
        this.root = node;

        node.parent = null;
        node.forkStatus = "";
        this.forkStatus = "";
    }

    getNodesByTime(time: number): HistoryNode[] {
        return this.visit(this.root, (node: HistoryNode) => node.time === time || (node.time < time && !node.next), []);
    }
    private visit(current: HistoryNode, pred: (node: HistoryNode) => boolean, result: HistoryNode[]): HistoryNode[] {
        if (pred(current)) {
            result.push(current);
        }
        if (current.next) this.visit(current.next, pred, result);
        if (current.fork) this.visit(current.fork, pred, result);
        return result;
    }

    writeNext(node: HistoryNode) {
        this.current.next = node;
        node.parent = this.current;
        this.forkStatus = node.forkStatus;
    }

    forkNext() {
        let next = this.current.cloneData(ActionType.fork);
        let fork = this.current.cloneData(ActionType.fork);
        next.time += 1;
        next.forkStatus += "n";
        fork.time += 1;
        fork.forkStatus += "f";
        this.current.next = next;
        this.current.fork = fork;
        next.parent = this.current;
        fork.parent = this.current;
        this.forkStatus = fork.forkStatus;
    }

    private static findParent(from: HistoryNode, pred: (node: HistoryNode) => boolean): HistoryNode {
        while (!pred(from) && from.parent) {
            from = from.parent;
        }
        return pred(from) ? from : null;
    }
    backToForkNext(callback: (node: HistoryNode) => void) {
        let s = this.current.forkStatus;
        while (s.length > 0 && s.charAt(s.length - 1) === 'n') {
            s = s.substring(0, s.length - 1);
        }
        if (s.length === 0) {
            console.log("no valid parent");
            return;
        }
        let targetStatus = s.substring(0, s.length - 1);
        let next = History.findParent(this.current, node => node.forkStatus === targetStatus);
        next = next.next;
        console.log(`look for status: ${this.current.forkStatus}=>${targetStatus}, result:`, next);
        if (next) {
            this.current = next;
            this.forkStatus = this.current.forkStatus;
            callback(this.current);
        }
    }

    undo(callback: (node: HistoryNode) => void) {
        if (this.current.parent) {
            this.current = this.current.parent;
            callback(this.current);
        }
    }

    redo(callback: (node: HistoryNode) => void) {
        if (this.current.fork) {
            if (this.forkStatus.startsWith(this.current.fork.forkStatus)) {
                this.current = this.current.fork;
                callback(this.current);
                return;
            }
        }
        if (this.current.next) {
            if (this.forkStatus.startsWith(this.current.next.forkStatus)) {
                this.current = this.current.next;
                callback(this.current);
                return;
            }
        }
        console.log("no redo!");
    }
}

export class PlayerData {
    action: ActionType; //如果是none就认为是落后于当前时间线而填充的内容
    currentX: number;
    currentY: number;
    currentDirection: ActionType; //只允许udlr之一，用来指定上下左右图像

    //在undo/redo时指定下一个默认currIndex。在fork和join的时候可以分开
    nextIndex: number;
    prevIndex: number;
}

export class HistoryInput {

    private readonly inputs: ActionType[][]; //inputs[playerIndex][time]

    constructor(playerCount: number) {
        this.inputs = [];
        for (let i = 0; i < playerCount; i++) {
            this.inputs[i] = [];
        }
    }
    setInput(time: number, playerIndex: number, action: ActionType): void {
        //set
        this.inputs[playerIndex][time] = action;
        //remove later inputs
        this.inputs[playerIndex].length = time + 1;
    }

    getInput(time: number, playerIndex: number): ActionType {
        let lastTime = this.getLastInputTime(playerIndex);
        if (lastTime < time) {
            return ActionType.none;
        } else {
            return this.inputs[playerIndex][time];
        }
    }
    getLastInputTime(playerIndex: number): number {
        return this.inputs[playerIndex].length - 1;
    }
    getInputs(time: number): ActionType[] {
        let r: ActionType[] = [];
        //return none if lastInput < time
        for (let i = 0; i < this.inputs.length; i++) {
            r[i] = this.getInput(time, i);
        }
        return r;
    }

}

export class Node {
    time: number;

    parent: Node;
    next: Node;

    currIndex: number; //当前操作的player，用switch来切换
    players: PlayerData[];

    //saved data for rendering
    cracks: SpriteData[];
    crateWood: SpriteData[];
    crateMetal: SpriteData[];

    cloneData(action: ActionType) {
        let b = new HistoryNode();
        b.time = this.time;
        b.forkStatus = this.forkStatus;
        b.action = action;

        b.player = this.player.clone();
        b.cracks = this.cracks.map(c => c.clone());
        b.crateWood = this.crateWood.map(c => c.clone());
        b.crateMetal = this.crateMetal.map(c => c.clone());
        return b;
    }
}