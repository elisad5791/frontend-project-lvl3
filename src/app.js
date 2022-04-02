import * as yup from 'yup';
import onChange from 'on-change';
import uploadChannel from './uploadChannel.js';
import { renderForm, renderFeeds, renderPosts } from './renders.js';

const listenChannels = (watchedState) => {
  const period = 5000;
  const channelsCount = watchedState.channels.length;
  for (let i = 0; i < channelsCount; i += 1) {
    uploadChannel(i, watchedState);
  }
  setTimeout(listenChannels.bind(null, watchedState), period);
};

const runApp = (i18n) => {
  const form = document.getElementById('form-rss');
  const input = document.getElementById('url');

  const state = {
    addChannel: false,
    valid: true,
    channels: [],
    posts: [],
    lastChannelUrl: '',
    error: '',
  };
  const watchedState = onChange(state, (path) => {
    if (path === 'lastChannelUrl') {
      renderForm(input, watchedState, i18n);
      uploadChannel(watchedState.channels.length, watchedState);
    } else if (path === 'error') {
      renderForm(input, watchedState, i18n);
    } else if (path === 'channels') {
      watchedState.addChannel = false;
      renderFeeds(watchedState);
    } else if (path.startsWith('posts')) {
      renderPosts(watchedState, i18n);
    }
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
    const val = input.value;
    const schema = yup.string().required().url().notOneOf(watchedState.channels);
    schema
      .validate(val)
      .then((value) => {
        watchedState.valid = true;
        watchedState.error = '';
        watchedState.addChannel = true;
        watchedState.lastChannelUrl = value;
      })
      .catch((err) => {
        watchedState.valid = false;
        const { errors } = err;
        [watchedState.error] = errors;
      });
  });

  listenChannels(watchedState);
};

export default runApp;
