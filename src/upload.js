import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const uploadChannel = (channelId, channelUrl, watchedState) => {
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${channelUrl}`;

  const promise = new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        try {
          const { channelInfo, posts } = parseRss(channelId, channelUrl, response);
          posts.forEach((post) => {
            const index = _.findIndex(
              watchedState.posts,
              (oldPost) => post.channel === oldPost.channel && post.timemark === oldPost.timemark,
            );
            if (index === -1) {
              watchedState.posts.push(post);
            }
          });
          resolve(channelInfo);
        } catch (e) {
          reject(new Error('parsing'));
        }
      })
      .catch(() => {
        reject(new Error('network'));
      });
  });
  return promise;
};

const uploadChannelFirst = (id, url, watchedState) => uploadChannel(id, url, watchedState)
  .then((data) => {
    watchedState.channels.push(data);
    watchedState.status = 'success';
  })
  .catch((err) => {
    watchedState.error = err.message;
    watchedState.status = 'failure';
  });

export { uploadChannelFirst, uploadChannel };
