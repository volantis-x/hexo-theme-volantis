'use strict';

// {% link title, url %}
// {% link title, url, img %}
hexo.extend.tag.register('link', function(args) {
  args = args.join(' ').split(',')
  let text = ''
  let url = ''
  let img = ''
  if (args.length > 1) {
    text = args[0].trim()
    url = args[1].trim()
  } else {
    return
  }
  if (args.length > 2) {
    img = args[2].trim()
    return `<div><a class='link-card' title='${url}' href='${url}'><div class='left'><img src=${img}></div><div class='right'><p class='text'>${text}</p><p class='url'>${url}</p></div></a></div>`;
  } else {
    return `<div><a class='link-card' title='${url}' href='${url}'><div class='left'><i class='fas fa-link'></i></div><div class='right'><p class='text'>${text}</p><p class='url'>${url}</p></div></a></div>`;
  }
});
