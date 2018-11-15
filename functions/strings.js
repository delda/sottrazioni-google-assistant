'use strict';

const i18n = require('i18n');
const path = require('path');
const {Utils} = require('./utils');
var log = typeof log === undefined ? false : log;

i18n.configure({
    locales: ['it', 'en'],
    defaultLocale: 'it',
    directory: path.join(__dirname, "/locales"),
    objectNotation: true,
});

const setLocale = (locale) => {
    locale = locale || 'it';
    i18n.setLocale(locale.substr(0, 2));
};

const prompts = (key, quantity) => {
    log && console.log('[prompts]');

    quantity = quantity || 1;

    const translated = (quantity === 1)
        ? i18n.__(key)
        : i18n.__n(key, quantity);

    if (translated === key)
        return undefined;

    const values = Object.keys(translated).map((key) => {
        return translated[key];
    });
    let utils = new Utils();
    const index = utils.getRandomNumber(0, values.length - 1);

    return getValue(translated, index);
};

const getValue = (obj, idx) => {
    log && console.log('[getValue]');

    let counter = 0;
    for (let key in obj) {
        if (counter === idx) {
            return obj[key];
        }
        counter++;
    }

    return undefined;
};

const isPrompt = (key, value) => {
    log && console.log('[isPrompt]');

    const translated = i18n.__(key);
    return translated.indexOf(value) > -1;
};

const matchAll = (regexp, string) => {
    log && console.log('[matchAll]');

    var match, results = [];
    var re = RegExp(regexp,'g');

    do {
        match = re.exec(string);
        if (match) results.push(match[0]);
    } while (match);

    return results;
};

module.exports = {
    setLocale,
    prompts,
    isPrompt,
    matchAll
};