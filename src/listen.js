import axios from 'axios';
import renderPosts from './renderPosts.js';

const listen = () => {
  axios.get('https://allorigins.hexlet.app/get?disableCache=true&url=http://lorem-rss.herokuapp.com/feed?unit=second')
  .then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, "application/xml");
    renderPosts(doc);
  })
  .then(() => {
    setTimeout(listen, 5000);
  })
  .catch(function (error) {
    console.log(error);
  });
};

export default listen;