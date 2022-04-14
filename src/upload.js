import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const addNewPosts = (posts, watchedState, channelId) => {
  posts.forEach((post) => {
    const index = _.findIndex(
      watchedState.posts,
      (oldPost) => channelId === oldPost.channelId && post.timemark === oldPost.timemark,
    );
    if (index === -1) {
      post.channelId = channelId;
      post.id = watchedState.posts.length;
      watchedState.posts.push(post);
    }
  });
};

const uploadChannelFirst = (url, watchedState) => {
  watchedState.status = 'start';
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true';
  const proxiedUrl = `${proxy}&url=${url}`;
  axios.get(proxiedUrl)
    .then((response) => {
      const { channelInfo, posts } = parseRss(response);
      channelInfo.url = url;
      channelInfo.id = watchedState.channels.length;
      watchedState.channels.push(channelInfo);
      addNewPosts(posts, watchedState, channelInfo.id);
      watchedState.status = 'success';
    })
    .catch((err) => {
      watchedState.error = err.message === 'Network Error' ? 'network' : 'parsing';
      watchedState.status = 'failure';
    });
};

const listenChannels = (watchedState) => {
  const period = 5000;
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true';
  const promises = watchedState.channels
    .map((channel) => {
      const proxiedUrl = `${proxy}&url=${channel.url}`;
      return axios.get(proxiedUrl);
    });
  Promise.allSettled(promises)
    .then((responses) => {
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          const { posts } = parseRss(response.value);
          const channelId = watchedState.channels[index].id;
          addNewPosts(posts, watchedState, channelId);
        }
      });
    })
    .finally(() => {
      setTimeout(() => listenChannels(watchedState), period);
    });
};

export { uploadChannelFirst, listenChannels };
