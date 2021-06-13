import {ImageAsset, LayerId} from "./enums";

export const levels: Level[] = [];

export const P = 1; //player
export const U = 2; //wood crate
export const V = 3; //metal crate
export const X = 4; //wood target
export const Y = 5; //metal target
export const Z = 6; //player target
export const c = 7; //crack
export const w = 8; //wall
export const o = 9; //empty

export const CELL_IMAGE_MAPPING: ImageAsset[] = [];
CELL_IMAGE_MAPPING[P] = ImageAsset.player_d;
CELL_IMAGE_MAPPING[U] = ImageAsset.crate_wood;
CELL_IMAGE_MAPPING[V] = ImageAsset.crate_metal;
CELL_IMAGE_MAPPING[X] = ImageAsset.target_wood_1;
CELL_IMAGE_MAPPING[Y] = ImageAsset.target_metal_1;
CELL_IMAGE_MAPPING[Z] = ImageAsset.target_player_1;
CELL_IMAGE_MAPPING[c] = ImageAsset.crack_1;
CELL_IMAGE_MAPPING[w] = ImageAsset.wall;
export const CELL_LAYER_MAPPING: LayerId[] = [];
CELL_LAYER_MAPPING[P] = LayerId.player;
CELL_LAYER_MAPPING[U] = LayerId.crate;
CELL_LAYER_MAPPING[V] = LayerId.crate;
CELL_LAYER_MAPPING[X] = LayerId.target;
CELL_LAYER_MAPPING[Y] = LayerId.target;
CELL_LAYER_MAPPING[Z] = LayerId.target;
CELL_LAYER_MAPPING[c] = LayerId.crack;
CELL_LAYER_MAPPING[w] = LayerId.wall;

// noinspection JSUnusedGlobalSymbols
export const ALL_CELL_TYPES = [P, U, V, X, Y, o, w];

export interface Level {
    forkMax: number;

    map: number[];
}

levels[0] = {
    forkMax: 0,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, X, w, w, w, w,
        w, w, w, w, U, w, w, w, w,
        P, o, o, o, o, o, o, o, Z,
        w, w, w, w, V, w, w, w, w,
        w, w, w, w, Y, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[1] = {
    forkMax: 0,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, U, o, Y, o, o, w,
        P, c, o, o, o, o, o, c, Z,
        w, o, o, V, o, X, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[2] = {
    forkMax: 0,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, o, U, o, X, w,
        w, c, w, w, w, o, w, w, w,
        P, o, w, w, w, o, o, o, Z,
        w, c, w, w, w, o, w, w, w,
        w, o, o, o, o, V, o, Y, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};

export const startLevel = 2;