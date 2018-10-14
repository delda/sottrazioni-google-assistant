'use strict';

class Utils {

    pickNumbers(level) {
        console.log('[pickNumbers]');
        let firstAddend, secondAddend, multiplier;
        switch(level) {
            case 'base':
                multiplier = 10;
                break;
            case 'elementare':
                multiplier = 100;
                break;
            case 'medio':
                multiplier = 1000;
                break;
            case 'superiore':
                multiplier = 10000;
                break;
        }
        firstAddend = Utils.getRandomNumber(0, multiplier);
        secondAddend = Utils.getRandomNumber(0, (multiplier - firstAddend));

        return [firstAddend, secondAddend];
    }

    static getRandomNumber(min, max) {
        console.log('[getRandomNumber]');
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}

module.exports = { Utils };