import {GameMap} from "../renderer/map";
import {ActionType, FORKJOIN_PLAYER_MAPPING, ImageAsset, LayerId, PLAYER_FORK_MAPPING, PLAYER_JOIN_MAPPING, SoundAsset} from "./enums";
import {Level, levels} from "./levels";
import {H, W} from "../util";
import {Sprite} from "../renderer/sprite";
import {SoundAssets} from "../renderer/sound";
import {ActionNode, History, StateNode} from "./history";
import {ForkJoinMode, GameMode} from "./gamemode";

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
        //hide hints
        document.getElementById("alldone").style.display = "none";
        document.getElementById("timehint").style.display = "none";
        document.getElementById("joinhint").style.display = "none";

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

        this.gameMode = new ForkJoinMode();
        let state = this.gameMode.initState(this.level);
        this.history = new History(state=> this.applyState(state)); //TODO 传入(state)=>this.applyState(state); 这样就无忧更新了
        this.actions = this.gameMode.initActions(this.level, state);
        this.actionCurr = this.actions[0]; //TODO 是否会需要指定？
        this.history.initState(state);

        this.check();

        this.map.draw();

        this.updateUi();
    }

    private applyState(state: StateNode) {
        //TODO
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
    private doAction(action: ActionType) {
        //TODO 拿到当前actionNode，新建节点
    }

    updateUi() {
        document.getElementById("currentlevel").innerHTML = `${this.level.index + 1}. ${levels[this.level.index].name}`;
        let maxtime = this.level.maxtime;
        let currenttime = this.history.curr.time;
        let maxtimestyle = "";

        if (currenttime > maxtime && maxtime > 0) {
            maxtimestyle = " style='color:red;'";
        }
        let stars = "";
        for (let time of levels[this.level.index].startimes) {
            if (currenttime <= time) stars += "★";
        }
        let starHtml = `<span style="color: gold; white-space: pre-wrap;">${stars}</span>`;

        if (maxtime > 0) {
            document.getElementById("maxtime").innerHTML = `Turns: <span${maxtimestyle}>${currenttime}</span> / ${maxtime}<br/>${starHtml}`;
        } else {
            document.getElementById("maxtime").innerHTML = `Turns: <span${maxtimestyle}>${currenttime}</span><br/>${starHtml}`;
        }
        let f = this.level.forkStatus;
        let joinstatus = "";
        let joinstatusstyle = "";
        if (this.isFork()) {
            joinstatus = "forked";
            joinstatusstyle = " style='color:red;'";
        }
        if (this.isJoin()) {
            joinstatus = "join";
            joinstatusstyle = " style='color:red;'";
        }
        if (this.level.forkStatus.length && this.isJoinedTogether()) {
            joinstatus = "joined together!";
            joinstatusstyle = " style='color:green;'";
        }
        document.getElementById("joinstatus").innerHTML = `<span${joinstatusstyle}>${joinstatus}</span>`;
    }

    update(action: ActionType) {
        if (this.level.done) return;

        //TODO fork/join
        switch (action) {
            case ActionType.up:
                this.tryMove(0, -1, this.level.player);
                this.level.player.asset = ImageAsset.player_u;
                this.saveMove(action);
                break;
            case ActionType.down:
                this.tryMove(0, 1, this.level.player);
                this.level.player.asset = ImageAsset.player_d;
                this.saveMove(action);
                break;
            case ActionType.left:
                this.tryMove(-1, 0, this.level.player);
                this.level.player.asset = ImageAsset.player_l;
                this.saveMove(action);
                break;
            case ActionType.right:
                this.tryMove(1, 0, this.level.player);
                this.level.player.asset = ImageAsset.player_r;
                this.saveMove(action);
                break;
            case ActionType.idle:
                this.saveMove(action);
                break;
            case ActionType.undo:
                this.undo();
                break;
            case ActionType.redo:
                this.redo();
                break;
            case ActionType.fork:
                if (!this.level.forks.length) { //LATER allow multi-level fork
                    this.fork();
                }
                break;
            case ActionType.switch:
                this.join();
                break;
            case ActionType.restart:
                this.load(this.level.index);
                break;
        }

        this.updateUi();
        this.map.draw();
    }

    hasFork() {
        return this.level.forks.length > 0;
    }
    isJoin(forkStatus: string = this.level.forkStatus) {
        let f = forkStatus;
        return f !== "" && f.charAt(f.length - 1) === 'n' && this.hasFork();
    }
    isFork(forkStatus: string = this.level.forkStatus) {
        let f = forkStatus;
        return f !== "" && f.charAt(f.length - 1) === 'f';
    }
    isJoinedTogether(forkStatus: string = this.level.forkStatus) {
        let f = forkStatus;
        return f === "" || (f.charAt(f.length - 1) === 'n' && !this.hasFork());
    }

    private tryMove(dx: number, dy: number, player: Sprite) {
        let x = player.x;
        let y = player.y;
        let nx = x + dx;
        let ny = y + dy;

        if (!this.map.getSprite(nx, ny, LayerId.bg)) return;

        let wall = this.map.getSprite(nx, ny, LayerId.wall);
        if (wall) return;

        if (this.isPlayerOk(nx, ny)) {
            //empty => move
            player.move(nx, ny);
        } else {
            let crate = this.map.getSprite(nx, ny, LayerId.crate);
            if (crate) {
                //crate => try push
                let nnx = x + dx * 2;
                let nny = y + dy * 2;
                if (this.isCrateOk(nnx, nny)) {
                    player.move(nx, ny);
                    crate.move(nnx, nny);
                    SoundAssets.play(SoundAsset.move);
                }
            }
        }
    }
    private isPlayerOk(x: number, y: number) {
        return this.map.getSprite(x, y, LayerId.bg)
            && !this.map.getSprite(x, y, LayerId.wall, LayerId.crate)
            && !this.map.isSprite(ImageAsset.crack_3, x, y, LayerId.crack);
    }
    private isCrateOk(x: number, y: number) {
        return this.map.getSprite(x, y, LayerId.bg)
            && !this.map.getSprite(x, y, LayerId.wall, LayerId.player, LayerId.crate, LayerId.crack);
    }

    private saveMove(action: ActionType) {
        this.level.time += 1;

        //run logic
        this.tick();

        //link next state
        let next = this.level.toHistoryNode(action);
        this.level.history.writeNext(next);

        //apply next state
        this.redo();
    }
    private applyHistoryNode(node: HistoryNode) {
        this.level.fromHistoryNode(node, this.map, this);
        this.forksMove();
        this.tick();
        this.check();
        console.log("time", this.level.time, "forkStatus", this.level.forkStatus);
    }
    private undo() {
        this.level.history.undo(node => {
            this.applyHistoryNode(node);
        });
    }
    private redo() {
        this.level.history.redo(node => {
            this.applyHistoryNode(node);
        });
    }


    private fork() {
        //write fork and next state
        this.level.history.forkNext();

        SoundAssets.play(SoundAsset.fork);

        //apply fork state
        this.redo();
    }
    private join() {
        //write fork and next state
        this.level.history.backToForkNext(node => {
            SoundAssets.play(SoundAsset.join);
            this.applyHistoryNode(node);
        });
    }


    private tick() {
        //move to crack => crack 2
        //move out of crack => crack 3
        for (let crack of this.level.cracks) {
            switch (crack.asset) {
                case ImageAsset.crack_1: {
                    if (this.map.getSprite(crack.x, crack.y, LayerId.player, LayerId.fork)) {
                        crack.asset = ImageAsset.crack_2;
                    }
                    break;
                }
                case ImageAsset.crack_2: {
                    if (this.map.getSprite(crack.x, crack.y, LayerId.player, LayerId.fork)) {
                    } else {
                        crack.asset = ImageAsset.crack_3;
                    }
                    break;
                }
            }
        }

        //check join
        let fork = this.map.getSprite(this.level.player.x, this.level.player.y, LayerId.fork);
        if (fork && this.isJoin()) { //this is join and there is a fork on the same tile
            let f = this.level.forks.find(i => i.sprite === fork);
            if (!f.node.next) {
                this.level.joined.add(f.node.forkStatus);
                SoundAssets.play(SoundAsset.join);
                this.level.forks = this.level.forks.filter(i => i.sprite !== fork);

                this.map.getLayer(LayerId.fork).deleteSprite(fork);

                if (this.isJoinedTogether()) {
                    this.level.player.asset = FORKJOIN_PLAYER_MAPPING.get(this.level.player.asset);
                }
            }
        }
    }

    private forksMove() {
        let forks = this.level.forks;
        forks.forEach(f => {
            f.sprite.alpha = !f.node.next && this.isJoin() ? 1.0 : 0.5;
            f.sprite.asset = this.isJoin(f.node.forkStatus) ? PLAYER_JOIN_MAPPING.get(f.sprite.asset) : PLAYER_FORK_MAPPING.get(f.sprite.asset);

            let action = f.node.action;
            switch (action) {
                case ActionType.up:
                    this.tryMove(0, -1, f.sprite);
                    f.sprite.asset = ImageAsset.fork_u;
                    break;
                case ActionType.down:
                    this.tryMove(0, 1, f.sprite);
                    f.sprite.asset = ImageAsset.fork_d;
                    break;
                case ActionType.left:
                    this.tryMove(-1, 0, f.sprite);
                    f.sprite.asset = ImageAsset.fork_l;
                    break;
                case ActionType.right:
                    this.tryMove(1, 0, f.sprite);
                    f.sprite.asset = ImageAsset.fork_r;
                    break;
            }

            f.node.player.x = f.sprite.x;
            f.node.player.y = f.sprite.y;
        });
    }


    check(): boolean {
        document.getElementById("timehint").style.display = "none";
        document.getElementById("joinhint").style.display = "none";

        //check each level target is filled
        let checkMetal = this.checkTarget(this.level.targetMetal, ImageAsset.crate_metal, LayerId.crate, ImageAsset.target_metal_1, ImageAsset.target_metal_2);
        let checkWood = this.checkTarget(this.level.targetWood, ImageAsset.crate_wood, LayerId.crate, ImageAsset.target_wood_1, ImageAsset.target_wood_2);
        let player = this.checkTarget(this.level.targetPlayer, null, LayerId.player, ImageAsset.target_player_1, ImageAsset.target_player_2);

        let levelDone = checkWood && checkMetal && player;

        let maxtime = levels[this.level.index].maxtime;
        let currenttime = this.level.time;
        if (levelDone && this.level.forks.length) {
            document.getElementById("joinhint").style.display = "block";
            levelDone = false;
        }
        if (levelDone && currenttime > maxtime && maxtime > 0) {
            document.getElementById("timehint").style.display = "block";
            levelDone = false;
        }

        this.level.done = this.level.done || levelDone;

        if (levelDone && !this.level.soundPlayed) {
            let stars = "";
            for (let time of levels[this.level.index].startimes) {
                if (currenttime <= time) stars += "★";
            }
            let bg = document.getElementById(`load${this.level.index}bg`);
            bg.innerHTML = stars;

            this.level.soundPlayed = true;
            SoundAssets.play(SoundAsset.done);
        }

        return levelDone;
    }
    private checkTarget(targets: Sprite[], targetAsset: ImageAsset, layerId: LayerId, emptyImage: ImageAsset, doneImage: ImageAsset) {
        let allDone = true;
        for (let target of targets) {
            let targetSprite = this.map.getSprite(target.x, target.y, layerId);
            let isDone = targetSprite && (!targetAsset || targetSprite.asset === targetAsset);
            allDone = allDone && isDone;
            target.asset = isDone ? doneImage : emptyImage;
        }
        return allDone;
    }
}