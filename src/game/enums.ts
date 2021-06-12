export enum ImageAsset {
    placeholder = "placeholder.png",

    player = "player.png",

    crate_wood = "crate_wood.png",
    crate_metal = "crate_metal.png",
    target_wood = "target_wood.png",
    target_metal = "target_metal.png",

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

    fork = 10,
    join,

    restart = 20,
    load, // param = level id
}

export enum LayerId {
    bg = 1,
    trace,
    crate,
    target,
    player,
    wall
}