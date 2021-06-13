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
        return this.visit(this.root, (node: HistoryNode) => node.time === time, []);
    }
    getFirst(forkStatus: string): HistoryNode {
        let array = this.visit(this.root, (node: HistoryNode) => node.forkStatus === forkStatus, []);
        return array.length ? array[0] : null;
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
        let targetStatus = s.substring(0, s.length - 1) + 'n';

        let next = this.getFirst(targetStatus);
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