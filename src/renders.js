import _ from 'lodash';

const renderForm = (input, watchedState, i18n) => {
  const feedback = document.getElementById('feedback');
  if (watchedState.valid) {
    input.value = '';
    input.classList.remove('is-invalid');
    input.focus();

    feedback.className = 'text-success';
    feedback.textContent = i18n.t('success');
  } else {
    input.classList.add('is-invalid');

    feedback.className = 'text-danger';
    feedback.textContent = i18n.t(watchedState.error);
  }
};

const renderFeeds = (watchedState) => {
  const content = document.getElementById('content');
  content.classList.remove('d-none');
  const feeds = document.getElementById('feeds');
  feeds.innerHTML = '';

  watchedState.channels.forEach((channel) => {
    const titleElem = document.createElement('p');
    titleElem.classList.add('fw-bold', 'mb-0');
    titleElem.textContent = channel.title;
  
    const descElem = document.createElement('p');
    descElem.textContent = channel.description;

    feeds.append(titleElem, descElem);
  });
  
};

const renderPosts = (watchedState, i18n) => {
  const sortedPosts = _.reverse(_.sortBy(watchedState.posts, (o) => Date.parse(o.timemark)));
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  sortedPosts.forEach((post) => {
    const link = document.createElement('a');
    if (post.viewed) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }
    link.textContent = post.title;
    link.href = post.link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('show');

    button.addEventListener('click', () => {
      const titleElem = document.getElementById('modal-title');
      const bodyElem = document.getElementById('modal-body');
      const linkElem = document.getElementById('modal-link');
      titleElem.textContent = post.title;
      bodyElem.textContent = post.description;
      linkElem.href = post.link;
      post.viewed = true;
    });

    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-3');
    div.append(link, button);
    postsContainer.append(div);
  });
};

export { renderForm, renderFeeds, renderPosts };