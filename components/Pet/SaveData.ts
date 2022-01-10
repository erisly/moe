import * as Constants from './Constants';

export default interface SaveData {
    pets: number;
    purchasedUpgrades: number[];
    totalPets: number;
    version: typeof Constants.SAVE_VERSION;
}
