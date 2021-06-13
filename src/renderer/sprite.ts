import {Layer} from "./layer";
import {ImageAsset} from "../game/enums";

export class SpriteData {
    x: number;
    y: number;
    asset: ImageAsset;

    clone() {
        let d = new SpriteData();
        d.x = this.x;
        d.y = this.y;
        d.asset = this.asset;
        return d;
    }
}

export class Sprite extends SpriteData {

    x: number;
    y: number;
    asset: ImageAsset;
    readonly layer: Layer;

    constructor(asset: ImageAsset, layer: Layer) {
        super();
        this.asset = asset;
        this.layer = layer;
    }

    move(newX: number, newY: number) {
        this.layer.move(this, newX, newY);
    }

    toData() {
        let d = new SpriteData();
        d.x = this.x;
        d.y = this.y;
        d.asset = this.asset;
        return d;
    }

}