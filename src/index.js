import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './i18n.js';
import renderPosts from './renderPosts.js';
import inputForm from './form.js';

inputForm();

const listen = () => {
  axios.get('https://allorigins.hexlet.app/get?disableCache=true&url=http://lorem-rss.herokuapp.com/feed?unit=second')
  .then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, "application/xml");
    renderPosts(doc);
  })
  .then(() => {
    //setTimeout(listen, 5000);
  })
  .catch(function (error) {
    console.log(error);
  });
};

listen();