'use strict';

const shuffle = require('shuffle-array');

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

    getRandomSuggestions(substraction) {
        var suggestions = [];
        suggestions.push(parseInt(substraction.result));
        var number = 0;
        do {
            number = (substraction.subtrahend === 0)
                ? number + 1
                : this.getRandomNumber(0, substraction.subtrahend);
        } while (suggestions.includes(number));
        suggestions.push(number);
        do {
            number = (substraction.minuend === 0)
                ? number + 1
                : this.getRandomNumber(0, substraction.minuend);
        } while (suggestions.includes(number))
        suggestions.push(number);
        shuffle(suggestions);

        return suggestions;
    }

    endOfConversation(conv) {
        const strings = require('../functions/strings');

        let correctGuesses = conv.data.correctGuesses === 1 ? 'una' : conv.data.correctGuesses;
        let totalGuesses = conv.data.totalGuesses === 1 ? 'una' : conv.data.totalGuesses;
        let domandaForm = 'domand' + (conv.data.correctGuesses === 1 ? 'a' : 'e');

        return strings
            .prompts('summarize')
            .replace('%correctGuesses%', correctGuesses)
            .replace('%totalGuesses%', totalGuesses)
            .replace('%domandaForm%', domandaForm);
    }
}

const Substraction = {
    subtrahend: 0,
    minuend: 0,
    result: 0
};

const levels = ['base', 'elementare', 'medio', 'superiore'];

module.exports = { Utils, levels, Substraction };