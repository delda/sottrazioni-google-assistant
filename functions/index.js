'use strict';

const functions = require('firebase-functions');
const {dialogflow, Suggestions} = require('actions-on-google');
const {Utils} = require('./utils');
const strings = require('./strings');

const log = false;
const version = '3.2.37';

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
        questions: 5,
    };

    let welcomeText = strings.prompts('welcome')
        + ' '
        + strings.prompts('choose')
        + ': '
        + strings.allPrompts('levels').join(', ');
    conv.ask(welcomeText);
    strings.allPrompts('levels').forEach((level) => {
        conv.ask(new Suggestions(level));
    });
    conv.ask(new Suggestions(strings.prompts('enough')));
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

    const response = "OK! "
        + strings
            .prompts('how_much')
        + ' '
        + strings
            .prompts('subtraction')
            .replace('%subtrahend%', conv.utils.getCardinal(substraction.subtrahend))
            .replace('%minuend%', conv.utils.getCardinal(substraction.minuend))
        + "?";

    conv.ask(conv.utils.getSpeakMarkup(response));
    conv.data.suggestions.forEach((suggestion) => {
        conv.ask(new Suggestions(suggestion.toString()));
    });
    conv.ask(new Suggestions(strings.prompts('enough')));
});

app.intent('Response Answer', conv => {
    log && console.log('[responseAnswer]');

    const guessedNumber = parseInt(conv.parameters.guessedNumber);
    const correctAnswer = conv.data.subtrahend - conv.data.minuend;
    var agentResponse = '';

    if (guessedNumber === correctAnswer) {
        agentResponse += conv.utils.getSound('tada.mp3')
            + strings.prompts('right')
            + ' ';
        conv.data.totalGuesses++;
        conv.data.correctGuesses++;
        conv.data.firstAttempt = true;
    } else {
        if (conv.data.firstAttempt) {
            agentResponse += conv.utils.getSound('retry.mp3')
                + strings.prompts('wrong')
                + ' '
                + strings
                    .prompts('how_much')
                + ' '
                + strings
                    .prompts('subtraction')
                    .replace('%subtrahend%', conv.utils.getCardinal(conv.data.subtrahend))
                    .replace('%minuend%', conv.utils.getCardinal(conv.data.minuend))
                + '?';

            conv.data.firstAttempt = false;
            conv.data.suggestions.forEach((suggestion) => {
                conv.ask(new Suggestions(suggestion.toString()));
            });
            conv.ask(new Suggestions(strings.prompts('enough')));
        } else {
            agentResponse += conv.utils.getSound('error.mp3')
                + strings.prompts('failed')
                + ': '
                + strings
                    .prompts('subtraction')
                    .replace('%subtrahend%', conv.utils.getCardinal(conv.data.subtrahend))
                    .replace('%minuend%', conv.utils.getCardinal(conv.data.minuend))
                + strings.prompts('equals')
                + conv.utils.getBreak('100ms')
                + correctAnswer + '. ';
            conv.data.firstAttempt = true;
            conv.data.totalGuesses++;
        }
    }

    if (conv.data.firstAttempt) {
        if (conv.data.totalGuesses % conv.data.questions === 0) {
            agentResponse += strings
                .prompts('summarize')
                .replace('%correctGuesses%', strings.prompts('correctGuesses', conv.data.correctGuesses))
                .replace('%totalGuesses%', strings.prompts('totalGuesses', conv.data.totalGuesses))
                + ' '
                + strings.prompts('again');
            conv.ask(new Suggestions('Sì'));
            conv.ask(new Suggestions('No'));
        } else {
            const substraction = conv.utils.pickNumbers(conv.data.level);
            conv.data.subtrahend = substraction.subtrahend;
            conv.data.minuend = substraction.minuend;
            agentResponse += strings.prompts('how_much')
                + ' '
                + strings
                    .prompts('subtraction')
                    .replace('%subtrahend%', conv.utils.getCardinal(substraction.subtrahend))
                    .replace('%minuend%', conv.utils.getCardinal(substraction.minuend))
                + '?';

            conv.data.suggestions = conv.utils.getRandomSuggestions(substraction);
            conv.data.suggestions.forEach((suggestion) => {
                conv.ask(new Suggestions(suggestion.toString()));
            });
            conv.ask(new Suggestions(strings.prompts('enough')));
        }
    }

    conv.ask(conv.utils.getSpeakMarkup(agentResponse));
});

app.intent('Misundestand', conv => {
    log && console.log('[misunderstand]');

    if (conv.data.initialized === false) {
        conv.ask(strings.prompts('misunderstand'));
    } else if (conv.data.misunderstand) {
        conv.close(conv.utils.endOfConversation(conv));
    } else {
        conv.data.misunderstand = true;
        conv.ask(strings.prompts('misunderstand'));
    }
});

app.intent('Quit question', conv => {
    log && console.log('[quitQuestion]');

    const confirmation = conv.parameters.confirmation;
    switch (confirmation) {
        case 'si': {
            const substraction = conv.utils.pickNumbers(conv.data.level);
            conv.data.subtrahend = substraction.subtrahend;
            conv.data.minuend = substraction.minuend;
            conv.ask(conv.utils.getSpeakMarkup(conv.utils.howMuch(conv)));
            conv.data.suggestions = conv.utils.getRandomSuggestions(substraction);
            conv.data.suggestions.forEach((suggestion) => {
                conv.ask(new Suggestions(suggestion.toString()));
            });
            break;
        }
        case 'no':
            conv.close(conv.utils.endOfConversation(conv));
            break;
        default:
            conv.ask(strings.prompts('misunderstand'));
            break;
    }
});

app.intent('End of game', conv => {
    log && console.log('[endOfGame]');

    var agentResponse = conv.utils.endOfConversation(conv);
    conv.close(agentResponse);
});

exports.subtractions = functions.https.onRequest(app);