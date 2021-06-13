import {Sprite, SpriteData} from "./sprite";
import {H, TILE_SIZE, W} from "../util";
import {ImageAssets} from "./image";
import {ImageAsset} from "../game/enums";

export class Layer {
    private readonly cells: Sprite[][];
    private readonly set: Set<Sprite>;
    public readonly id;

    constructor(id: number) {
        this.id = id;
        this.cells = [];
        for (let i = 0; i < W; i++) {
            this.cells[i] = [];
            for (let j = 0; j < H; j++) {
                this.cells[i][j] = null;
            }
        }
        this.set = new Set<Sprite>();
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        for (let sprite of this.set) {
            let image = ImageAssets.get(sprite.asset);
            context.drawImage(image, sprite.x * TILE_SIZE, sprite.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    createSpriteWithData(data: SpriteData) {
        return this.createSprite(data.x, data.y, data.asset);
    }
    createSprite(x: number, y: number, asset: ImageAsset) {
        if (this.get(x, y)) {
            console.log("new sprite target is not empty!");
            debugger;
        }
        let sprite = new Sprite(asset, this);
        sprite.x = x;
        sprite.y = y;
        this.set.add(sprite);
        this.cells[x][y] = sprite;
        return sprite;
    }
    deleteSprite(sprite: Sprite) {
        if (this.set.has(sprite)) {
            this.set.delete(sprite);
            this.cells[sprite.x][sprite.y] = null;
        } else {
            console.log("sprite is not on layer");
            debugger;
        }
    }

    get(x: number, y: number) {
        if (x < 0 || x >= W) return null;
        if (y < 0 || y >= H) return null;

        return this.cells[x][y];
    }

    is(x: number, y: number, asset: ImageAsset) {
        let sprite = this.get(x, y);
        return (!sprite && !asset) || (sprite.asset === asset);
    }

    move(sprite: Sprite, newX: number, newY: number): boolean {
        if (newX < 0 || newX >= W) return null;
        if (newY < 0 || newY >= H) return null;

        if (!this.set.has(sprite)) {
            console.log("sprite is not on this layer!");
            return false;
        }

        let target = this.get(newX, newY);
        if (target) {
            console.log("move target is not empty!");
            return false;
        }

        this.cells[sprite.x][sprite.y] = null;
        this.cells[newX][newY] = sprite;
        sprite.x = newX;
        sprite.y = newY;

        return true;
    }

    clear() {
        let entries = Array.from(this.set);
        for (let entry of entries) {
            this.deleteSprite(entry);
        }
    }
}