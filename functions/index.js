'use strict';

const functions = require('firebase-functions');
const {dialogflow, Suggestions} = require('actions-on-google');
const {Utils, levels} = require('./utils');
const strings = require('./strings');
const shuffle = require('shuffle-array');

const log = false;
const version = '2.7.11';

process.env.DEBUG = 'dialogflow:debug';

const app = dialogflow();
console.log('le-sottrazioni: v' + version);

app.middleware((conv) => {
    log && console.log('[middleware]');

    strings.setLocale(conv.user.locale);
    conv.utils = new Utils();
});

app.intent('Welcome and Level Choice', conv => {
    log && console.log('[welcome]');

    conv.data = {
        level: null,
        correctGuesses: 0,
        totalGuesses: 0,
        subtrahend: null,
        minuend: null,
        firstAttempt: true,
        misundestand: false,
        initialized: false,
        suggestions: [],
    };

    let welcomeText = strings.prompts('welcome');
    welcomeText += ' Seleziona il livello desiderato tra: ';
    levels.forEach((level) => {
        welcomeText += level + ', ';
        conv.ask(new Suggestions(level));
    });

    conv.ask(welcomeText);
});

app.intent('Difficulty Level', conv => {
    log && console.log('[difficultyLevel]');

    const level = conv.parameters.difficultyLevel;
    const substraction = conv.utils.pickNumbers(level);

    conv.data.subtrahend = substraction.subtrahend;
    conv.data.minuend = substraction.minuend;
    conv.data.level = level;
    conv.data.inizialized = false;
    conv.data.suggestions = conv.utils.getRandomSuggestions(substraction);

    conv.ask("OK! Quanto fa " + substraction.subtrahend + " meno " + substraction.minuend + "?");
    conv.data.suggestions.forEach((suggestion) => {
        conv.ask(new Suggestions(suggestion.toString()));
    });
    conv.ask(new Suggestions('basta'));
});

app.intent('Response Answer', conv => {
    log && console.log('[responseAnswer]');

    const guessedNumber = parseInt(conv.parameters.guessedNumber);
    const correctAnswer = conv.data.subtrahend - conv.data.minuend;
    var agentResponse = '';

    if (guessedNumber === correctAnswer) {
        agentResponse = strings.prompts('right');
        conv.data.totalGuesses++;
        conv.data.correctGuesses++;
        conv.data.firstAttempt = true;
    } else {
        if (conv.data.firstAttempt) {
            agentResponse = strings.prompts('wrong');
            agentResponse += ' Quanto fa ' + conv.data.subtrahend + ' meno ' + conv.data.minuend + '?';
            conv.data.firstAttempt = false;
            conv.data.suggestions.forEach((suggestion) => {
                conv.ask(new Suggestions(suggestion.toString()));
            });
            conv.ask(new Suggestions('basta'));
        } else {
            agentResponse += ' No, mi dispiace: ' + conv.data.subtrahend + ' meno ' + conv.data.minuend + ' fa ' + correctAnswer + '.';
            conv.data.firstAttempt = true;
            conv.data.totalGuesses++;
        }
    }

    if (conv.data.firstAttempt) {
        const substraction = conv.utils.pickNumbers(conv.data.level);
        conv.data.subtrahend = substraction.subtrahend;
        conv.data.minuend = substraction.minuend;
        agentResponse += ' Quanto fa ' + substraction.subtrahend + ' meno ' + substraction.minuend + '?';

        conv.data.suggestions = conv.utils.getRandomSuggestions(substraction);
        conv.data.suggestions.forEach((suggestion) => {
            conv.ask(new Suggestions(suggestion.toString()));
        });
        conv.ask(new Suggestions('basta'));
    }

    conv.ask(agentResponse);
});

app.intent('Misundestand', conv => {
    log && console.log('[misunderstand]');

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
    log && console.log('[endOfGame]');

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

exports.subtractions = functions.https.onRequest(app);