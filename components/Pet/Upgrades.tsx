import { ReactElement, useState } from 'react';

import { Button } from '..';

interface Upgrade {
    cost: number;
    interval: number;
    name: string;
    pets: number;
}

// the maximum interval value in the upgrades list below
// could calculate dynamically but lazy
export const maxUpgradeInterval = 5;
export const upgrades: Upgrade[] = [
    {
        cost: 20,
        interval: 5,
        name: 'Employees',
        pets: 1,
    },
];

export function UpgradesMenu(props: { onBuyUpgrade: (i: number) => void; pets: number; purchasedUpgrades: number[] }): ReactElement {
    const [upgradesOpen, setUpgradesOpen] = useState(false);

    return (
        <div className="fixed right-0 bottom-0 p-4 mr-4 bg-black bg-opacity-50 rounded-t-xl no-select">
            <p className="font-bold cursor-pointer" onClick={() => setUpgradesOpen(!upgradesOpen)}>
                Upgrades
            </p>
            <div
                className={`transition-slide ${upgradesOpen ? 'max-h-16' : 'max-h-0'}`}
                style={{ clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
                {upgrades.map((upgrade, i) => (
                    <div className="flex gap-2 justify-center items-center" key={i}>
                        <p>[x{props.purchasedUpgrades[i]}]</p>
                        <p>{upgrade.name}</p>
                        <p>{upgrade.pets / upgrade.interval} pets/s</p>
                        <Button
                            content={`Buy: ${upgrade.cost} pets`}
                            disabled={upgrade.cost > props.pets}
                            onClick={() => props.onBuyUpgrade(i)}
                            subClassName="py-1 px-2"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
