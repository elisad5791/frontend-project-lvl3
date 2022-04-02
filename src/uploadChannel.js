import axios from 'axios';
import _ from 'lodash';
import parseRss from './parseRss.js';

const uploadChannel = (channelInd, watchedState) => {
  const channelUrl = watchedState.addChannel
    ? watchedState.lastChannelUrl
    : watchedState.channels[channelInd].url;
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${channelUrl}`;
  axios.get(url)
    .then((response) => {
      const { channelInfo, posts } = parseRss(response, channelUrl, channelInd);

      if (watchedState.addChannel) {
        watchedState.channels.push(channelInfo);
      }

      posts.forEach((post) => {
        const index = _.findIndex(
          watchedState.posts,
          (oldPost) => post.channel === oldPost.channel && post.timemark === oldPost.timemark,
        );
        if (index === -1) {
          watchedState.posts.push(post);
        }
      });
    });
};

export default uploadChannel;
