import {GameMap} from "../renderer/map";
import {ActionType, LayerId, SoundAsset} from "./enums";
import {Level, levels} from "./levels";
import {H, W} from "../util";
import {SoundAssets} from "../renderer/sound";
import {ActionNode, History, StateNode} from "./history";
import {GameMode} from "./gamemode";
import {SpriteData} from "../renderer/sprite";
import {NormalMode} from "./gamemodes/normal";

let opacityTimeout: number = null;

export class Gamelogic {
    private readonly map: GameMap;

    private levelIndex: number;
    private level: Level;
    private done: boolean = false;
    private soundPlayed: boolean = false;

    private history: History;
    private actions: ActionNode[];
    private actionCurr: ActionNode;
    private gameMode: GameMode;

    constructor(map: GameMap) {
        this.map = map;
    }

    hasNextLevel() {
        if (this.level) {
            let nextIndex = levels.indexOf(this.level) + 1;
            if (levels[nextIndex]) {
                return nextIndex;
            }
        }
        return -1;
    }

    load(index: number) {
        this.done = false;
        this.soundPlayed = false;

        //hide hints
        document.getElementById("alldone").style.display = "none";
        document.getElementById("timehint").style.display = "none";

        this.levelIndex = index;
        this.level = levels[index];

        if (this.level.map.length !== W * H) {
            console.log("map size doesn't match!");
            debugger;
        }

        document.getElementById("titlehint").style.opacity = "1.0";
        document.getElementById("title").innerHTML = this.level.name;
        document.getElementById("showkey1").style.display = this.level.showkey ? "block" : "none";
        document.getElementById("showkey2").style.display = this.level.showkey ? "block" : "none";
        if (opacityTimeout) clearTimeout(opacityTimeout);
        opacityTimeout = setTimeout(() => document.getElementById("titlehint").style.opacity = "0.0", 2000);

        this.map.clearLayers();

        // this.gameMode = new ForkJoinMode();
        this.gameMode = new NormalMode();
        let state = this.gameMode.initState(this.level);

        this.applyStatic(state);
        this.applyDynamic(state);
        this.history = new History(state => this.applyDynamic(state));

        this.actions = this.gameMode.initActions(this.level, state);
        this.actionCurr = this.actions[this.level.startindex ?? 0]; //TODO test startIndex
        this.history.initState(state);

        this.check();

        this.updateUi();
        this.map.draw();
    }

    private addAllSprites(layerId: LayerId, sprites: SpriteData[]) {
        let layer = this.map.getLayer(layerId);
        for (let sprite of sprites) {
            layer.createSpriteWithData(sprite);
        }
    }
    private applyDynamic(state: StateNode) {
        this.map.clearDynamic();
        this.addAllSprites(LayerId.player, state.players.map(p => p.spriteData));
        this.addAllSprites(LayerId.crate, state.dynamicData.crateMetal);
        this.addAllSprites(LayerId.crate, state.dynamicData.crateWood);
        this.addAllSprites(LayerId.crack, state.dynamicData.cracks);
    }
    private applyStatic(state: StateNode) {
        this.addAllSprites(LayerId.target, state.staticData.targetMetal);
        this.addAllSprites(LayerId.target, state.staticData.targetWood);
        this.addAllSprites(LayerId.target, state.staticData.targetPlayer);
        this.addAllSprites(LayerId.target, state.staticData.wall);
    }
    private getActions(time: number): ActionNode[] {
        let r: ActionNode[] = [];
        this.actions.forEach(root => root.visitChildren(node => {
            if (node.time === time) {
                r.push(node);
            }
            return node.time < time;
        }));
        return r;
    }

    updateUi() {
        document.getElementById("currentlevel").innerHTML = `${this.levelIndex + 1}. ${this.level.name}`;
        let maxtime = this.level.maxtime;
        let currenttime = this.actionCurr.time;
        let maxtimestyle = "";

        if (currenttime > maxtime && maxtime > 0) {
            maxtimestyle = " style='color:red;'";
        }
        let stars = "";
        for (let time of this.level.startimes) {
            if (currenttime <= time) stars += "★";
        }
        let starHtml = `<div style="color: gold; white-space: pre-wrap; height: 20px;">${stars}</div>`;

        if (maxtime > 0) {
            document.getElementById("maxtime").innerHTML = `Turns: <span${maxtimestyle}>${currenttime}</span> / ${maxtime}<br/>${starHtml}`;
        } else {
            document.getElementById("maxtime").innerHTML = `Turns: <span${maxtimestyle}>${currenttime}</span><br/>${starHtml}`;
        }
    }

    update(action: ActionType) {
        if (this.done) return;
        let time = this.history.time;
        let nextTime = time + 1;

        let act = true;

        switch (action) {
            case ActionType.undo:
                if (this.actionCurr.prevNode) {
                    let prev = this.actionCurr.prevNode;
                    prev.nextNode = this.actionCurr;
                    this.actionCurr = prev;
                    this.history.setTime(this.actionCurr.time);
                }
                act = false;
                break;
            case ActionType.redo:
                if (this.actionCurr.nextNode) {
                    let next = this.actionCurr.nextNode;
                    next.prevNode = this.actionCurr;
                    this.actionCurr = next;
                    this.history.setTime(this.actionCurr.time);
                }
                act = false;
                break;

            //     case ActionType.switch: //TODO let gameMode deside? or just hijack gamemode.act and tick
            //         this.join();
            //         break;

            case ActionType.restart:
                this.load(this.levelIndex);
                return;
        }

        if (act) {
            //let gamemode add new actionNodes
            this.gameMode.act(action, this.actionCurr);

            let actions = this.getActions(nextTime);
            let newState = this.gameMode.tick(actions, this.history.getState());

            this.history.applyNextState(newState);
            this.actionCurr = this.actionCurr.nextNode;
        }

        this.updateUi();
        this.map.draw();
    }


    check(): boolean {
        document.getElementById("timehint").style.display = "none";

        let state = this.history.getState();
        let levelDone = this.gameMode.check(state);

        let maxtime = this.level.maxtime;
        let currenttime = this.history.time;
        if (levelDone && currenttime > maxtime && maxtime > 0) {
            document.getElementById("timehint").style.display = "block";
            levelDone = false;
        }

        this.done = this.done || levelDone;

        if (levelDone && !this.soundPlayed) {
            let stars = "";
            for (let time of this.level.startimes) {
                if (currenttime <= time) stars += "★";
            }
            let bg = document.getElementById(`load${this.levelIndex}bg`);
            bg.innerHTML = stars;

            this.soundPlayed = true;
            SoundAssets.play(SoundAsset.done);
        }

        return levelDone;
    }
}