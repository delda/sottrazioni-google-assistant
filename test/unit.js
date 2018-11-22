'use strict';

const assert = require('assert');
const i18n = require('i18n');
const path = require('path');
const should = require('chai').should();
const expect = require('chai').expect;
const strings = require('../functions/strings');
const { Utils, Substraction } = require('../functions/utils');

i18n.configure({
    locales: ['it', 'en'],
    defaultLocale: 'it',
    directory: path.join(__dirname, "../functions/locales"),
    objectNotation: true,
});
i18n.setLocale('it');

describe('i18n', () => {
    ['it', 'en'].forEach(function (locale) {
        describe("locale '" + locale + "'", () => {
            ['welcome', 'right', 'wrong', 'misunderstand', 'credits', 'summarize'].forEach(function(key) {
                it("'" + key + "' key translations", () => {
                    const translations = i18n.__(key);
                    expect(translations).to.be.an('array');
                    expect(translations).to.not.be.empty;
                    expect(translations).to.have.lengthOf.above(0);
                });
            });
        });
    });
});

describe('string functions', () => {
    describe('prompts()', () => {
        it("get a translation of 'credits' inside i18n('credits')", () => {
            const credit = strings.prompts('credits');
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
            should.equal(strings.isPrompt(key, translationTrue), true);
        });
        it("'"+translationFalse+"' is not into i18n('"+key+"')", () => {
            should.equal(strings.isPrompt(key, translationFalse), false);
        });
    });

    describe('matchAll()', () => {
        it("match the two numbers to subtrac", () => {
            const question = 'Quanto fa 10 meno 3?';
            should.equal(strings.matchAll(/\d+/, question).length, 2);
        });
        it("does not match two numbers because non existent", () => {
            const question = 'Quanto fa dicei meno tre?';
            should.equal(strings.matchAll(/\d+/, question).length, 0);
        });
    });
});

describe('utils functions', () => {
    describe('Utils.endOfConversation()', () => {
        const utils = new Utils();
        it('single right response', () => {
            const conv = {
                data: {
                    correctGuesses: 1,
                    totalGuesses: 1
                }
            };
            const result = utils.endOfConversation(conv);
            expect(result).to.not.have.string('%');
            expect(result).to.have.string('domanda');
            expect(result).to.have.string('su una');
        });
        it('multiple right responses', () => {
            const conv = {
                data: {
                    correctGuesses: 5,
                    totalGuesses: 5
                }
            };
            const result = utils.endOfConversation(conv);
            expect(result).to.not.have.string('%');
            expect(result).to.have.string('domande');
            expect(result).to.have.string('su 5');
        });
    });

    describe('Utils.pickNumbers()', () => {
        var substraction, result, maxValue;
        const utils = new Utils();
        it("check 'base'", () => {
            maxValue = 10;
            substraction = utils.pickNumbers('base');
            result = substraction.result;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'elementare'", () => {
            maxValue = 100;
            substraction = utils.pickNumbers('base');
            result = substraction.result;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'medio'", () => {
            maxValue = 1000;
            substraction = utils.pickNumbers('base');
            result = substraction.result;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
        it("check 'superiore'", () => {
            maxValue = 10000;
            substraction = utils.pickNumbers('base');
            result = substraction.result;
            expect(substraction.subtrahend).to.be.at.most(maxValue);
            expect(substraction.subtrahend).to.be.at.least(substraction.minuend);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(maxValue);
        });
    });

    describe('Utils.getRandomNumber()', () => {
        const utils = new Utils();
        it('get a random between 0 and 10', () => {
            var result = utils.getRandomNumber(0, 10);
            expect(result).to.be.at.least(0);
            expect(result).to.be.at.most(10);
        });
    });

    describe('Utils.getRandomSuggestions()', () => {
        const utils = new Utils();
        it('get three distinct numbers', () => {
            var substraction = Substraction;
            substraction.subtrahend = 10;
            substraction.minuend = 5;
            substraction.result = substraction.subtrahend - substraction.minuend;
            var result = utils.getRandomSuggestions(substraction);
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(3);
            expect(result).to.include.members([substraction.result]);
        });
        it('special case: subtrahend and minuend are zero', () => {
            var substraction = Substraction;
            substraction.subtrahend = 0;
            substraction.minuend = 0;
            substraction.result = substraction.subtrahend - substraction.minuend;
            var result = utils.getRandomSuggestions(substraction);
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(3);
            expect(result).to.include.members([substraction.result]);
        });
    });

    describe('Utils.getCardinal()', () => {
        const utils = new Utils();
        it('get SSML cardinal number from integer', () => {
            var number = utils.getCardinal(1234);
            expect(number).to.be.an('string');
            expect(number).to.have.string('<say-as interpret-as="cardinal">');
            expect(number).to.have.string('1234');
            expect(number).to.have.string('</say-as>');
        });
        it('get SSML cardinal number from string', () => {
            var number = utils.getCardinal('1234');
            expect(number).to.be.an('string');
            expect(number).to.have.string('<say-as interpret-as="cardinal">');
            expect(number).to.have.string('1234');
            expect(number).to.have.string('</say-as>');
        });
    });

    describe('Utils.getSpeakMarkup()', () => {
        const utils = new Utils();
        it('add speak tag', () => {
            const baseString = '1234';
            const result = utils.getSpeakMarkup(baseString);
            expect(result).to.have.string('<speak>');
            expect(result).to.have.string('</speak>');
        });
    });

    describe('Utils.getBreak()', () => {
        const utils = new Utils();
        it('get lenght of pause of "1s"', () => {
            const pause = utils.getBreak('1s');
            expect(pause).to.have.string('<break time="1s"/>');
        });
    });
});