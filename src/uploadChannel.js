import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import { renderPosts, renderFeed } from './renders.js';
import parseRss from './parseRss.js';

const uploadChannel = (channelUrl, i18n, isFirstUpload) => {
  const data = {
    channels: [],
    posts: [],
  };
  const watchedData = onChange(data, (path) => {
    if (path === 'posts') {
      renderPosts(watchedData.posts, i18n);
    }
    if (path === 'channels') {
      renderFeed(_.last(watchedData.channels));
    }
  });

  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${channelUrl}`;
  axios.get(url)
  .then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, "application/xml");

    const channelId = isFirstUpload ?
                      data.channels.length : 
                      _.findIndex(data.channels, (item) => item.url === channelUrl);

    const { channelInfo, posts } = parseRss(doc, channelUrl, channelId);

    if (isFirstUpload) {
      watchedData.channels.push(channelInfo);
    }
    
    posts.forEach((post) => {
      const index = _.findIndex(watchedData.posts, (oldPost) => 
        post.channel === oldPost.channel && post.timemark === oldPost.timemark);
      if (index === -1) {
        watchedData.posts.push(post);
      }
    });
  });
};

export default uploadChannel;