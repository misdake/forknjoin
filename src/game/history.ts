import {ActionType} from "./enums";
import {SpriteData} from "../renderer/sprite";

export class History {
    actionRoot: ActionNode;
    states: StateNode[]; //states[time]

    curr: ActionNode;

    getActions(time: number): ActionNode[] {
        let r : ActionNode[] = [];
        this.actionRoot.visitChildren(node => {
            if (node.time === time) {
                r.push(node);
            }
            return node.time < time;
        });
        return r;
    }

    appendState(node: StateNode) { //TODO 感觉最好分开传进来，actionNode的连接放进来
        let time = this.curr.time + 1;
        this.states[time] = node;
        this.redo();
    }

    undo() {

    }
    redo() {

    }
}


let actionNodeId = 1;

export class ActionNode {
    readonly time: number;
    readonly id: number;
    readonly action: ActionType;

    //connectivity
    readonly nextNodes: ActionNode[];

    //saves last node movement for undo/redo
    prevNode: ActionNode;
    nextNode: ActionNode;

    constructor(time: number, action: ActionType, prevNode: ActionNode) {
        this.time = time;
        this.id = actionNodeId++;
        this.action = action;

        this.nextNodes = [];
        this.prevNode = prevNode;
        this.nextNode = null;
    }

    visitChildren(callback: (node: ActionNode) => boolean): void {
        let callChildren = callback(this);
        if (callChildren) {
            for (let node of this.nextNodes) {
                node.visitChildren(callback);
            }
        }
    }

    goPrev(log: boolean = true): ActionNode {
        if (log && this.prevNode) this.prevNode.nextNode = this;
        return this.prevNode;
    }
    goNext(log: boolean = true): ActionNode {
        if (log && this.nextNode) this.nextNode.prevNode = this;
        return this.prevNode;
    }
}

export class PlayerData {
    id: number;
    spriteData: SpriteData;
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

export class StateNode {
    time: number;
    player: PlayerData[];
    dynamicData: DynamicData;
    staticData: StaticData;
}