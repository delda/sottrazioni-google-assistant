'use strict';

const assert = require('assert');
const i18n = require('i18n');
const path = require('path');
const should = require('chai').should();
const string = require('../functions/strings');

i18n.configure({
    locales: ['it', 'en'],
    defaultLocale: 'it',
    directory: path.join(__dirname, "../functions/locales"),
    objectNotation: true,
});
i18n.setLocale('it');

describe('string functions', () => {
    describe('prompts()', () => {
        it("get a translation of 'credits' inside i18n('credits')", () => {
            const credit = string.prompts('credits');
            const translations = i18n.__('credits');
            const quindi = translations.find((key) => {
                return key == credit;
            });
            should.not.equal(quindi, undefined);
        });
        it("'credits' word not inside i18n('credits')", () => {
            const credit = 'credits';
            const translations = i18n.__('credits');
            const quindi = translations.find((key) => {
                return key == credit;
            });
            should.equal(quindi, undefined);
        });
        it("undefined key like 'spaghetti'", () => {
            const translations = i18n.__('spaghetti');
            should.equal(translations, 'spaghetti');
        });
    });
});