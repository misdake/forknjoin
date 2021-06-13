import {SpriteData} from "../renderer/sprite";

export class History {
    root: HistoryNode;
    current: HistoryNode;

    init(node: HistoryNode) {
        this.current = node;
        this.root = node;

        node.parent = null;
        node.forkStatus = "";
    }

    getTime(time: number): HistoryNode[] {
        return []; //TODO
    }

    writeNext(node: HistoryNode) {
        //TODO delete this.current.next and fork?

        this.current.next = node;
        node.parent = this.current;
    }

    undo(callback: (node: HistoryNode) => void) {
        if (this.current.parent) {
            this.current = this.current.parent;
            callback(this.current);
        }
    }

    redo(callback: (node: HistoryNode) => void) {
        if (this.current.next) { //TODO check fork
            this.current = this.current.next;
            callback(this.current);
        }
    }

    backToFork(callback: (node: HistoryNode) => void) {
        //TODO find fork point and change current status
    }
}

export class HistoryNode {
    parent: HistoryNode;

    next: HistoryNode;
    // fork: HistoryNode;

    time: number;
    forkStatus: string;

    // forkMax: number; TODO
    player: SpriteData;
    cracks: SpriteData[];
    crateWood: SpriteData[];
    crateMetal: SpriteData[];
}