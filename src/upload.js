import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const addNewPosts = (posts, watchedState, channelId) => {
  posts.forEach((post) => {
    const index = _.findIndex(
      watchedState.posts,
      (oldPost) => post.channel === oldPost.channel && post.timemark === oldPost.timemark,
    );
    if (index === -1) {
      post.channel = channelId;
      post.viewed = false;
      watchedState.posts.push(post);
    }
  });
};

const uploadChannel = (channelUrl) => {
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${channelUrl}`;
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

const uploadChannelFirst = (url, watchedState) => uploadChannel(url)
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

const listenChannels = (watchedState) => {
  const period = 5000;
  const promises = watchedState.channels
    .map((channel) => uploadChannel(channel.id, channel.url, watchedState));
  Promise.all(promises)
    .then(() => {
      setTimeout(listenChannels.bind(null, watchedState), period);
    });
};

export { uploadChannelFirst, listenChannels };
