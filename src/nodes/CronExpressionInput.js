import defaultInputLang from '../i18n/locales/en.js';

import { CronComponent } from './CronComponent.js';
import { CssTemplateGenerator } from '../templates/CssTemplate.js';
import { CronExpressionInputTemplateGenerator } from '../templates/CronExpressionInputTemplate.js';

import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue/i18n.js';

var inputLangInternal = {};
if (typeof inputLang == 'undefined') {
    inputLangInternal = defaultInputLang;
} else {
    inputLangInternal = inputLang.default;
}

export class CronExpressionInput extends CronComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.name = this.getAttribute('name') || 'cron';
        this.width = this.getAttribute('width') || '234px';
        this.height = this.getAttribute('height') || '34px';
        this.value = this.getAttribute('value') || '* * * * *';
        this.required = this.getAttribute('required') !== null;
        this.hotValidate = this.getAttribute('hot-validate') !== null;
        this.color = this.getAttribute('color') || '#d58512';
        this.colorMain = '#' + this.color.replace('#', '');
        this.colorSecond = this.increaseBrightness(this.colorMain, 30);
        this.id = this.name + '_' + Math.random().toString(16).substr(2);
        this.title = "";

        // Force attribute without hashtag for specific CSS
        this.setAttribute('id', this.id);

        var cssTemplate = CssTemplateGenerator(this);

        this.Init({
            self: this,
            css: cssTemplate,
        });

        var template = CronExpressionInputTemplateGenerator(this, inputLangInternal);

        var self = this;
        this.Create(self, template);
        this.setValue(this.value);

        var input1 = this.getElement('.cronInsideInput');
        input1.addEventListener('keydown', (e) => self.validateLongitude(e));
        input1.addEventListener('keypress', (e) => self.validateLongitude(e));
        input1.addEventListener('keyup', (e) => self.validateLongitude(e));
        this.addEvent('.cronButton', 'click', () => {
            self.querySelectorAll('form').forEach((element) => element.reset());
            if (self.getElementsByClassName('cronInsideInput').length != 0) {
                self.currentValue = self.getElementsByClassName('cronInsideInput')[0].value;
                if (self.currentValue.split(' ').length == 5) {
                    self.getCron(self.currentValue);
                }
            }
            self.modalToggle();
        });
        this.addEvent('.cronClose', 'click', () => {
            self.setValue(self.currentValue);
            self.validator(self);
            self.modalToggle();
        });
        this.addEvent('.cronSave', 'click', () => {
            self.validator(self);
            self.modalToggle();
        });
        this.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                self.setValue(self.currentValue);
                self.validator(self);
                self.modalToggle();
            } else if (e.key === 'Enter') {
                self.validator(self);
                self.modalToggle();
            }
        });
        this.addEvent('li > a', 'click', (scope) => {
            var index = 0;
            self.getElements('li > a').forEach(function (elem, i) {
                elem.parentNode.setAttribute('class', 'nav-item');
                if (elem == scope) {
                    index = i;
                }
            });
            scope.parentNode.setAttribute('class', 'nav-item active');
            var elements = self.getElements('cron-fields');
            elements.forEach((elem) => elem.parentNode.setAttribute('class', 'tab-pane fade'));
            elements[index].parentNode.setAttribute('class', 'tab-pane active');
        });
        var formParent = self.querySelector('.cronInsideInput').closest('form');
        if (formParent != null) {
            formParent.closest('form').addEventListener('submit', (e) => {
                if (!self.validator(self)) {
                    e.preventDefault();
                }
            });
        }
        if (self.hotValidate) {
            this.addEvent('.cronInsideInput', 'input', () => self.validator(self));
        }
        this.addEvent('cron-fields', 'change', (e) => {
            var value = true;
            var node = e.parentNode;
            while (value) {
                node = node.parentNode;
                if (node.nodeName == 'CRON-FIELDS') {
                    value = false;
                }
            }

            var input2 = self.getElement('.cronInsideInput');
            self.setValue(
                self.generateCron(
                    parseInt(node.getAttribute('pos')),
                    input2['value'],
                    node.value
                )
            );

            if (self.hotValidate) {
                self.validator(self);
            }
        });

        this.getElements('.propagationClass').forEach((element) =>
            element.addEventListener('input', (e) => e.stopPropagation())
        );

        self.validator(self);
    }
    validator(self) {
        var insideInput = self.querySelector('.cronInsideInput');
        var error = self.getElement('.cronExpressionError');
        var missing = self.getElement('.cronExpressionMissing');
        if (insideInput.value.length != 0 && !isValidCron(insideInput.value, { allowSevenAsSunday: true })) {
            error.classList.replace('hidden', 'show');
            missing.classList.replace('show', 'hidden');
            return false;
        } else if (insideInput.value.length == 0 && self.required) {
            error.classList.replace('show', 'hidden');
            missing.classList.replace('hidden', 'show');
            return false;
        }
        error.classList.replace('show', 'hidden');
        missing.classList.replace('show', 'hidden');
        self.setValue(insideInput['value']);
        return true;
    }
    getTypeCron(expression) {
        if (expression.includes('/') || expression.includes('*')) {
            return 1;
        } else if (expression.includes('-')) {
            return 2;
        } else {
            return 3;
        }
    }
    getTypeFrequency(expression) {
        const separator = '/';
        var freq = {
            every: '*',
            start: '*',
        };
        if (!expression.includes(separator) && expression != '*') {
            freq.every = expression;
        } else if (expression.includes('*') && expression.includes(separator)) {
            freq.start = expression.split(separator)[1];
        } else if (expression.includes(separator)) {
            var c = expression.split(separator);
            freq.every = c[0];
            freq.start = c[1];
        }
        return freq;
    }
    getTypeRange(expression) {
        const separator = '-';
        var range = {
            min: '0',
            max: '0',
        };
        if (expression.includes(separator)) {
            var c = expression.split(separator);
            range.min = c[0];
            range.max = c[1];
        }
        return range;
    }
    getTypeChoice(expression) {
        return expression.split(',');
    }
    getCron(cronExpression) {
        var forms = this.querySelectorAll('form');
        var crons = cronExpression.split(' ');
        this.setCronInTab(forms[0], crons[0], this.getTypeCron(crons[0]));
        this.setCronInTab(forms[1], crons[1], this.getTypeCron(crons[1]));
        this.setCronInTab(forms[2], crons[2], this.getTypeCron(crons[2]), 1);
        this.setCronInTab(forms[3], crons[3], this.getTypeCron(crons[3]), 1);
        this.setCronInTab(forms[4], crons[4], this.getTypeCron(crons[4]));
    }
    setCronInTab(form, value, type, decrement = 0) {
        var choices = form.querySelectorAll('input[name=choice]');
        choices.forEach((choice) => choice.removeAttribute('checked'));
        choices[type - 1].checked = true;
        switch (type) {
            case 1:
                var freq = this.getTypeFrequency(value);
                var decrementFreq = 1 - decrement;
                form.querySelector('*[match=every]').selectedIndex =
                    parseInt(freq['every']) + decrementFreq;
                form.querySelector('*[match=start]').selectedIndex =
                    parseInt(freq['start']) + decrementFreq;
                break;
            case 2:
                var range = this.getTypeRange(value);
                form.querySelector('*[match=rangeMin]').selectedIndex =
                    parseInt(range['min']) - decrement;
                form.querySelector('*[match=rangeMax]').selectedIndex =
                    parseInt(range['max']) - decrement;
                break;
            case 3:
                var cs = this.getTypeChoice(value);
                form
                    .querySelectorAll('*[match=specific] input')
                    .forEach((element, index) => {
                        if (cs.includes((index + decrement).toString())) {
                            element.checked = true;
                        }
                    });
                break;
        }
    }
    validateLongitude(e) {
        var values = e.target.value.trim().split(' ');
        if (values.length > 5) {
            e.target.value = values.slice(0, 5).join(' ');
        }
        this.sendEvent();
    }
    setValue(value) {
        var defaultArray = ['*', '*', '*', '*', '*'];
        if (value == undefined) {
            return defaultArray.join(' ');
        } else if (value.length > 0) {
            var array = value.trim().split(' ');
            for (var i = 0; i < 5; i++)
                if (array[i] != undefined) {
                    defaultArray[i] = array[i];
                }
            value = defaultArray.join(' ');
        }
        var input3 = this.getElement('.cronInsideInput');
        input3.value = value;

        var humanString = this.humanize(value);
        this.querySelector('.inputCronMsg').value = humanString;
        this.querySelector('.cronInsideInput').setAttribute("title", humanString);
        this.sendEvent();
    }
    humanize(value) {
        var cronstrueLang = 'en';
        if (Object.keys(cronstrue.default.locales).includes(inputLangInternal.code)) {
            cronstrueLang = inputLangInternal.code;
        }
        return cronstrue.toString(value, { locale: cronstrueLang });
    }
    modalToggle() {
        this.getElement('.modal').classList.toggle('show');
    }
    generateCron(pos, values, value) {
        var val = values.split(' ');
        val[pos] = value;
        return val.join(' ');
    }
    sendEvent() {
        var input4 = this.getElement('.cronInsideInput');
        var event = new CustomEvent('input', {
            detail: {
                value: input4.value,
            },
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(event);
    }
}
