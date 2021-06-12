export enum ImageAsset {
    placeholder = "placeholder.png",

    player = "player.png",

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

export enum Action {
    up = 1,
    down,
    left,
    right,
    idle,

    fork = 10,
    join,

    restart = 20,
    load, // param = level id
}

export enum LayerId {
    bg = 1,
    crack,
    crate,
    target,
    player,
    wall
}