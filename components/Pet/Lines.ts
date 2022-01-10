import SaveData from './SaveData';

export interface Line {
    line: string;
    requirements: {
        // must have at least 1 requirement
        // multiple requirements means they must all meet to pass (and)
        employees?: number;
        totalPets?: number;
    };
}

// runs each time an upgrade is purchased
export function checkBuyUpgrade(save: SaveData): Line[] {
    return list.filter((line) => {
        // if it has a totalPets requirement, it is handled by the addPets checker
        // CAVEAT: this does mean if a person satisfies a totalPets requirement BEFORE buying the required upgrades, the line will never show
        if (line.requirements.totalPets != undefined) return false;

        // "you know you can just have the whole entire thing as one return statement"
        // yeah but that's gonna look disgusting the more upgrades exist
        if (line.requirements.employees != undefined && save.purchasedUpgrades[0] == line.requirements.employees) return true;
        return false;
    });
}

// runs each time the pets counter increases
export function checkAddPets(save: SaveData, addedPets: number): Line[] {
    return list.filter((line) => {
        if (line.requirements.totalPets == undefined) return false;
        if (save.totalPets < line.requirements.totalPets && line.requirements.totalPets <= save.totalPets + addedPets) {
            // the only requirement is totalPets
            if (Object.keys(line.requirements).length == 1) return true;

            if (line.requirements.employees != undefined && line.requirements.employees <= save.purchasedUpgrades[0]) return true;
        }
        return false;
    });
}

const randomNewsUpdates = [
    'the latest sports video game will contain flamethrowers',
    'a man uses a toilet',
    'an actor joins a film',
    'the popular chat platform Discord makes yet another questionable decision',
    'a strange tanuki/racoon was arrested for being secretly involved in the mafia',
    'a new virtual reality platform promises a "brand new experience" while stealing from existing experiences',
    'a local man downloads a house',
    'a large multimedia company releases "DMCA Simulator" with themselves as the protagonist',
    'a new leak reveals that the latest video game title will add content that may be fun',
    'a woman sells a banana for 8 trillion dollars',
    'a recent study shows that the internet is pretty big',
    'scientists discover that water is wet',
];

function generateRandomEvents(count: number) {
    return fixCase(
        randomNewsUpdates
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .join(', ')
    );
}

function fixCase(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

const totalPetLines: Line[] = [
    {
        line: `*The mysterious woman doesn't seem to want to talk to you, but she seems to appreciate you petting her on her head.*`,
        requirements: {
            totalPets: 5,
        },
    },
];

const employeeLines: Line[] = [
    {
        line: `News Update: ${generateRandomEvents(3)}, and a local civilian has begun to hire various people to pet a woman on her head.`,
        requirements: {
            employees: 5,
        },
    },
    {
        line:
            `News Update: ${generateRandomEvents(2)}, ` +
            `and a local civilian still continues to hire people to pet a specific woman on her head. More details to follow shortly.`,
        requirements: {
            employees: 10,
        },
    },
    {
        line: `News Update: We have heard various employees say that they are not being paid in "material things" like money, they are being paid with the privilege to pet the mysterious woman.`,
        requirements: {
            employees: 20,
        },
    },
    {
        line: `BREAKING NEWS: A reporter has received exclusive footage of the mysterious woman being pet. The footage shows a tall woman with bright pink hair as employees crowd around her to pet her on her head.`,
        requirements: {
            employees: 5,
            totalPets: 1000,
        },
    },
];

export const list: Line[] = [...totalPetLines, ...employeeLines];
