import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

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

axios.get('https://ru.hexlet.io/lessons.rss')
  .then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "application/xml");
    console.log(doc);
    const result = [...doc.getElementsByTagName('channel')[0].childNodes];
    const output = result.filter((item) => item.nodeName === 'title');
    console.log(output[0].textContent);
  })
  .catch(function (error) {
    console.log(error);
  });