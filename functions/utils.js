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

    getRandomSuggestions(substraction) {
        const shuffle = require('shuffle-array');

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

    getSound(sound) {
        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        const hosting = "";
        const baseUrl = hosting || `https://${firebaseConfig.projectId}.firebaseapp.com`;

        return `<audio src="${baseUrl}/sounds/${sound}"/>`;
    }

    endOfConversation(conv) {
        const strings = require('./strings');

        let correctGuesses = conv.data.correctGuesses === 1 ? 'una' : conv.data.correctGuesses;
        let totalGuesses = conv.data.totalGuesses === 1 ? 'una' : conv.data.totalGuesses;
        let domandaForm = 'domand' + (conv.data.correctGuesses === 1 ? 'a' : 'e');

        return strings
            .prompts('summarize')
            .replace('%correctGuesses%', correctGuesses)
            .replace('%totalGuesses%', totalGuesses)
            .replace('%domandaForm%', domandaForm);
    }

    getCardinal(number) {
        return '<say-as interpret-as="ordinal">' +
            number +
            '</say-as>';
    }
}

const Substraction = {
    subtrahend: 0,
    minuend: 0,
    result: 0
};

const levels = ['base', 'elementare', 'medio', 'superiore'];

module.exports = { Utils, levels, Substraction };