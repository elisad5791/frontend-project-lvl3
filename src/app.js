import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import uploadChannel from './uploadChannel.js';
import { renderForm } from './renders.js';

const listenChannels = (state, i18n) => {
  const period = 5000;
  state.channels.forEach((channel) => {
    uploadChannel(channel, i18n, false);
  });
  setTimeout(listenChannels.bind(null, state, i18n), period);
};

const runApp = (i18n) => {
  const form = document.getElementById('form-rss');
  const input = document.getElementById('url');
  
  const state = {
    valid: true,
    channels: [],
    error: '',
  };
  const watchedState = onChange(state, (path, value) => {
    renderForm(input, watchedState, i18n);
    if (path === 'channels') {
      const channel = _.last(value);
      uploadChannel(channel, i18n, true);
    }
  });
  
  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf'
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
      .then((val) => { 
        watchedState.channels.push(val);
        watchedState.valid = true; 
      })
      .catch((err) => { 
        watchedState.error = err.errors[0];
        watchedState.valid = false; 
      });
  });

  listenChannels(watchedState, i18n);
};

export default runApp;