import {ActionType, LayerId} from "./enums";
import {SpriteData} from "../renderer/sprite";
import {LogicMap} from "./gamemodes/logicMap";

export class History {
    private onApply: (state: StateNode) => void;
    constructor(onApply: (state: StateNode) => void) {
        this.onApply = onApply;
    }

    time: number;

    states: StateNode[]; //states[time]
    initState(node: StateNode) {
        this.states = [node];
        this.time = 0;
        this.redo();
    }
    applyNextState(node: StateNode) {
        let time = node.time;
        this.states[time] = node;
        this.redo();
    }
    getState() {
        return this.states[this.time];
    }

    setTime(time: number) {
        if (this.states[time]) {
            this.time = time;
            this.onApply(this.states[time]);
        }
    }
    undo() {
        this.setTime(this.time - 1);
    }
    redo() {
        this.setTime(this.time + 1);
    }
}

export class ActionNode {
    readonly time: number;
    readonly id: number;
    readonly action: ActionType;

    //connectivity
    nextNodes: ActionNode[];

    //saves last node movement for undo/redo
    prevNode: ActionNode;
    nextNode: ActionNode;

    constructor(time: number, id: number, action: ActionType, prevNode: ActionNode) {
        this.time = time;
        this.id = id;
        this.action = action;

        this.nextNodes = null;
        this.prevNode = prevNode;
        this.nextNode = null;
    }

    static visitAllChildren(roots: ActionNode[], callback: (node: ActionNode) => boolean) {
        let visited = new Set<ActionNode>();
        for (let root of roots) {
            root.visitChildren(node => {
                if (visited.has(node)) return false;
                visited.add(node);
                return callback(node);
            });
        }
    }

    private visitChildren(callback: (node: ActionNode) => boolean): void {
        let callChildren = callback(this);
        if (callChildren) {
            if (this.nextNodes) for (let node of this.nextNodes) {
                node.visitChildren(callback);
            }
        }
    }
}

export enum PlayerState {
    NORMAL = 1,
    FINISHED,
}

export class PlayerData {
    id: number;

    layer: LayerId;
    direction: ActionType;
    state: PlayerState;
    action: ActionNode;

    spriteData: SpriteData;

    constructor() {
    }

    clone() {
        let r = new PlayerData();
        r.id = this.id;
        r.layer = this.layer;
        r.direction = this.direction;
        r.state = this.state;
        r.action = this.action;
        r.spriteData = this.spriteData.clone();
        return r;
    }
}

export class StaticData {
    targetWood: SpriteData[] = [];
    targetMetal: SpriteData[] = [];
    targetPlayer: SpriteData[] = [];
    wall: SpriteData[] = [];

    map: LogicMap;
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
    players: PlayerData[];
    dynamicData: DynamicData;
    staticData: StaticData;

    constructor(time: number) {
        this.time = time;
    }
}
