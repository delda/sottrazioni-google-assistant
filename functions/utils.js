'use strict';
var log = typeof log === undefined ? false : log;

class Utils {
    pickNumbers(level) {
        log && console.log('[pickNumbers]');
        let subtrahend, minuend, multiplier;
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
        let substraction = Substraction;
        substraction.subtrahend = this.getRandomNumber(1, multiplier);
        substraction.minuend = this.getRandomNumber(0, substraction.subtrahend);
        substraction.result = substraction.subtrahend - substraction.minuend;

        return substraction;
    }

    getRandomNumber(min, max) {
        log && console.log('[getRandomNumber]');

        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

const Substraction = {
    subtrahend: 0,
    minuend: 0,
    result: 0
};

const levels = ['base', 'elementare', 'medio', 'superiore'];

module.exports = { Utils, levels };