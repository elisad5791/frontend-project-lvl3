import i18next from 'i18next';
import translationRU from './locales/ru/translationRU.json';

const resources = {
  ru: {
    translation: translationRU
  }
};
i18next
  .init({
    resources,
    lng: 'ru',
  });

document.getElementById('main-heading').innerHTML = i18next.t('main-heading');
document.getElementById('sub-heading').innerHTML = i18next.t('sub-heading');
document.getElementById('heading-posts').innerHTML = i18next.t('heading-posts');
document.getElementById('heading-feeds').innerHTML = i18next.t('heading-feeds');
document.getElementById('example').innerHTML = i18next.t('example');
document.getElementById('button-add').innerHTML = i18next.t('button-add');
document.getElementById('url').placeholder = i18next.t('input-placeholder');