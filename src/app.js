import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import translation from './locales/ru/ru.js';
import { uploadChannel, uploadChannelFirst } from './upload.js';
import { renderForm, renderFeeds, renderPosts } from './renders.js';

const listenChannels = (watchedState) => {
  const period = 5000;
  const promises = watchedState.channels
    .map((channel) => uploadChannel(channel.id, channel.url, watchedState));
  Promise.all(promises)
    .then(() => {
      setTimeout(listenChannels.bind(null, watchedState), period);
    });
};

const app = (i18n) => {
  const form = document.getElementById('form-rss');
  const input = document.getElementById('url');
  const button = document.getElementById('add');

  const state = {
    status: 'initial',
    channels: [],
    posts: [],
    error: '',
  };
  const watchedState = onChange(state, (path) => {
    if (path === 'status') renderForm(input, button, watchedState, i18n);
    if (path === 'channels') renderFeeds(watchedState);
    if (path.startsWith('posts')) renderPosts(watchedState, i18n);
  });

  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'url',
    },
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.status = 'initial';
    const val = input.value;
    const urls = watchedState.channels.map((channel) => channel.url);
    const schema = yup.string().required().url().notOneOf(urls);
    schema
      .validate(val)
      .then((value) => {
        watchedState.status = 'start';
        uploadChannelFirst(watchedState.channels.length, value, watchedState);
      })
      .catch((err) => {
        const { errors } = err;
        [watchedState.error] = errors;
        watchedState.status = 'invalid';
      });
  });

  listenChannels(watchedState);
};

const runApp = () => {
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
      app(i18nextInstance);
    });
};

export default runApp;
