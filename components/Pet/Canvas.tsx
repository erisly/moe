import { forwardRef, ReactElement, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';

import * as Constants from './Constants';

export interface Effect {
    emote: typeof Constants.EFFECT_EMOTES[number];
    x: number;
    y: number;
}

export interface CanvasRef {
    playAudio: () => void;
}

interface CanvasProps {
    effects: Effect[];
}

// snippets of code regarding audio borrowed from Wave.js: https://github.com/foobar404/Wave.js
// TODO: make the background canvas resize when the window size changes

export const Canvas = forwardRef<CanvasRef, CanvasProps>((props: CanvasProps, ref): ReactElement => {
    // tries to align with the bass/bpm of the audio.
    const [musicIntensity, setMusicIntensity] = useState(1);
    const [initialized, setInitialized] = useState(false);
    const audioRef = useRef<HTMLMediaElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
        playAudio: () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.volume = 0.5;
                audioRef.current.play();
            }
        },
    }));

    useEffect(() => {
        // an array of all the cached background effect images
        const emoteImages: HTMLImageElement[] = [];

        let maxAmp = 1;
        let data: Uint8Array;
        let analyser: AnalyserNode;
        let audioReady = false;

        async function init() {
            if (initialized) return;
            setInitialized(true);

            Constants.EFFECT_EMOTES.forEach(async (emote, i) => {
                emoteImages[i] = await loadImage(`/_next/image?url=/erisly/emotes/${emote}.png&w=${Constants.EFFECT_WIDTH}&q=100`);
            });
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;

                // gonna edit my eslint config to fix this eventually
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const ctx = canvasRef.current.getContext('2d')!;
                window.requestAnimationFrame(() => renderCanvasFrame(ctx));
            }

            if (audioRef.current) {
                audioRef.current.onplay = () => {
                    if (audioReady) return;
                    audioReady = true;

                    const audioCtx = new AudioContext();
                    analyser = audioCtx.createAnalyser();
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const source = audioCtx.createMediaElementSource(audioRef.current!);

                    source.connect(analyser);
                    source.connect(audioCtx.destination);

                    analyser.fftSize = 2048;
                    const bufferLength = analyser.frequencyBinCount;
                    data = new Uint8Array(bufferLength);
                };
            }
        }

        function random(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function renderCanvasFrame(ctx: CanvasRenderingContext2D) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            props.effects.forEach((effect, i) => {
                if (effect.x == -1) effect.x = random(0, window.innerWidth - Constants.EFFECT_WIDTH);
                const emoteImage = emoteImages[Constants.EFFECT_EMOTES.indexOf(effect.emote)];
                if (emoteImage) ctx.drawImage(emoteImage, effect.x, window.innerHeight - effect.y);
                effect.y = effect.y + 1;
                if (effect.y - Constants.EFFECT_WIDTH >= window.innerHeight) props.effects.splice(i, 1);
            });

            if (analyser) {
                analyser.getByteFrequencyData(data);

                // i was struggling to find a way to make the audio sync with the bass
                // the only working example i could find was with one of Wave.js' visualisers, so i borrowed it
                // you could likely simplify this down or separate the functions into another file, but for now it's fine
                // it's not like this is a state-of-the-art website haha
                // - PikaDude
                const arr1 = organizeData(data).mids;
                let arr2 = splitData(arr1, 2)[0];
                arr2 = shrinkData(arr2, 100);
                arr2 = mirrorData(arr2);
                arr2 = scaleData(arr2, window.innerHeight) as number[];
                arr2 = ampData(arr2, 0.75);

                const amp = arr2[48];
                if (amp > maxAmp) maxAmp = amp;
                // we scale the amplification down to make the background less intense, it might make people sick otherwise
                setMusicIntensity(1 + amp / maxAmp / ((window.innerWidth * window.innerHeight) / 50000));
            }

            window.requestAnimationFrame(() => renderCanvasFrame(ctx));
        }

        function loadImage(src: string): Promise<HTMLImageElement> {
            return new Promise((resolve) => {
                const img = new window.Image();
                img.addEventListener('load', () => resolve(img));
                img.src = src;
            });
        }
        init();
    }, [initialized, props]);

    return (
        <>
            <audio hidden loop ref={audioRef} src="/click_the_erisly.mp3" />
            <div className="overflow-hidden absolute top-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(0)' }}>
                <canvas className="opacity-30" ref={canvasRef} style={{ transform: `scale(${musicIntensity})` }} />
            </div>
        </>
    );
});
Canvas.displayName = 'Canvas';

// all of these below were borrowed from Wave.js
function mirrorData(data: number[]) {
    let rtn = [];

    for (let i = 0; i < data.length; i += 2) {
        rtn.push(data[i]);
    }

    rtn = [...rtn, ...rtn.reverse()];
    return rtn;
}

function shrinkData(data: number[], extra: number) {
    //resize array by % of current array
    if (extra < 1) {
        extra = data.length * extra;
    }

    const rtn = [];
    const splitAt = Math.floor(data.length / extra);

    for (let i = 1; i <= extra; i++) {
        const arraySection = data.slice(i * splitAt, i * splitAt + splitAt);
        const middle = arraySection[Math.floor(arraySection.length / 2)];
        rtn.push(middle);
    }

    return rtn;
}

function splitData(data: Uint8Array, extra: number) {
    const size = Math.floor(data.length / extra);
    const rtn = [];
    let temp = [];

    let track = 0;
    for (let i = 0; i <= size * extra; i++) {
        if (track === size) {
            rtn.push(temp);
            temp = [];
            track = 0;
        }

        temp.push(data[i]);
        track++;
    }

    return rtn;
}

function scaleData(data: number[], extra: number) {
    let scalePercent = extra / 255;
    if (extra <= 3 && extra >= 0) scalePercent = extra;
    const rtn = data.map((value) => value * scalePercent);
    return rtn;
}

function organizeData(data: Uint8Array) {
    const rtn = {
        base: data.slice(60, 120),
        mids: data.slice(255, 2000),
        vocals: data.slice(120, 255),
    };
    return rtn;
}

function ampData(data: number[], extra?: number) {
    const rtn: number[] = [];
    data.forEach((val) => {
        extra = extra as number;

        rtn.push(val * (extra + 1));
    });
    return rtn;
}
