export enum ImageAsset {
    placeholder = "placeholder.png",

    player0_u = "player0_u.png",
    player0_d = "player0_d.png",
    player0_l = "player0_l.png",
    player0_r = "player0_r.png",
    player1_u = "player1_u.png",
    player1_d = "player1_d.png",
    player1_l = "player1_l.png",
    player1_r = "player1_r.png",
    player2_u = "player2_u.png",
    player2_d = "player2_d.png",
    player2_l = "player2_l.png",
    player2_r = "player2_r.png",
    player3_u = "player3_u.png",
    player3_d = "player3_d.png",
    player3_l = "player3_l.png",
    player3_r = "player3_r.png",

    crack_1 = "crack_1.png",
    crack_2 = "crack_2.png",
    crack_3 = "crack_3.png",

    crate_wood = "crate_wood.png",
    crate_metal = "crate_metal.png",

    target_wood_1 = "target_wood_1.png",
    target_wood_2 = "target_wood_2.png",
    target_metal_1 = "target_metal_1.png",
    target_metal_2 = "target_metal_2.png",
    target_player_1 = "target_player_1.png",
    target_player_2 = "target_player_2.png",

    wall = "wall.png",

    bg1 = "bg1.png",
    bg2 = "bg2.png",
    bg3 = "bg3.png",
    bg4 = "bg4.png",
}

export const playerAssetByIndexDirection = (index: number, action: ActionType): ImageAsset => {
    return `player${index}_${DIRECTION_ASSET.get(action)}.png` as ImageAsset;
};

export enum SoundAsset {
    fork = "fork.wav",
    join = "join.wav",
    done = "done.wav",
    move = "move.wav",
}

export enum ActionType {
    none = 1,

    //these are recorded
    up = 2,
    down,
    left,
    right,
    idle,
    fork,

    //these take effects immediately
    switch = 10,
    undo = 20,
    redo,
    restart,
}

export const DIRECTION_DX_DY = new Map<ActionType, number[]>([
    [ActionType.up, [0, -1]],
    [ActionType.down, [0, 1]],
    [ActionType.left, [-1, 0]],
    [ActionType.right, [1, 0]],
]);
const DIRECTION_ASSET = new Map<ActionType, string>([
    [ActionType.up, "u"],
    [ActionType.down, "d"],
    [ActionType.left, "l"],
    [ActionType.right, "r"],
]);

export enum LayerId {
    bg = 1, //static
    crack, //dynamic
    crate, //dynamic
    target, //static
    player0 = 10, //dynamic
    player1, //dynamic
    player2, //dynamic
    player3, //dynamic
    wall = 100, //static
}

export const PLAYER_LAYERS = [LayerId.player0, LayerId.player1, LayerId.player2, LayerId.player3];