import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const addNewPosts = (posts, watchedState, channelId) => {
  posts.forEach((post) => {
    const index = _.findIndex(
      watchedState.posts,
      (oldPost) => channelId === oldPost.channel && post.timemark === oldPost.timemark,
    );
    if (index === -1) {
      post.channel = channelId;
      post.viewed = false;
      watchedState.posts.push(post);
    }
  });
};

const uploadChannel = (url) => {
  const promise = new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response);
      })
      .catch(() => {
        reject(new Error('network'));
      });
  });
  return promise;
};

const uploadChannelFirst = (url, watchedState) => {
  watchedState.status = 'start';
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true';
  const proxiedUrl = `${proxy}&url=${url}`;
  uploadChannel(proxiedUrl)
    .then((response) => {
      const { channelInfo, posts } = parseRss(response);
      channelInfo.url = url;
      channelInfo.id = watchedState.channels.length;
      watchedState.channels.push(channelInfo);
      addNewPosts(posts, watchedState, channelInfo.id);
      watchedState.status = 'success';
    })
    .catch((err) => {
      watchedState.error = err.message;
      watchedState.status = 'failure';
    });
};

const listenChannels = (watchedState) => {
  const period = 5000;
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true';
  const promises = watchedState.channels
    .map((channel) => {
      const proxiedUrl = `${proxy}&url=${channel.url}`;
      return uploadChannel(proxiedUrl);
    });
  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response, index) => {
        const { posts } = parseRss(response);
        const channelId = watchedState.channels[index].id;
        addNewPosts(posts, watchedState, channelId);
      });
    })
    .finally(() => {
      setTimeout(listenChannels.bind(null, watchedState), period);
    });
};

export { uploadChannelFirst, listenChannels };
