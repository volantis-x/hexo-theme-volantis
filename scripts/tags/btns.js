'use strict';

function postBtns(args, content) {
  return `<div class="btns ${args.join(' ')}">
            ${content}
          </div>`;
}

function postCell(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  let text = args[0] || '';
  let url = args[1] || '';
  text = text.trim();
  url = url.trim();
  if (url.length > 0) {
    url = 'href=\'' + url + '\'';
  }
  let icon = '';
  let img = hexo.theme.config.default.image;
  if (args.length > 2) {
    if (args[2].indexOf(' fa-') > -1) {
      icon = args[2].trim();
    } else {
      img = args[2].trim();
    }
  }
  if (icon.length > 0) {
    return `<a class="button" ${url} title='${text}'><i class='${icon}'></i>${text}</a>`;
  }
  return `<a class="button" ${url} title='${text}'><img src='${img}'>${text}</a>`;

}

hexo.extend.tag.register('btns', postBtns, {ends: true});
hexo.extend.tag.register('cell', postCell);
