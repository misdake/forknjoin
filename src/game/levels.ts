import {ImageAsset, LayerId} from "./enums";

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
    startimes: number[];
    besttime?: number;
    showkey: boolean;
    map: number[];
}

export const levels: Level[] = [{
    name: "Sokoban",
    maxtime: -1,
    startimes: [20, 15, 13],
    besttime: 13,
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
}, {
    name: "Wood and Metal",
    maxtime: -1,
    startimes: [30, 24, 17],
    besttime: 17,
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
}, {
    name: "K to Fork<br>Then J to Join",
    maxtime: -1,
    startimes: [30, 22, 15],
    besttime: 15,
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
}, {
    name: "Clear the road",
    maxtime: -1,
    startimes: [30, 25, 17],
    besttime: 17,
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
}, {
    name: "Inside-out 1",
    maxtime: 0,
    startimes: [25, 20, 17],
    showkey: false,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, o, o, o, w,
        w, w, w, o, U, o, w, o, w,
        P, o, o, o, o, o, o, o, Z,
        w, w, w, o, o, o, w, w, w,
        w, w, w, w, w, X, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
}, {
    name: "Inside-out 2",
    maxtime: 0,
    startimes: [25, 20, 17],
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, o, w, w, w,
        w, w, w, o, U, o, w, w, w,
        P, o, o, o, o, o, o, o, Z,
        w, w, w, o, o, o, w, w, w,
        w, w, w, w, w, X, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
}, {
    name: "Inside-out 3",
    maxtime: 0,
    startimes: [40, 36, 32],
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, Y, w, w, w,
        w, w, w, o, U, o, w, w, w,
        P, o, o, o, o, o, o, o, Z,
        w, w, w, o, V, o, w, w, w,
        w, w, w, w, w, X, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
}, {
    name: "Insider",
    maxtime: -1,
    startimes: [50, 38, 33],
    besttime: 31,
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
}, {
    name: "Corner",
    maxtime: -1,
    startimes: [120, 70, 50],
    besttime: 37,
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
}, {
    name: "One more",
    maxtime: -1,
    startimes: [150, 110, 85],
    besttime: 75,
    showkey: true,
    map: [
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
        w, o, w, w, w, o, o, w, w,
        w, o, V, o, X, o, o, o, w,
        P, o, U, w, Y, X, w, o, Z,
        w, o, U, o, o, w, w, o, w,
        w, o, o, o, o, w, w, o, w,
        w, w, w, w, w, w, w, w, w,
        w, w, w, w, w, w, w, w, w,
    ],
}, {
    name: "Kill-stealing",
    maxtime: -1,
    startimes: [200, 130, 110],
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
}, {
    name: "Teamwork<br>80 turns",
    maxtime: 80,
    startimes: [80, 70, 62],
    besttime: 58,
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
}];

export const startLevel = 0;