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
    join_u = "join_u.png",
    join_d = "join_d.png",
    join_l = "join_l.png",
    join_r = "join_r.png",

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

export const PLAYER_JOIN_MAPPING = new Map<ImageAsset, ImageAsset>([
    [ImageAsset.fork_u, ImageAsset.join_u],
    [ImageAsset.fork_d, ImageAsset.join_d],
    [ImageAsset.fork_l, ImageAsset.join_l],
    [ImageAsset.fork_r, ImageAsset.join_r],
    [ImageAsset.join_u, ImageAsset.join_u],
    [ImageAsset.join_d, ImageAsset.join_d],
    [ImageAsset.join_l, ImageAsset.join_l],
    [ImageAsset.join_r, ImageAsset.join_r],
    [ImageAsset.player_u, ImageAsset.join_u],
    [ImageAsset.player_d, ImageAsset.join_d],
    [ImageAsset.player_l, ImageAsset.join_l],
    [ImageAsset.player_r, ImageAsset.join_r],
]);
export const PLAYER_FORK_MAPPING = new Map<ImageAsset, ImageAsset>([
    [ImageAsset.fork_u, ImageAsset.fork_u],
    [ImageAsset.fork_d, ImageAsset.fork_d],
    [ImageAsset.fork_l, ImageAsset.fork_l],
    [ImageAsset.fork_r, ImageAsset.fork_r],
    [ImageAsset.join_u, ImageAsset.fork_u],
    [ImageAsset.join_d, ImageAsset.fork_d],
    [ImageAsset.join_l, ImageAsset.fork_l],
    [ImageAsset.join_r, ImageAsset.fork_r],
    [ImageAsset.player_u, ImageAsset.fork_u],
    [ImageAsset.player_d, ImageAsset.fork_d],
    [ImageAsset.player_l, ImageAsset.fork_l],
    [ImageAsset.player_r, ImageAsset.fork_r],
]);
export const FORKJOIN_PLAYER_MAPPING = new Map<ImageAsset, ImageAsset>([
    [ImageAsset.fork_u, ImageAsset.player_u],
    [ImageAsset.fork_d, ImageAsset.player_d],
    [ImageAsset.fork_l, ImageAsset.player_l],
    [ImageAsset.fork_r, ImageAsset.player_r],
    [ImageAsset.join_u, ImageAsset.player_u],
    [ImageAsset.join_d, ImageAsset.player_d],
    [ImageAsset.join_l, ImageAsset.player_l],
    [ImageAsset.join_r, ImageAsset.player_r],
    [ImageAsset.player_u, ImageAsset.player_u],
    [ImageAsset.player_d, ImageAsset.player_d],
    [ImageAsset.player_l, ImageAsset.player_l],
    [ImageAsset.player_r, ImageAsset.player_r],
]);

export enum SoundAsset {
    fork = "fork.wav",
    join = "join.wav",
    done = "done.wav",
    move = "move.wav",
}

export enum ActionType {
    none = 0,

    //these are recorded
    up = 1,
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

export enum LayerId {
    bg = 1,
    crack,
    crate,
    target,
    player,
    wall
}