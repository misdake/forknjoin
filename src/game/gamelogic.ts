import {GameMap} from "../renderer/map";
import {Action} from "./enums";

export class Gamelogic {
    private map: GameMap;

    constructor(map : GameMap) {
        this.map = map;
    }

    load(level: number) {

    }

    private currentLevel = 0;

    keyboard(action: Action, param: any) {
        //TODO wasd or fork/join or restart/load
    }

    check() {

    }
}