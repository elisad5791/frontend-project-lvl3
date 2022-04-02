import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import runApp from './app.js';
import translation from './locales/ru/ru.js';

const i18nextInstance = i18next.createInstance();
i18nextInstance
  .init({
    lng: 'ru',
    resources: {
      ru: {
        translation,
      },
    },
  })
  .then(() => {
    runApp(i18nextInstance);
  });
