const parseRss = (id, url, response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  
  const data = {
    channelInfo: {
      title,
      description,
      url,
      id
    },
    posts: [],
  };
  
  const items = doc.querySelectorAll('item');
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postTimemark = item.querySelector('pubDate').textContent;
    const post = {
      title: postTitle,
      description: postDescription,
      link: postLink,
      timemark: postTimemark,
      channelId: id,
      viewed: false,
    };
    data.posts.push(post);
  });

  return data;
};

export default parseRss;
