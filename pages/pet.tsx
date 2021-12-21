import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const DESCRIPTION = `do it u wont`;
const IMG_UNPET = '/emotes/unpet.png';
const IMG_PET = '/emotes/pet.png';
const EFFECT_WIDTH = 64;

const emotes = ['flushed', 'heart', 'hug', 'surprised'];

// snippets of code regarding audio borrowed from https://github.com/foobar404/Wave.js

const Index: NextPage = () => {
    const [pets, setPets] = useState<number>(parseInt((typeof localStorage != 'undefined' ? localStorage.getItem('pets') : '0') || '0'));
    const [src, setSrc] = useState<string>(IMG_UNPET);
    const [siz, setSiz] = useState<number>(1);
    const [effects] = useState<{ emote: typeof emotes[number]; x: number; y: number }[]>([]);

    function startPet() {
        setPets(pets + 1);
        setSrc(IMG_PET);
        const emote = emotes[random(0, emotes.length - 1)];
        effects.push({ emote, x: -1, y: 0 });
        localStorage.setItem('pets', (pets + 1).toString());

        const audio = document.getElementById('audio') as HTMLAudioElement;
        if (audio.paused) audio.play();
    }

    function endPet() {
        setSrc(IMG_UNPET);
    }

    function random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    useEffect(() => {
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

                const arr1 = organizeData(data).mids;
                let arr2 = splitData(arr1, 2)[0];
                arr2 = shrinkData(arr2, 100);
                arr2 = mirrorData(arr2);
                arr2 = scaleData(arr2, window.innerHeight) as number[];
                arr2 = ampData(arr2, 0.75);

                const amp = arr2[48];
                if (amp > maxAmp) maxAmp = amp;
                setSiz(1 + amp / maxAmp / 50);
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
        <div className="text-white bg-erisly-600">
            <Head>
                <title>Pet the Erisly</title>
                <meta content={DESCRIPTION} name="description" />
                <meta content="#FF6394" name="theme-color" />
                <meta content="website" property="og:type" />
                <meta content="Pet the Erisly" name="twitter:title" property="og:title" />
                <meta content={DESCRIPTION} name="twitter:description" property="og:description" />
                {/* TODO: Twitter Image
                    <meta content="https://erisly.moe/_next/image?url=%2Ferisly.png&w=256&q=100" name="twitter:image" property="og:image" />
                */}
                <meta content="summary" name="twitter:card" />
                <meta content="@ErislyBot" name="twitter:site" />
            </Head>
            <main className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                <Image
                    alt="Erisly"
                    className="object-contain rounded-md cursor-pointer"
                    height={256}
                    onMouseDown={startPet}
                    onMouseUp={endPet}
                    quality="100"
                    src={src}
                    width={256}
                />
                <p className={`pt-4 text-4xl font-bold transition-transform ${src == IMG_PET ? '-translate-y-1' : ''}`}>{pets} pets</p>
                <audio hidden id="audio" loop src="/click_the_erisly.mp3" />
            </main>
            <div className="absolute top-0 min-h-screen overflow-hidden pointer-events-none min-w-screen" style={{ transform: 'translateZ(0)' }}>
                <canvas className="opacity-30" id="canvas" style={{ transform: `scale(${siz})` }} />
            </div>
        </div>
    );
};

export default Index;

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
