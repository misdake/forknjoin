import {SoundAsset} from "../game/enums";

export class SoundAssets {

    private static context = new AudioContext();

    static init() {
        (window as any).play1 = () => SoundAssets.play(SoundAsset.done);
        (window as any).play2 = () => SoundAssets.play(SoundAsset.fork);
        (window as any).play3 = () => SoundAssets.play(SoundAsset.join);

        let assets = Object.values(SoundAsset);
        return Promise.all(assets.map(file => {
            console.log("loaded sound", file);
            let promise = new Promise<void>(resolve => {
                let request = new XMLHttpRequest();
                request.open("GET", "assets/" + file, true);
                request.responseType = "arraybuffer";
                request.onload = function () {
                    SoundAssets.context.decodeAudioData(request.response).then(buffer => {
                        SoundAssets.sounds.set(file, buffer);
                        resolve();
                    }).catch(() => {
                        resolve(); //force resolve
                    });
                };
                request.send();
            });
            return promise;
        }));
    }

    private static sounds = new Map<string, AudioBuffer>();

    static play(asset: SoundAsset) {
        console.log(asset);
        let sound = SoundAssets.sounds.get(asset.valueOf());
        if (sound) {
            let bufferSource = SoundAssets.context.createBufferSource();
            bufferSource.buffer = sound;
            bufferSource.connect(SoundAssets.context.destination);
            bufferSource.start();
        }
    }
}