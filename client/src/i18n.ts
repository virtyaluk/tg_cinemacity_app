/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enLocale from './locales/en';
import uaLocale from './locales/ua';

const resources = {
    en: {
        translation: enLocale,
    },
    ua: {
        translation: uaLocale,
    },
};

i18n
    .use(initReactI18next)
    // .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
    });

export default i18n;
