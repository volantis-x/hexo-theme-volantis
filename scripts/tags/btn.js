'use strict';

function postBtn(args) {
  args = args.join(' ').split(',');
  let cls = '';
  let text = '';
  let url = '';
  let icon = '';
  if (args.length > 3) {
    cls = args[0];
    text = args[1];
    url = args[2];
    icon = args[3];
  } else if (args.length > 2) {
    if (args[2].indexOf(' fa-') > -1) {
      // text, url, icon
      text = args[0];
      url = args[1];
      icon = args[2];
    } else {
      cls = args[0];
      text = args[1];
      url = args[2];
    }
  } else if (args.length > 1) {
    text = args[0];
    url = args[1];
  } else if (args.length > 0) {
    text = args[0];
  }

  cls = cls.trim();
  icon = icon.trim();
  text = text.trim();
  url = url.trim();
  if (url.length > 0) {
    url = 'href=\'' + url + '\'';
  }
  if (cls.length > 0) {
    cls = ' ' + cls;
  }
  if (icon.length > 0) {
    return `<span class='btn${cls}'><a class="button" ${url} title='${text}'><i class='${icon}'></i>${text}</a></span>`;
  }
  return `<span class='btn${cls}'><a class="button" ${url} title='${text}'>${text}</a></span>`;

}

hexo.extend.tag.register('btn', postBtn);
