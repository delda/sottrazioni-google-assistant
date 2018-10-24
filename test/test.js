'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const assert = require('chai').assert;
const testCredentials = require("../test-credentials.json");
const strings = require('../functions/strings');
const { levels } = require('../functions/utils');


const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - welcome', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle sottrazioni')
        .then(({ textToSpeech }) => {
            const splitText = textToSpeech[0].split('!');
            const greeting = splitText[0] + '!';
            const choise = splitText[1];
            assert.equal(strings.isPrompt('welcome', greeting), true, 'welcome message \'' + greeting + '\' does not exist');
            levels.forEach((level) => {
                expect(choise).to.have.string(level);
            });
        })
});
