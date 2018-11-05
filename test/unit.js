'use strict';

const assert = require('assert');
const i18n = require('i18n');
const path = require('path');
const should = require('chai').should();
const expect = require('chai').expect;
const string = require('../functions/strings');
const { Utils } = require('../functions/utils');

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

    describe('isPrompt()', () => {
        const key = 'welcome';
        const translationTrue = 'Benvenuto!';
        const translationFalse = 'ABCDE';
        it("'"+translationTrue+"' is into i18n('"+key+"')", () => {
            should.equal(string.isPrompt(key, translationTrue), true);
        });
        it("'"+translationFalse+"' is into i18n('"+key+"')", () => {
            should.equal(string.isPrompt(key, translationFalse), false);
        });
    });

    describe('matchAll()', () => {
        it("match the two numbers to subtrac", () => {
            const question = 'Quanto fa 10 meno 3?';
            should.equal(string.matchAll(/\d+/, question).length, 2);
        });
        it("does not match two numbers because non existent", () => {
            const question = 'Quanto fa dicei meno tre?';
            should.equal(string.matchAll(/\d+/, question).length, 0);
        });
    });
});

describe('utils functions', () => {
    const utils = new Utils();
    describe('Utils.pickNumbers()', () => {
        var substraction, result, maxValue;
        it("check 'base'", () => {
            maxValue = 10;
            substraction = utils.pickNumbers('base');
            result = substraction.subtrahend - substraction.minuend;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'elementare'", () => {
            maxValue = 100;
            substraction = utils.pickNumbers('base');
            result = substraction.subtrahend - substraction.minuend;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'medio'", () => {
            maxValue = 1000;
            substraction = utils.pickNumbers('base');
            result = substraction.subtrahend - substraction.minuend;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'superiore'", () => {
            maxValue = 10000;
            substraction = utils.pickNumbers('base');
            result = substraction.subtrahend - substraction.minuend;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
    });

    describe('Utils.getRandomNumber()', () => {
        it('get a random between 0 and 10', () => {
            var result = utils.getRandomNumber(0, 10);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(10);
        });
    });
});