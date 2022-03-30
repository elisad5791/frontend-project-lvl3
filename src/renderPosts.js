const renderPosts = (doc) => {
  const result = [...doc.getElementsByTagName('channel')[0].childNodes];
  console.log(result);
    
  const titleNodes = result.filter((item) => item.nodeName === 'title');
  const title = titleNodes[0].textContent;
  const descNodes = result.filter((item) => item.nodeName === 'description');
  const description = descNodes[0].textContent;

  const titleElem = document.createElement('p');
  titleElem.classList.add('fw-bold', 'mb-0');
  titleElem.textContent = title;
  const descElem = document.createElement('p');
  descElem.textContent = description;
  const feeds = document.getElementById('feeds');
  feeds.innerHTML = '';
  feeds.append(titleElem, descElem);

  const posts = document.getElementById('posts');
  posts.innerHTML = '';
  const itemNodes = result.filter((item) => item.nodeName === 'item');
  itemNodes.forEach((itemNode) => {
    const link = document.createElement('a');
    link.textContent = itemNode.getElementsByTagName('title')[0].textContent;
    link.href = itemNode.getElementsByTagName('link')[0].textContent;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.textContent = 'Просмотр';

    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-between', 'mb-3');
    div.append(link, button);
    posts.append(div);
  });
};

export default renderPosts;