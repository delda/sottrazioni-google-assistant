'use strict';

const i18n = require('i18n');
const path = require('path');
const {Utils} = require('./utils');

i18n.configure({
    locales: ['it', 'en'],
    defaultLocale: 'it',
    directory: path.join(__dirname, "/locales"),
    objectNotation: true,
});

const setLocale = (locale) => {
    i18n.setLocale(locale.substr(0, 2));
};

const prompts = (key) => {
    console.log('[prompts]');
    const translated = i18n.__(key);
    const values = Object.keys(translated).map((key) => {
        return translated[key];
    });
    const index = Utils.getRandomNumber(0, values.length - 1);

    return getRandomValue(translated, index);
};

const getRandomValue = (obj, idx) => {
    console.log('[getRandomValue]');
    var counter = 0;
    for (var key in obj) {
        counter++;
        if (counter === idx) {
            return obj[key];
        }
    }

    return undefined;
};

module.exports = {
    setLocale,
    prompts
};