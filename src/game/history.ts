import {SpriteData} from "../renderer/sprite";
import {ActionType} from "./enums";

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

    undo(callback: (node: HistoryNode) => void) {
        let newTime = this.currTime - 1;
        let node = this.nodes[newTime];
        if (!node) {
            console.log("no prev state");
            debugger;
            return;
        }

        this.currTime = newTime;
        callback(node);
    }

    redo(callback: (node: HistoryNode) => void) {
        let newTime = this.currTime + 1;
        let node = this.nodes[newTime];
        if (!node) {
            console.log("no next state");
            debugger;
            return;
        }

        this.currTime = newTime;
        //TODO currIndex
        callback(node);
    }
}

export class PlayerData {
    index: number;
    x: number;
    y: number;
    direction: ActionType; //只允许udlr之一，用来指定上下左右图像

    //在undo/redo时指定下一个默认currIndex。在fork和join的时候可以分开
    prevIndex: number;
    // nextIndex: number; //redo时尝试通过

    static init(index: number, x: number, y: number) {
        let player = new PlayerData();
        player.index = index;
        player.x = x;
        player.y = y;
        player.direction = ActionType.down;
        player.nextIndex
    }

    clone() {
        let r = new PlayerData();
        r.index = this.index;
        r.x = this.x;
        r.y = this.y;
        r.direction = this.direction;
        r.nextIndex = this.nextIndex;
        r.prevIndex = this.prevIndex;
        return r;
    }
}

export class StaticData {
    targetWood: SpriteData[] = [];
    targetMetal: SpriteData[] = [];
    targetPlayer: SpriteData[] = [];

    clone() {
        let b = new StaticData();
        b.targetWood = this.targetWood.map(c => c.clone());
        b.targetMetal = this.targetMetal.map(c => c.clone());
        b.targetPlayer = this.targetPlayer.map(c => c.clone());
        return b;
    }
}

export class DynamicData {
    cracks: SpriteData[] = [];
    crateWood: SpriteData[] = [];
    crateMetal: SpriteData[] = [];

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

    static fromLevel() : HistoryNode {
        let r = new HistoryNode();
        r.time = 0;
        r.players = [];
        r.currIndex = 0;
        r.dynamic = new DynamicData();
        r.dynamic.cracks = [];
        r.dynamic.crateWood = [];
        r.dynamic.crateMetal = [];
    }
}