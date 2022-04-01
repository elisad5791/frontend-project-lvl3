const parseRss = (response, url, id) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, "application/xml");
  const nodes = [...doc.getElementsByTagName('channel')[0].childNodes];

  const titleNodes = nodes.filter((item) => item.nodeName === 'title');
  const title = titleNodes[0].textContent;
  const descNodes = nodes.filter((item) => item.nodeName === 'description');
  const description = descNodes[0].textContent;
  
  const data = {
    channelInfo: {
      title,
      description,
      url,
    },
    posts: [],
  };

  const itemNodes = nodes.filter((item) => item.nodeName === 'item');
  itemNodes.forEach((itemNode) => {
    const postTitle = itemNode.getElementsByTagName('title')[0].textContent;
    const postLink = itemNode.getElementsByTagName('link')[0].textContent;
    const postDescription = itemNode.getElementsByTagName('description')[0].textContent;
    const postTimemark = itemNode.getElementsByTagName('pubDate')[0].textContent;
    const post = {
      title: postTitle,
      description: postDescription,
      link: postLink,
      timemark: postTimemark,
      channel: id,
    };
    data.posts.push(post);
  });

  return data;
};

export default parseRss;