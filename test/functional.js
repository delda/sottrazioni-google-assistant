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
            expect(suggestions).to.have.lengthOf(levels.length + 1);
            expect(suggestions).to.not.be.empty;
            levels.forEach((level) => {
                expect(suggestions).to.be.containing(level);
            });
            expect(suggestions).to.be.containing('basta');
            return action.send('base');
        })
        .then(({ textToSpeech }) => {
            expect(textToSpeech[0]).to.have.string('OK!');
        });
});

action.startTest('sottrazioni - right answer + end of game', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech }) => {
            const level = levels[utils.getRandomNumber(0, levels.length - 1)];
            return action.send(level);
        })
        .then(({ textToSpeech, suggestions }) => {
            const substraction = strings.matchAll(/\d+/, textToSpeech);
            const substractionResult = substraction[0] - substraction[1];

            expect(suggestions).to.not.be.empty;
            expect(suggestions).to.be.an('array');
            expect(suggestions).to.have.lengthOf(4);
            expect(suggestions).to.be.containing(substractionResult.toString());
            expect(suggestions).to.be.containing('basta');

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            expect(textToSpeech).to.be.an('array');
            expect(textToSpeech).to.not.be.empty;

            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);

            const audio = RegExp('<audio src="(.*?)"\/>');
            var getAudio = audio.exec(textToSpeech[0]);
            expect(getAudio).to.be.an('array');
            expect(getAudio).to.not.be.empty;
            expect(getAudio[0]).to.be.containing('tada.mp3');

            // return action.send('basta');
            // })
            // .then(({ textToSpeech }) => {
            //     expect(textToSpeech[0]).to.have.string('una');
            //     expect(textToSpeech[0]).to.not.have.string('%');
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
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('wrong', rightResponse), true);

            const audio = RegExp('<audio src="(.*?)"\/>');
            var getAudio = audio.exec(textToSpeech[0]);
            expect(getAudio).to.be.an('array');
            expect(getAudio).to.not.be.empty;
            expect(getAudio[0]).to.be.containing('retry.mp3');

            rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1] + 1;

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            expect(rightResponse).to.have.string("No, mi dispiace");

            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];
            expect(rightResponse).to.have.string(substraction[0]);
            expect(rightResponse).to.have.string(substraction[1]);
            expect(rightResponse).to.have.string(substractionResult);
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
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);

            rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);

            rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);

            rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);

            rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '');
            const substraction = strings.matchAll(/\d+/, rightResponse);
            const substractionResult = substraction[0] - substraction[1];

            return action.send(substractionResult.toString());
        })
        .then(({ textToSpeech }) => {
            var rightResponse = textToSpeech[0]
                .replace('<speak>', '')
                .replace('</speak>', '')
                .replace(/<audio.*?\/>/, '')
                .replace(/(.*!).*/, '$1');
            assert.equal(strings.isPrompt('right', rightResponse), true);
        });
});