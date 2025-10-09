import cronstrue from 'cronstrue/i18n.js';
import { isValidCron } from 'cron-validator';

function humanize(value, inputLangInternal) {
    var cronstrueLang = 'en';
    if (Object.keys(cronstrue.default.locales).includes(inputLangInternal.code)) {
        cronstrueLang = inputLangInternal.code;
    }
    return cronstrue.toString(value, { locale: cronstrueLang });
}

export { humanize, isValidCron };
