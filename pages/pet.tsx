// man who refuses to learn react or next.js attempts to make game
// if this works i will be amazed

import type { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Head, Marquee, Pet } from '../components';

const Page: NextPage = () => {
    // pet counter
    const [save, setSave] = useState<Pet.SaveData>({
        pets: 0,
        // eslint-disable-next-line @typescript-eslint/no-array-constructor
        purchasedUpgrades: new Array(Pet.upgrades.length).fill(0),
        totalPets: 0,
        version: Pet.Constants.SAVE_VERSION,
    });
    // whether erisly is currently being petted or not. we just match the src at the moment to check
    const [src, setSrc] = useState(Pet.Constants.IMG_UNPET);
    // the background effects as they scroll by
    const [effects] = useState<Pet.Effect[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [marqueeQueue, setMarqueeQueue] = useState<string[]>([]);
    const canvasRef = useRef<Pet.CanvasRef>(null);

    function startPet() {
        if (src == Pet.Constants.IMG_PET) return;

        addPets(1);
        setSrc(Pet.Constants.IMG_PET);
        const emote = Pet.Constants.EFFECT_EMOTES[random(0, Pet.Constants.EFFECT_EMOTES.length - 1)];
        effects.push({ emote, x: -1, y: 0 });

        canvasRef.current && canvasRef.current.playAudio();
    }

    function endPet() {
        setSrc(Pet.Constants.IMG_UNPET);
    }

    const addToMarquee = useCallback(
        (line: Pet.Line) => {
            setMarqueeQueue([...marqueeQueue, line.line]);
        },
        [marqueeQueue]
    );

    const addPets = useCallback(
        (amount: number) => {
            setSave((save) => {
                Pet.Lines.checkAddPets(save, amount).forEach(addToMarquee);
                return { ...save, pets: save.pets + amount, totalPets: save.totalPets + amount };
            });
        },
        [addToMarquee]
    );

    function buyUpgrade(i: number) {
        if (Pet.calculateUpgradeCost(i, save.purchasedUpgrades) > save.pets) return;
        setSave((save) => ({
            ...save,
            pets: save.pets - Pet.calculateUpgradeCost(i, save.purchasedUpgrades),
            purchasedUpgrades: save.purchasedUpgrades.fill(save.purchasedUpgrades[i] + 1, i, i + 1),
        }));

        Pet.Lines.checkBuyUpgrade(save).forEach(addToMarquee);
    }

    function random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // all client-side only stuff
    useEffect(() => {
        if (initialized) return;
        setInitialized(true);

        if (typeof localStorage != 'undefined' && localStorage.getItem(Pet.Constants.SAVE_ID) != null) {
            try {
                const parsedSave = JSON.parse(localStorage.getItem(Pet.Constants.SAVE_ID) as string) as Pet.SaveData;
                if (parsedSave.version == Pet.Constants.SAVE_VERSION) setSave(parsedSave);
                else alert('Your save data is out of date. Resetting your progress...');
            } catch (e) {
                alert('Your save data is corrupted. Resetting your progress...');
            }
        }

        let interval = 1;
        function intervalRunner() {
            setSave((save) => {
                let newPets = 0;
                Pet.upgrades.forEach((upgrade, i) => {
                    const purchased = save.purchasedUpgrades[i];
                    if (purchased == 0) return;
                    let pets = upgrade.pets * Math.floor(purchased / upgrade.interval);
                    if (interval % upgrade.interval == 0) pets += purchased % upgrade.interval;
                    newPets += pets;
                });

                localStorage.setItem(Pet.Constants.SAVE_ID, JSON.stringify(save));
                addPets(newPets);
                return save;
            });

            interval++;
            if (interval > Pet.maxUpgradeInterval) interval = 1;
        }

        setInterval(intervalRunner, 1000);
    }, [effects, initialized, addPets]);

    return (
        <div className="text-white bg-erisly-600" onMouseUp={endPet}>
            <Head description="do it u wont" image="erisly/emotes/pet.png" title="Pet the Erisly" />

            <main className="flex relative z-10 flex-col flex-1 justify-center items-center px-8 min-h-screen text-center">
                {marqueeQueue[0] ? (
                    <Marquee
                        className="overflow-hidden fixed top-0 py-4 min-w-full text-xl bg-black bg-opacity-40 animate-marquee-in"
                        content={marqueeQueue.join('          ')}
                        onComplete={() => marqueeQueue.splice(0, 1)}
                    />
                ) : (
                    <></>
                )}
                <div onMouseDown={startPet} onTouchStart={startPet}>
                    <div className={src == Pet.Constants.IMG_PET ? undefined : 'hidden'}>
                        <Image
                            alt="Erisly"
                            className="object-contain rounded-md cursor-pointer no-highlight touch-none"
                            height={256}
                            quality="100"
                            src={Pet.Constants.IMG_PET}
                            width={256}
                        />
                    </div>
                    <div className={src == Pet.Constants.IMG_UNPET ? undefined : 'hidden'}>
                        <Image
                            alt="Erisly"
                            className="object-contain rounded-md cursor-pointer no-highlight touch-none"
                            height={256}
                            quality="100"
                            src={Pet.Constants.IMG_UNPET}
                            width={256}
                        />
                    </div>
                </div>

                <p className={`pt-4 text-4xl font-bold transition-transform ${src == Pet.Constants.IMG_PET ? '-translate-y-1' : ''}`}>
                    {save.pets} pets
                </p>

                <Pet.UpgradesMenu onBuyUpgrade={buyUpgrade} pets={save.pets} purchasedUpgrades={save.purchasedUpgrades} />
            </main>

            <Pet.Canvas effects={effects} ref={canvasRef} />
        </div>
    );
};

export default Page;
