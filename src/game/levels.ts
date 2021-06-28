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

(function () {
    let g = window as any;
    g.P = P;
    g.U = U;
    g.V = V;
    g.X = X;
    g.Y = Y;
    g.Z = Z;
    g.c = c;
    g.w = w;
    g.o = o;
})();

export interface Level {
    name: string;
    maxtime: number;
    star3time: number;
    star2time: number;
    star1time: number;
    showkey: boolean;
    map: number[];
}

levels[0] = {
    name: "Sokoban",
    maxtime: -1,
    star3time: 13,
    star2time: 15,
    star1time: 20,
    showkey: false,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, X, w, w, w, w,
        w, w, w, w, o, w, w, w, w,
        w, w, w, w, U, w, w, w, w,
        P, o, o, o, o, o, o, o, Z,
        w, w, w, w, V, w, w, w, w,
        w, w, w, w, o, w, w, w, w,
        w, w, w, w, Y, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[1] = {
    name: "Wood and Metal",
    maxtime: -1,
    star3time: 17,
    star2time: 24,
    star1time: 30,
    showkey: false,
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
    name: "K to Fork<br>Then<br>J to Join",
    maxtime: -1,
    star3time: 15,
    star2time: 22,
    star1time: 30,
    showkey: true,
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
levels[3] = {
    name: "Help each other",
    maxtime: -1,
    star3time: 17,
    star2time: 25,
    star1time: 30,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, c, o, o, o, w,
        w, o, w, w, U, w, w, w, w,
        P, o, w, w, o, w, o, o, Z,
        w, o, w, w, o, w, o, o, w,
        w, o, o, o, o, o, o, X, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[4] = {
    name: "Insider",
    maxtime: -1,
    star3time: 33,
    star2time: 38,
    star1time: 50,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, w, w, w, o, o, w, w,
        w, o, U, o, o, o, o, o, w,
        P, o, U, w, X, X, w, o, Z,
        w, o, o, o, o, w, w, o, w,
        w, o, o, o, o, w, w, o, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[5] = {
    name: "Corner",
    maxtime: -1,
    star3time: 50,
    star2time: 70,
    star1time: 120,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, w, w, w, o, o, w, w,
        w, o, V, o, o, o, o, o, w,
        P, o, U, w, Y, X, w, o, Z,
        w, o, o, o, o, w, w, o, w,
        w, o, o, o, o, w, w, o, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[6] = {
    name: "Corners",
    maxtime: -1,
    star3time: 100,
    star2time: 130,
    star1time: 200,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, o, w, w, w, w, w, w,
        w, o, U, o, o, o, U, o, w,
        w, o, o, X, o, X, w, o, w,
        P, o, o, o, o, o, o, o, Z,
        w, o, o, X, o, X, o, o, w,
        w, w, U, c, w, o, U, o, w,
        w, w, o, o, w, w, w, o, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[7] = {
    name: "Kill-stealing",
    maxtime: -1,
    star3time: 110,
    star2time: 130,
    star1time: 200,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, w, w, w, o, w,
        w, o, U, U, X, X, w, o, w,
        w, P, U, o, X, X, V, o, w,
        w, o, o, w, U, Y, o, o, Z,
        w, o, o, o, o, w, o, o, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};
levels[8] = {
    name: "Teamwork<br>80 turns",
    maxtime: 80,
    star3time: 62,
    star2time: 70,
    star1time: 80,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, o, o, w, o, o, o, w,
        w, P, X, X, o, U, U, o, w,
        w, o, X, V, o, U, Y, o, w,
        w, o, V, V, o, Y, Y, o, Z,
        w, o, o, o, w, o, o, o, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
};

export const startLevel = 0;