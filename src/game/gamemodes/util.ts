import {SpriteData} from "../../renderer/sprite";
import {LayerId} from "../enums";
import {H, W} from "../../util";
import {DynamicData, StaticData} from "../history";

export function mapFromStatic(staticData: StaticData) : LogicMap {
    let r = new LogicMap();
    r.load(LayerId.wall, staticData.wall);
    r.load(LayerId.target, staticData.targetWood);
    r.load(LayerId.target, staticData.targetMetal);
    r.load(LayerId.target, staticData.targetPlayer);
    return r;
}
export function mapFromDynamic(dynamicData: DynamicData) : LogicMap{
    let r = new LogicMap();
    r.load(LayerId.crack, dynamicData.cracks);
    r.load(LayerId.crate, dynamicData.crateWood);
    r.load(LayerId.crate, dynamicData.crateMetal);
    return r;
}

export class Cell {
    private map: Map<LayerId, SpriteData> = new Map();
    constructor() {
    }

    clear() {
        this.map.clear();
    }

    add(layer: LayerId, sprite: SpriteData) {
        if (this.map.has(layer)) debugger;
        this.map.set(layer, sprite);
    }
    remove(layer: LayerId, sprite: SpriteData) {
        if (this.map.get(layer) !== sprite) debugger;
        this.map.delete(layer);
    }

    has(...layers: LayerId[]): boolean {
        for (let layerId of layers) {
            if (this.map.has(layerId)) return true;
        }
        return false;
    }

    get(layer: LayerId): SpriteData {
        return this.map.get(layer);
    }
}

export class LogicMap {

    map: Cell[][];

    constructor() {
        this.map = [];
        for (let i = 0; i < W; i++) {
            this.map[i] = [];
            for (let j = 0; j < H; j++) {
                this.map[i][j] = new Cell();
            }
        }
    }

    clear() {
        this.map.forEach(line => line.forEach(cell => cell.clear()));
    }

    load(layer: LayerId, sprites: SpriteData[]) {
        for (const sprite of sprites) {
            this.map[sprite.x][sprite.y].add(layer, sprite);
        }
    }

    move(layer: LayerId, sprite: SpriteData, newX: number, newY: number) {
        this.map[sprite.x][sprite.y].remove(layer, sprite);
        this.map[newX][newY].add(layer, sprite);
        sprite.x = newX;
        sprite.y = newY;
    }

    has(x: number, y: number, ...layers: LayerId[]): boolean {
        return this.map[x][y].has(...layers);
    }

    get(x: number, y: number, layer: LayerId): SpriteData {
        return this.map[x][y].get(layer);
    }

}