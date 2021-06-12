import {Layer} from "./layer";
import {ImageAsset} from "../game/enums";

export class Sprite {

    x: number;
    y: number;
    asset: ImageAsset;
    readonly layer: Layer;

    constructor(asset: ImageAsset, layer: Layer) {
        this.asset = asset;
        this.layer = layer;
    }

    move(newX: number, newY: number) {
        this.layer.move(this, newX, newY);
    }

}