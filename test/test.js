'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const assert = require('chai').assert;
const testCredentials = require("../test-credentials.json");
const strings = require('../functions/strings');
const { Utils, levels } = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);
const utils = new Utils();

action.startTest('sottrazioni - welcome', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech }) => {
            const splitText = textToSpeech[0].split('!');
            const greeting = splitText[0] + '!';
            const choise = splitText[1];
            assert.equal(strings.isPrompt('welcome', greeting), true);
            levels.forEach((level) => {
                expect(choise).to.have.string(level);
            });
            return action.send('base');
        })
        .then(({ textToSpeech }) => {
            expect(textToSpeech[0]).to.have.string('OK!');
        });
});

action.startTest('sottrazioni - right answer', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech }) => {
            const level = levels[utils.getRandomNumber(0, levels.length - 1)];
            return action.send(level);
        })
        .then(({ textToSpeech }) => {
            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            const re = RegExp('.+!');
            var rightResponse = re.exec(textToSpeech[0])[0];
            assert.equal(strings.isPrompt('right', rightResponse), true);
        });
});

action.startTest('sottrazioni - wrong answer', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech }) => {
            const level = levels[utils.getRandomNumber(0, levels.length - 1)];
            return action.send(level);
        })
        .then(({ textToSpeech }) => {
            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1] + 1;

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            const re = RegExp('.+!');
            var rightResponse = re.exec(textToSpeech[0])[0];
            assert.equal(strings.isPrompt('wrong', rightResponse), true);
        });
});
