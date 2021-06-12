import {ImageAsset, LayerId} from "./enums";

export const levels: Level[] = [];

export const P = 1; //player

export const A = 2; //wood crate
export const B = 3; //metal crate

export const X = 4; //wood target
export const Y = 5; //metal target

export const w = 6; //wall
export const o = 7; //empty


export const CELL_IMAGE_MAPPING: ImageAsset[] = [];
CELL_IMAGE_MAPPING[P] = ImageAsset.player;
CELL_IMAGE_MAPPING[A] = ImageAsset.crate_wood;
CELL_IMAGE_MAPPING[B] = ImageAsset.crate_metal;
CELL_IMAGE_MAPPING[X] = ImageAsset.target_wood_1;
CELL_IMAGE_MAPPING[Y] = ImageAsset.target_metal_1;
CELL_IMAGE_MAPPING[w] = ImageAsset.wall;
export const CELL_LAYER_MAPPING: LayerId[] = [];
CELL_LAYER_MAPPING[P] = LayerId.player;
CELL_LAYER_MAPPING[A] = LayerId.crate;
CELL_LAYER_MAPPING[B] = LayerId.crate;
CELL_LAYER_MAPPING[X] = LayerId.target;
CELL_LAYER_MAPPING[Y] = LayerId.target;
CELL_LAYER_MAPPING[w] = LayerId.wall;

export interface Level {
    forkMax: number;

    map: number[];
}

levels[0] = {
    forkMax: 0,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        o, o, P, o, A, o, X, o, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, o, o, o, o, o, o, o, w,
        w, w, w, w, w, w, w, w, w,
    ],
};

// noinspection JSUnusedGlobalSymbols
export const ALL_CELL_TYPES = [P, A, B, X, Y, o, w];
