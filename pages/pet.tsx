import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Head } from '../components';

const IMG_UNPET = '/emotes/unpet.png';
const IMG_PET = '/emotes/pet.png';
const EFFECT_WIDTH = 64;

const emotes = ['flushed', 'heart', 'hug', 'surprised'];

// snippets of code regarding audio borrowed from Wave.js: https://github.com/foobar404/Wave.js
// TODO: make the background canvas resize when the window size changes

const Page: NextPage = () => {
    // pet counter
    const [pets, setPets] = useState<number>(parseInt((typeof localStorage != 'undefined' ? localStorage.getItem('pets') : '0') || '0'));
    // whether erisly is currently being petted or not. we just match the src at the moment to check
    const [src, setSrc] = useState<string>(IMG_UNPET);
    // tries to align with the bass/bpm of the audio.
    const [musicIntensity, setMusicIntensity] = useState<number>(1);
    // the background effects as they scroll by
    const [effects] = useState<{ emote: typeof emotes[number]; x: number; y: number }[]>([]);

    function startPet() {
        if (src == IMG_PET) return;

        setPets(pets + 1);
        setSrc(IMG_PET);
        const emote = emotes[random(0, emotes.length - 1)];
        effects.push({ emote, x: -1, y: 0 });
        localStorage.setItem('pets', (pets + 1).toString());

        const audio = document.getElementById('audio') as HTMLAudioElement;
        if (audio.paused) {
            audio.volume = 0.5;
            audio.play();
        }
    }

    function endPet() {
        setSrc(IMG_UNPET);
    }

    function random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // all client-side only stuff
    useEffect(() => {
        // an array of all the cached background effect images
        const emoteImages: HTMLImageElement[] = [];

        let maxAmp = 1;
        let data: Uint8Array;
        let analyser: AnalyserNode;
        let audioReady = false;

        async function init() {
            emotes.forEach(async (emote, i) => {
                emoteImages[i] = await loadImage(`/_next/image?url=/emotes/${emote}.png&w=${EFFECT_WIDTH}&q=100`);
            });
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // gonna edit my eslint config to fix this eventually
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const ctx = canvas.getContext('2d')!;
            window.requestAnimationFrame(() => renderCanvasFrame(ctx));

            const audio = document.getElementById('audio') as HTMLAudioElement;
            audio.onplay = () => {
                if (audioReady) return;
                audioReady = true;

                const audioCtx = new AudioContext();
                analyser = audioCtx.createAnalyser();
                const source = audioCtx.createMediaElementSource(audio);

                source.connect(analyser);
                source.connect(audioCtx.destination);

                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                data = new Uint8Array(bufferLength);
            };
        }

        function renderCanvasFrame(ctx: CanvasRenderingContext2D) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            effects.forEach((effect, i) => {
                if (effect.x == -1) effect.x = random(0, window.innerWidth - EFFECT_WIDTH);
                ctx.drawImage(emoteImages[emotes.indexOf(effect.emote)], effect.x, window.innerHeight - effect.y);
                effect.y = effect.y + 1;
                if (effect.y - EFFECT_WIDTH >= window.innerHeight) effects.splice(i, 1);
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
    }, [effects]);

    return (
        <div className="text-white bg-erisly-600" onMouseUp={endPet}>
            <Head description="do it u wont" image="emotes/pet.png" title="Pet the Erisly" />

            <main className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <div onMouseDown={startPet} onTouchStart={startPet}>
                    <div className={src == IMG_PET ? undefined : 'hidden'}>
                        <Image
                            alt="Erisly"
                            className="object-contain rounded-md cursor-pointer no-highlight touch-none"
                            height={256}
                            quality="100"
                            src={IMG_PET}
                            width={256}
                        />
                    </div>
                    <div className={src == IMG_UNPET ? undefined : 'hidden'}>
                        <Image
                            alt="Erisly"
                            className="object-contain rounded-md cursor-pointer no-highlight touch-none"
                            height={256}
                            quality="100"
                            src={IMG_UNPET}
                            width={256}
                        />
                    </div>
                </div>

                <p className={`pt-4 text-4xl font-bold transition-transform ${src == IMG_PET ? '-translate-y-1' : ''}`}>{pets} pets</p>
                <audio hidden id="audio" loop src="/click_the_erisly.mp3" />
            </main>

            <div className="absolute top-0 min-h-screen overflow-hidden pointer-events-none min-w-screen" style={{ transform: 'translateZ(0)' }}>
                <canvas className="opacity-30" id="canvas" style={{ transform: `scale(${musicIntensity})` }} />
            </div>
        </div>
    );
};

export default Page;

// all of these were borrowed from Wave.js
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
