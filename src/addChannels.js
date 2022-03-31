import * as yup from 'yup';
import onChange from 'on-change';

const render = (input, watchedState, i18n) => {
  const feedback = document.getElementById('feedback');
  if (watchedState.valid) {
    input.value = '';
    input.classList.remove('is-invalid');
    input.focus();
    feedback.className = 'text-success';
    feedback.textContent = i18n.t('success');
  } else {
    input.classList.add('is-invalid');
    feedback.className = 'text-danger';
    feedback.textContent = i18n.t(watchedState.error);
  }
};

const addChannels = (i18n) => {
  const form = document.getElementById('form-rss');
  const input = document.getElementById('url');
  
  const state = {
    valid: true,
    channels: [],
    error: '',
  };
  const watchedState = onChange(state, () => {
    render(input, watchedState, i18n);
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
};

export default addChannels;