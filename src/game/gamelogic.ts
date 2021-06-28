import {GameMap} from "../renderer/map";
import {Action, FORKJOIN_PLAYER_MAPPING, ImageAsset, LayerId, PLAYER_FORK_MAPPING, PLAYER_JOIN_MAPPING, SoundAsset} from "./enums";
import {CELL_IMAGE_MAPPING, CELL_LAYER_MAPPING, levels} from "./levels";
import {H, W} from "../util";
import {Sprite} from "../renderer/sprite";
import {SoundAssets} from "../renderer/sound";
import {History, HistoryNode} from "./history";

export class GameStatus {
    constructor(index: number) {
        this.index = index;
    }
    index: number;
    time: number = 0;
    done: boolean = false;
    soundPlayed: boolean = false;
    player: Sprite = null;
    forks: { node: HistoryNode, sprite: Sprite }[] = [];
    crateWood: Sprite[] = [];
    crateMetal: Sprite[] = [];
    targetWood: Sprite[] = [];
    targetMetal: Sprite[] = [];
    targetPlayer: Sprite[] = [];
    cracks: Sprite[] = [];

    history: History = new History();

    forkStatus: string = "";
    joined: Set<string> = new Set();

    fromHistoryNode(node: HistoryNode, map: GameMap, gamelogic: Gamelogic) {
        this.time = node.time;
        this.forkStatus = node.forkStatus;
        this.joined = new Set(node.joined);

        map.clearMovable();
        this.player = map.getLayer(LayerId.player).createSpriteWithData(node.player);
        if (gamelogic.isJoin()) {
            this.player.asset = PLAYER_JOIN_MAPPING.get(this.player.asset);
        } else if (gamelogic.isFork()) {
            this.player.asset = PLAYER_FORK_MAPPING.get(this.player.asset);
        }

        this.cracks = node.cracks.map(crate => map.getLayer(LayerId.crack).createSpriteWithData(crate));
        this.crateWood = node.crateWood.map(crate => map.getLayer(LayerId.crate).createSpriteWithData(crate));
        this.crateMetal = node.crateMetal.map(crate => map.getLayer(LayerId.crate).createSpriteWithData(crate));

        let forks = this.history.getNodesByTime(node.time);
        this.forks = forks.filter(i => i !== node && !this.joined.has(i.forkStatus)).map(node => {
            //create sprite with parent to let it move
            return {node, sprite: map.getLayer(LayerId.fork).createSpriteWithData(node.parent.player)};
        });
        //call Gamelogic.forksMove(), use fork's parent position and apply action, overwrite fork position.
    }

    toHistoryNode(action: Action): HistoryNode {
        let node = new HistoryNode();
        node.time = this.time;
        node.forkStatus = this.forkStatus;
        node.action = action;
        node.player = this.player.toData();
        node.cracks = this.cracks.map(crack => crack.toData());
        node.crateWood = this.crateWood.map(crate => crate.toData());
        node.crateMetal = this.crateMetal.map(crate => crate.toData());
        node.joined = new Set(this.joined);
        return node;
    }
}

let opacityTimeout: number = null;

export class Gamelogic {
    private readonly map: GameMap;

    private level: GameStatus;

    constructor(map: GameMap) {
        this.map = map;
    }

