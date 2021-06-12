import {Layer} from "./layer";
import {LayerId} from "../game/game";

export class GameMap {
    private readonly layers: Layer[];

    constructor() {
        let layerIds = Object.values(LayerId);
        this.layers = [];
        for (let id of layerIds) {
            if (typeof id === 'number') {
                this.layers[id as number] = new Layer();
            }
        }
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

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "gray";
        context.strokeRect(0, 0, canvas.width, canvas.height);
        for (let layer of this.layers) if (layer) {
            layer.draw(canvas, context);
        }
    }
}
