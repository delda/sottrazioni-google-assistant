'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const chai = require('chai')
const assert = chai.assert;
const expect = chai.expect;
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
const testCredentials = require("../test-credentials.json");
const strings = require('../functions/strings');
const { Utils, levels } = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);
const utils = new Utils();

action.startTest('sottrazioni - welcome', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech).to.be.an('array');
            expect(textToSpeech).to.have.lengthOf(1);
            expect(textToSpeech).to.not.be.empty;
            const splitText = textToSpeech[0].split('!');
            const greeting = splitText[0] + '!';
            const choise = splitText[1];
            assert.equal(strings.isPrompt('welcome', greeting), true);
            levels.forEach((level) => {
                expect(choise).to.have.string(level);
            });

            expect(suggestions).to.be.an('array');
            expect(suggestions).to.have.lengthOf(levels.length);
            expect(suggestions).to.not.be.empty;
            levels.forEach((level) => {
                expect(suggestions).to.be.containing(level);
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

            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1] + 1;

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            expect(textToSpeech[0]).to.have.string("No, mi dispiace");
            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];
            expect(textToSpeech[0]).to.have.string(substraction[0]);
            expect(textToSpeech[0]).to.have.string(substraction[1]);
            expect(textToSpeech[0]).to.have.string(substractionResult);
        });
});

action.startTest('sottrazioni - 5 right answers', action => {
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

            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            const re = RegExp('.+!');
            var rightResponse = re.exec(textToSpeech[0])[0];
            assert.equal(strings.isPrompt('right', rightResponse), true);

            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            const re = RegExp('.+!');
            var rightResponse = re.exec(textToSpeech[0])[0];
            assert.equal(strings.isPrompt('right', rightResponse), true);

            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            const re = RegExp('.+!');
            var rightResponse = re.exec(textToSpeech[0])[0];
            assert.equal(strings.isPrompt('right', rightResponse), true);

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