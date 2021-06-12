import P = LevelCell.P;
import A = LevelCell.A;
import B = LevelCell.B;
import X = LevelCell.X;
import Y = LevelCell.Y;
import o = LevelCell.o;
import W = LevelCell.W;

export const levels: Level[] = [];

namespace LevelCell {
    export const P = 1; //player

    export const A = 2; //wood crate
    export const B = 3; //metal crate

    export const X = 2; //wood target
    export const Y = 3; //metal target

    export const o = 4; //empty
    export const W = 5; //wall
}

export interface Level {
    forkMax: number;

    map: number[][];
}

levels[0] = {
    forkMax: 0,
    map: [
        [W, W, W, W, W, W, W, W, W],
        [W, o, o, o, o, o, o, o, W],
        [W, o, o, o, o, o, o, o, W],
        [W, o, o, o, o, o, o, o, W],
        [W, o, P, o, A, 0, X, o, W],
        [W, o, o, o, o, o, o, o, W],
        [W, o, o, o, o, o, o, o, W],
        [W, o, o, o, o, o, o, o, W],
        [W, W, W, W, W, W, W, W, W],
    ],
};

// noinspection JSUnusedGlobalSymbols
export const ALL_CELL_TYPES = [P, A, B, X, Y, o, W];
