import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';

const render = (input, watchedState) => {
  if (watchedState.valid) {
    input.value = '';
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
  }
};

const form = document.getElementById('form-rss');
const input = document.getElementById('url');

const state = {
  valid: true,
  data: [],
};
const watchedState = onChange(state, () => {
  console.log(watchedState);
  render(input, watchedState);
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value;
  const schema = yup.string().required().url().notOneOf(watchedState.data);
  schema
    .validate(val)
    .then((val) => { 
      watchedState.data.push(val);
      watchedState.valid = true; 
    })
    .catch((error) => { 
      watchedState.valid = false; 
    });
});