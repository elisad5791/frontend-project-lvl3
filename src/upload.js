import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const uploadChannelFirst = (channelId, channelUrl, watchedState) => {
  uploadChannel(channelId, channelUrl, watchedState)
    .then((data) => {
      watchedState.channels.push(data);
    })
    .catch((err) => {
      watchedState.error = err;
    });
};

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
          reject('parsing');
        }
      })
      .catch(() => {
        reject('network');
      }); 
  });
  return promise;
};

export { uploadChannelFirst, uploadChannel };