    hasNextLevel() {
        if (this.level) {
            let nextIndex = this.level.index + 1;
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

        let levelData = levels[index];

        this.level = new GameStatus(index);

        if (levelData.map.length !== W * H) {
            console.log("map size doesn't match!");
            debugger;
        }

        document.getElementById("titlehint").style.opacity = "1.0";
        document.getElementById("title").innerHTML = levelData.name;
        document.getElementById("showkey1").style.display = levelData.showkey ? "block" : "none";
        document.getElementById("showkey2").style.display = levelData.showkey ? "block" : "none";
        if (opacityTimeout) clearTimeout(opacityTimeout);
        opacityTimeout = setTimeout(() => document.getElementById("titlehint").style.opacity = "0.0", 2000);

        this.map.clearLayers();

        for (let j = 0; j < H; j++) {
            for (let i = 0; i < W; i++) {
                let index = i + j * W;
                let cell = levelData.map[index];
                let layerId = CELL_LAYER_MAPPING[cell];
                let image = CELL_IMAGE_MAPPING[cell];
                if (layerId && image) {
                    let layer = this.map.getLayer(layerId);
                    let sprite = layer.createSprite(i, j, image);

                    switch (image) {
                        case ImageAsset.player_d:
                            this.level.player = sprite;
                            break;
                        case ImageAsset.crate_wood:
                            this.level.crateWood.push(sprite);
                            break;
                        case ImageAsset.crate_metal:
                            this.level.crateMetal.push(sprite);
                            break;
                        case ImageAsset.target_wood_1:
                            this.level.targetWood.push(sprite);
                            break;
                        case ImageAsset.target_metal_1:
                            this.level.targetMetal.push(sprite);
                            break;
                        case ImageAsset.target_player_1:
                            this.level.targetPlayer.push(sprite);
                            break;
                        case ImageAsset.crack_1:
                            this.level.cracks.push(sprite);
                            break;
                    }
                }
            }
        }

        this.level.history.init(this.level.toHistoryNode(null));

        this.check();

        this.map.draw();

        this.updateUi();
    }

    updateUi() {
        document.getElementById("currentlevel").innerHTML = levels[this.level.index].name;
        let maxtime = levels[this.level.index].maxtime;
        let star3 = levels[this.level.index].star3time;
        let star2 = levels[this.level.index].star2time;
        let star1 = levels[this.level.index].star1time;
        let currenttime = this.level.time;
        let maxtimestyle = "";

        if (currenttime > maxtime && maxtime > 0) {
            maxtimestyle = " style='color:red;'";
        }
        let stars = "";
        if (currenttime <= star1) stars += "★";
        if (currenttime <= star2) stars += "★";
        if (currenttime <= star3) stars += "★";
        let starHtml = `<span style="color: gold; white-space: pre-wrap;">${stars} </span>`

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

    update(action: Action) {
        if (this.level.done) return;

        //TODO fork/join
        switch (action) {
            case Action.up:
                this.tryMove(0, -1, this.level.player);
                this.level.player.asset = ImageAsset.player_u;
                this.saveMove(action);
                break;
            case Action.down:
                this.tryMove(0, 1, this.level.player);
                this.level.player.asset = ImageAsset.player_d;
                this.saveMove(action);
                break;
            case Action.left:
                this.tryMove(-1, 0, this.level.player);
                this.level.player.asset = ImageAsset.player_l;
                this.saveMove(action);
                break;
            case Action.right:
                this.tryMove(1, 0, this.level.player);
                this.level.player.asset = ImageAsset.player_r;
                this.saveMove(action);
                break;
            case Action.idle:
                this.saveMove(action);
                break;
            case Action.undo:
                this.undo();
                break;
            case Action.redo:
                this.redo();
                break;
            case Action.fork:
                if (!this.level.forks.length) { //LATER allow multi-level fork
                    this.fork();
                }
                break;
            case Action.join:
                this.join();
                break;
            case Action.restart:
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

    private saveMove(action: Action) {
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

        let fork = this.map.getSprite(this.level.player.x, this.level.player.y, LayerId.fork);
        if (fork) {
            let f = this.level.forks.find(i => i.sprite === fork);
            if (!f.node.next && this.isJoin()) {
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
                case Action.up:
                    this.tryMove(0, -1, f.sprite);
                    f.sprite.asset = ImageAsset.fork_u;
                    break;
                case Action.down:
                    this.tryMove(0, 1, f.sprite);
                    f.sprite.asset = ImageAsset.fork_d;
                    break;
                case Action.left:
                    this.tryMove(-1, 0, f.sprite);
                    f.sprite.asset = ImageAsset.fork_l;
                    break;
                case Action.right:
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
            // if (currenttime <= goldtime) {
            //     let button = document.getElementById("load" + this.level.index);
            //     button.style.background = "gold";
            // }
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