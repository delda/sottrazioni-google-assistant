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
        const firebaseConfig = typeof process.env.FIREBASE_CONFIG === "undefined"
            ? ''
            : JSON.parse(process.env.FIREBASE_CONFIG);
        const hosting = "";
        const baseUrl = hosting || `https://${firebaseConfig.projectId}.firebaseapp.com`;

        return `<audio src="${baseUrl}/sounds/${sound}"/>`;
    }

    endOfConversation(conv) {
        const strings = require('./strings');

        strings.setLocale(conv.user.locale);

        let correctGuesses = strings.prompts('correctGuesses', conv.data.correctGuesses);
        let totalGuesses = strings.prompts('totalGuesses', conv.data.totalGuesses);
        let result = strings
            .prompts('summarize')
            .replace('%correctGuesses%', correctGuesses)
            .replace('%totalGuesses%', totalGuesses);
        result = result
            + ' '
            + strings.prompts('goodbye')
            + ' '
            + this.getSound('end.mp3');

        return this.getSpeakMarkup(result);
    }

    getCardinal(number) {
        return '<say-as interpret-as="cardinal">' +
            number +
            '</say-as>';
    }

    getSpeakMarkup(string) {
        return '<speak>'
            +  string
            + '</speak>';
    }

    getBreak(time) {
        return '<break time="' + time + '"/>';
    }

    howMuch(subtrahend, minuend) {
        const strings = require('./strings');
        strings.setLocale(conv.user.locale);

        return strings
            .prompts('how_much')
            + ' '
            + strings
                .prompts('subtraction')
                .replace('%subtrahend%', this.getCardinal(subtrahend))
                .replace('%minuend%', this.getCardinal(minuend))
            + '?';
    }
}

const Substraction = {
    subtrahend: 0,
    minuend: 0,
    result: 0
};

const levels = ['base', 'elementare', 'medio', 'superiore'];

module.exports = { Utils, Substraction };