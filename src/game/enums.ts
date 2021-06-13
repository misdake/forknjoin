export enum ImageAsset {
    placeholder = "placeholder.png",

    player_u = "player_u.png",
    player_d = "player_d.png",
    player_l = "player_l.png",
    player_r = "player_r.png",
    fork_u = "fork_u.png",
    fork_d = "fork_d.png",
    fork_l = "fork_l.png",
    fork_r = "fork_r.png",

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

export const PLAYER_FORK_MAPPING = new Map<ImageAsset, ImageAsset>([
    [ImageAsset.player_u, ImageAsset.fork_u],
    [ImageAsset.player_d, ImageAsset.fork_d],
    [ImageAsset.player_l, ImageAsset.fork_l],
    [ImageAsset.player_r, ImageAsset.fork_r],
])

export enum SoundAsset {
    fork = "fork.wav",
    join = "join.wav",
    done = "done.wav",
    move = "move.wav",
}

export enum Action {
    up = 1,
    down,
    left,
    right,
    idle,

    undo,
    redo,

    fork = 10,
    join,

    restart = 20,
}

export enum LayerId {
    bg = 1,
    crack,
    crate,
    target,
    fork,
    player,
    wall
}