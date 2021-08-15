import {Layer} from "./layer";
import {ImageAsset, LayerId, PLAYER_LAYERS} from "../game/enums";
import {H, W} from "../util";

export class GameMap {
    private readonly layers: Layer[];
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        let layerIds = Object.values(LayerId);
        this.layers = [];
        for (let id of layerIds) {
            if (typeof id === 'number') {
                this.layers[id as number] = new Layer(id);
            }
        }
    }

    clearLayers() {
        this.getLayer(LayerId.target).clear();
        this.getLayer(LayerId.wall).clear();
        this.clearDynamic();
    }
    clearDynamic() {
        PLAYER_LAYERS.forEach(layer => this.getLayer(layer).clear());
        this.getLayer(LayerId.crate).clear();
        this.getLayer(LayerId.crack).clear();
    }
    getLayer(id: LayerId) {
        return this.layers[id.valueOf()];
    }

    visitLayer(id: LayerId, callback: (layer: Layer) => void) {
        let layer = this.layers[id.valueOf()];
        if (layer) {
            callback(layer);
        }
    }

    getSprite(x: number, y: number, ...layerIds: LayerId[]) {
        if (x < 0 || x >= W) return null;
        if (y < 0 || y >= H) return null;

        for (let layerId of layerIds) {
            let layer = this.layers[layerId];
            if (layer) {
                let sprite = layer.get(x, y);
                if (sprite) {
                    return sprite;
                }
            }
        }
        return null;
    }
    isSprite(asset: ImageAsset, x: number, y: number, ...layerIds: LayerId[]) {
        let r = this.getSprite(x, y, ...layerIds);
        if (r) {
            return r.asset === asset;
        } else {
            return false;
        }
    }

    draw() {
        let canvas = this.canvas;
        let context = this.context;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "gray";
        context.strokeRect(0, 0, canvas.width, canvas.height);
        for (let layer of this.layers) if (layer) {
            layer.draw(canvas, context);
        }
    }
}
