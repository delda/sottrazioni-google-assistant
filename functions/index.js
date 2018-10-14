'use strict';

const functions = require('firebase-functions');
const {Suggestion, Card} = require('dialogflow-fulfillment');
const {dialogflow} = require('actions-on-google');
const {Utils} = require('./utils');
const strings = require('./strings');

const levels = ['base', 'elementare', 'medio', 'superiore'];
const version = '2.5.3';

process.env.DEBUG = 'dialogflow:debug';

const app = dialogflow();
console.log('version: ' + version);

app.middleware((conv) => {
    console.log('[middleware]');

    strings.setLocale(conv.user.locale);
    conv.utils = new Utils();
});

app.intent('Welcome and Level Choice', conv => {
    console.log('[welcome]');

    conv.data = {
        level: null,
        correctGuesses: 0,
        totalGuesses: 0,
        firstAddend: null,
        secondAddend: null,
        firstAttempt: true,
        misundestand: false,
        initialized: false,
    };

    let welcomeText = strings.welcome;
    welcomeText += 'Seleziona il livello desiderato tra: ';
    levels.forEach((level) => {
        welcomeText += level + ', ';
    });

    conv.ask(welcomeText);
});

app.intent('Difficulty Level', conv => {
    console.log('[difficultyLevel]');

    const level = conv.parameters.difficultyLevel;
    const addends = conv.utils.pickNumbers(level);

    conv.data.firstAddend = addends[0];
    conv.data.secondAddend = addends[1];
    conv.data.level = level;
    conv.data.inizialized = false;

    conv.ask("OK! Quanto fa " + addends[0] + " più " + addends[1] + "?");
});

app.intent('Response Answer', conv => {
    console.log('[responseAnswer]');

    const guessedNumber = parseInt(conv.parameters.guessedNumber);
    const correctAnswer = conv.data.firstAddend + conv.data.secondAddend;
    var agentResponse = '';

    if (guessedNumber === correctAnswer) {
        agentResponse = strings.prompts('right');
        conv.data.totalGuesses++;
        conv.data.correctGuesses++;
        conv.data.firstAttempt = true;
    } else {
        if (conv.data.firstAttempt) {
            agentResponse = strings.prompts('wrong');
            agentResponse += ' Quanto fa ' + conv.data.firstAddend + ' più ' + conv.data.secondAddend + '?';
            conv.data.firstAttempt = false;
        } else {
            agentResponse += ' No, mi dispiace: ' + conv.data.firstAddend + ' più ' + conv.data.secondAddend + ' fa ' + correctAnswer + '.';
            conv.data.firstAttempt = true;
            conv.data.totalGuesses++;
        }
    }

    if (conv.data.firstAttempt) {
        const addends = conv.utils.pickNumbers(conv.data.level);
        conv.data.firstAddend = addends[0];
        conv.data.secondAddend = addends[1];
        agentResponse += ' Quanto fa ' + addends[0] + ' più ' + addends[1] + '?';
    }

    conv.ask(agentResponse);
});

app.intent('Misundestand', conv => {
    console.log('[misunderstand]');

    if (conv.data.initialized === false) {
        conv.ask(strings.prompts('misunderstand'));
    } else if (data.misunderstand) {
        conv.close(endOfConversation(conv));
    } else {
        data.misunderstand = true;
        conv.ask(string.prompts('misunderstand'));
    }
});

app.intent('End of game', conv => {
    console.log('[endOfGame]');
    var agentResponse = endOfConversation(conv);

    conv.close(agentResponse);
});

const endOfConversation = (conv) => {
    let agentResponse = '';
    let correctGuesses = conv.data.correctGuesses;
    let totalGuesses = conv.data.totalGuesses;
    let pluralQuestion = 'domande';

    if (correctGuesses === 1) {
        pluralQuestion = 'domanda';
        correctGuesses = 'una';
    }
    if (totalGuesses === 1) {
        totalGuesses = 'una';
    }
    agentResponse += ' Hai risposto correttamente a ' + correctGuesses + ' ' + pluralQuestion + ' su ' + totalGuesses + '. ';
    agentResponse += strings.prompts('credits');

    return agentResponse;
};

exports.test = functions.https.onRequest(app);