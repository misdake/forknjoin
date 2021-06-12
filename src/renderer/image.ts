import {ImageAsset} from "../game/enums";

const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==";

export class ImageAssets {

    private static images = new Map<string, HTMLImageElement>();

    static init() {
        let assets = Object.values(ImageAsset);

        return Promise.all(assets.map(file => {
            console.log("load file", file);
            let promise = new Promise<void>((resolve, reject) => {
                let image = new Image();
                image.src = "assets/" + file;
                ImageAssets.images.set(file, image);
                image.onload = () => {
                    resolve();
                };
                image.onerror = () => {
                    console.log("image onerror, use fallback: ", file);
                    image.src = FALLBACK_IMAGE;
                };
            });
            return promise;
        }));
    }

    static get(asset: ImageAsset): HTMLImageElement {
        return ImageAssets.images.get(asset.valueOf());
    }

}