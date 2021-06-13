import {SpriteData} from "../renderer/sprite";
import {Action} from "./enums";

export class History {
    root: HistoryNode;
    current: HistoryNode;

    forkStatus: string; //guide to follow the right branch when redo

    init(node: HistoryNode) {
        this.current = node;
        this.root = node;

        node.parent = null;
        node.forkStatus = "";
        this.forkStatus = "";
    }

    getNodes(time: number): HistoryNode[] {
        return []; //TODO
    }

    writeNext(node: HistoryNode) {
        this.current.next = node;
        node.parent = this.current;
        this.forkStatus = node.forkStatus;
    }

    forkNext() {
        let next = this.current.cloneData(Action.fork);
        let fork = this.current.cloneData(Action.fork);
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

    backToFork(callback: (node: HistoryNode) => void) {
        //TODO find fork point and change current status
    }
}

export class HistoryNode {
    parent: HistoryNode;

    fork: HistoryNode;
    next: HistoryNode;

    time: number;
    forkStatus: string;

    action: Action;

    // forkMax: number; TODO
    player: SpriteData;
    cracks: SpriteData[];
    crateWood: SpriteData[];
    crateMetal: SpriteData[];

    cloneData(action: Action) {
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