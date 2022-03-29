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
    const result = [...doc.getElementsByTagName('channel')[0].childNodes];
    
    const titleNodes = result.filter((item) => item.nodeName === 'title');
    const title = titleNodes[0].textContent;
    const descNodes = result.filter((item) => item.nodeName === 'description');
    const description = descNodes[0].textContent;

    const titleElem = document.createElement('p');
    titleElem.classList.add('fw-bold', 'mb-0');
    titleElem.textContent = title;
    const descElem = document.createElement('p');
    descElem.textContent = description;
    const feeds = document.getElementById('feeds');
    feeds.append(titleElem, descElem);

    const posts = document.getElementById('posts');
    const itemNodes = result.filter((item) => item.nodeName === 'item');
    itemNodes.forEach((itemNode) => {
      const link = document.createElement('a');
      link.textContent = itemNode.getElementsByTagName('title')[0].textContent;
      link.href = itemNode.getElementsByTagName('link')[0].textContent;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary');
      button.textContent = 'Просмотр';

      const div = document.createElement('div');
      div.classList.add('d-flex', 'justify-content-between', 'mb-3');
      div.append(link, button);
      posts.append(div);
    });
  })
  .catch(function (error) {
    console.log(error);
  });