import {ActionNode, StateNode} from "../history";
import {GameMode} from "../gamemode";
import {NormalMode} from "./normal";
import {ActionType} from "../enums";

export class ForkJoinMode extends GameMode {
    static readonly instance = new ForkJoinMode();

    act(inputAction: ActionType, curr: ActionNode) {
        switch (inputAction) {
            case ActionType.fork:
                //TODO generate two children nodes
                break;
        }

        super.act(inputAction, curr);
    }

    tick(actions: ActionNode[], prev: StateNode): StateNode {
        let stateNode = NormalMode.instance.tick(actions, prev);
        //TODO test players and join
        return stateNode;
    }
}