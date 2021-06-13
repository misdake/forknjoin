import {GameMap} from "../renderer/map";
import {Action, ImageAsset, LayerId, SoundAsset} from "./enums";
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
    forks: Sprite[] = [];
    crateWood: Sprite[] = [];
    crateMetal: Sprite[] = [];
    targetWood: Sprite[] = [];
    targetMetal: Sprite[] = [];
    targetPlayer: Sprite[] = [];
    cracks: Sprite[] = [];

    history: History = new History();

    forkStatus: string = "";

    fromHistoryNode(node: HistoryNode, map: GameMap) {
        this.time = node.time;
        this.forkStatus = node.forkStatus;

        map.clearMovable();
        this.player = map.getLayer(LayerId.player).createSpriteWithData(node.player);

        let forks = this.history.getNodesByTime(node.time);
        //TODO use fork's parent position and apply action, overwrite fork position.
        this.forks = forks.filter(i => i !== node).map(node => map.getLayer(LayerId.fork).createSpriteWithData(node.player));
        this.forks.map(f => f.alpha = 0.3);

        this.cracks = node.cracks.map(crate => map.getLayer(LayerId.crack).createSpriteWithData(crate));
        this.crateWood = node.crateWood.map(crate => map.getLayer(LayerId.crate).createSpriteWithData(crate));
        this.crateMetal = node.crateMetal.map(crate => map.getLayer(LayerId.crate).createSpriteWithData(crate));
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
        return node;
    }
}

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
        //hide finish image
        document.getElementById("alldone").style.display = "none";

        let levelData = levels[index];

        this.level = new GameStatus(index);

        if (levelData.map.length !== W * H) {
            console.log("map size doesn't match!");
            debugger;
        }

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
    }

    update(action: Action) {
        if (this.level.done) return;

        //TODO fork/join
        switch (action) {
            case Action.up:
                this.tryMove(0, -1);
                this.level.player.asset = ImageAsset.player_u;
                this.saveMove(action);
                break;
            case Action.down:
                this.tryMove(0, 1);
                this.level.player.asset = ImageAsset.player_d;
                this.saveMove(action);
                break;
            case Action.left:
                this.tryMove(-1, 0);
                this.level.player.asset = ImageAsset.player_l;
                this.saveMove(action);
                break;
            case Action.right:
                this.tryMove(1, 0);
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
                this.fork();
                break;
            case Action.join:
                this.join();
                break;
            case Action.restart:
                this.load(this.level.index);
                break;
        }

        this.map.draw();
    }

    private tryMove(dx: number, dy: number) {
        let x = this.level.player.x; //TODO sprite to param so that forks can try move
        let y = this.level.player.y;
        let nx = x + dx;
        let ny = y + dy;

        if (!this.map.getSprite(nx, ny, LayerId.bg)) return;

        let wall = this.map.getSprite(nx, ny, LayerId.wall);
        if (wall) return;

        if (this.isPlayerOk(nx, ny)) {
            //empty => move
            this.level.player.move(nx, ny);
        } else {
            let crate = this.map.getSprite(nx, ny, LayerId.crate);
            if (crate) {
                //crate => try push
                let nnx = x + dx * 2;
                let nny = y + dy * 2;
                if (this.isCrateOk(nnx, nny)) {
                    this.level.player.move(nx, ny);
                    crate.move(nnx, nny);
                    SoundAssets.play(SoundAsset.move);
                }
            }
        }
    }
    private isPlayerOk(x: number, y: number) {
        return this.map.getSprite(x, y, LayerId.bg)
            && !this.map.getSprite(x, y, LayerId.wall, LayerId.player, LayerId.crate)
            && !this.map.isSprite(ImageAsset.crack_3, x, y, LayerId.crack);
    }
    private isCrateOk(x: number, y: number) {
        return this.map.getSprite(x, y, LayerId.bg)
            && !this.map.getSprite(x, y, LayerId.wall, LayerId.player, LayerId.crate, LayerId.crack);
    }

    private saveMove(action: Action) {
        //run logic
        this.tick();

        //link next state
        let next = this.level.toHistoryNode(action);
        this.level.history.writeNext(next);

        //apply next state
        this.redo();
    }
    private applyHistoryNode(node: HistoryNode) {
        this.level.fromHistoryNode(node, this.map);
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

        //apply fork state
        this.redo();
    }
    private join() {
        //write fork and next state
        this.level.history.backToForkNext(node => {
            this.applyHistoryNode(node);
        });
    }


    private tick() {
        this.level.time += 1;
        for (let crack of this.level.cracks) {
            switch (crack.asset) {
                case ImageAsset.crack_1: {
                    if (this.level.player && this.level.player.x === crack.x && this.level.player.y === crack.y) {
                        crack.asset = ImageAsset.crack_2;
                    }
                    break;
                }
                case ImageAsset.crack_2: {
                    if (this.level.player && this.level.player.x === crack.x && this.level.player.y === crack.y) {
                    } else {
                        crack.asset = ImageAsset.crack_3;
                    }
                    break;
                }
            }
        }
        //TODO move forked
    }


    check(): boolean { //TODO cache check result
        //check each level target is filled
        let checkMetal = this.checkTarget(this.level.targetMetal, ImageAsset.crate_metal, LayerId.crate, ImageAsset.target_metal_1, ImageAsset.target_metal_2);
        let checkWood = this.checkTarget(this.level.targetWood, ImageAsset.crate_wood, LayerId.crate, ImageAsset.target_wood_1, ImageAsset.target_wood_2);
        let player = this.checkTarget(this.level.targetPlayer, null, LayerId.player, ImageAsset.target_player_1, ImageAsset.target_player_2);

        let levelDone = checkWood && checkMetal && player;

        this.level.done = this.level.done || levelDone;

        if (levelDone && !this.level.soundPlayed) {
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