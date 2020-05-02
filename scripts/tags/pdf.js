'use strict';

function pdf(args) {
  return `<div class="pdf" target="${args[0]}" height="500px"></div>`;
}

hexo.extend.tag.register('pdf', pdf, {ends: false});
