import {SpriteData} from "../renderer/sprite";
import {ActionType} from "./enums";

export class History {

    currTime: number;
    nodes: HistoryNode[];

    constructor(player: PlayerData, dynamic: DynamicData) { //TODO 传进来关卡刚刚初始化后的状态
        this.currTime = 0;
        this.nodes = [];

        let t0 = new HistoryNode();
        this.nodes[0] = t0;
        t0.time = 0;
        t0.players = [player];
        t0.dynamic = dynamic;
        t0.currIndex = 0;
    }

    setNext(time: number, node: HistoryNode) {
        if (time !== this.currTime + 1) {
            console.log("time不匹配");
            debugger;
        }
        //TODO 看一下playerData的prev和next，是不是需要更新
        this.nodes[time] = node;
        this.nodes.length = time + 1;
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
        let newTime = this.currTime - 1;
        let node = this.nodes[newTime];
        if (!node) return;

        this.currTime = newTime;
        callback(node);
    }

    redo(callback: (node: HistoryNode) => void) {

    }
}

export class PlayerData {
    valid: boolean;
    currentX: number;
    currentY: number;
    currentDirection: ActionType; //只允许udlr之一，用来指定上下左右图像

    //在undo/redo时指定下一个默认currIndex。在fork和join的时候可以分开
    nextIndex: number;
    prevIndex: number;

    clone() {
        let r = new PlayerData();
        r.valid = this.valid;
        r.currentX = this.currentX;
        r.currentY = this.currentY;
        r.currentDirection = this.currentDirection;
        r.nextIndex = this.nextIndex;
        r.prevIndex = this.prevIndex;
        return r;
    }
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

    private getInput(time: number, playerIndex: number): ActionType {
        let lastTime = this.getLastInputTime(playerIndex);
        if (lastTime < time) {
            return ActionType.none;
        } else {
            return this.inputs[playerIndex][time];
        }
    }
    private getLastInputTime(playerIndex: number): number {
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

export class DynamicData {
    cracks: SpriteData[];
    crateWood: SpriteData[];
    crateMetal: SpriteData[];

    clone() {
        let b = new DynamicData();
        b.cracks = this.cracks.map(c => c.clone());
        b.crateWood = this.crateWood.map(c => c.clone());
        b.crateMetal = this.crateMetal.map(c => c.clone());
        return b;
    }
}

export class HistoryNode {
    time: number;

    //player status
    currIndex: number; //当前操作的player，用switch来切换
    players: PlayerData[];

    //saved data for rendering
    dynamic: DynamicData;

    cloneData() {
        let b = new HistoryNode();
        b.time = this.time;

        b.currIndex = this.currIndex;
        b.players = this.players.map(player => player.clone());

        b.dynamic = this.dynamic.clone();
        return b;
    }
}