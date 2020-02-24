import { addLocaleData } from 'react-intl';
import { updateIntl as superUpdateIntl } from 'react-intl-redux';
import { IntlProvider, intlReducer } from 'react-intl-redux';

import localeData from 'scratch-l10n';
import paintMsgs from 'scratch-l10n/locales/paint-msgs';

Object.keys(localeData).forEach(locale => {
    // TODO: will need to handle locales not in the default intl - see www/custom-locales
    addLocaleData(localeData[locale].localeData);
});

const intlInitialState = {
    intl: {
        defaultLocale: 'en',
        locale: 'en',
        messages: paintMsgs.messages.en.messages
    }
};

const updateIntl = locale => superUpdateIntl({
    locale: locale,
    messages: paintMsgs.messages[locale].messages || intlInitialState.intl.messages
});

export {
    intlReducer as default,
    IntlProvider,
    intlInitialState,
    updateIntl
};
