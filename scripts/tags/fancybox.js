'use strict';

function postFancybox(args, content) {
  args = args.join(' ').split(',');
  var cls = args[0];
  var col = Number(args[1]) || 0;
  var group = (args[2] || 'default').trim();
  if (col > 0) {
    return `<div class="gallery ${cls}" col='${col}' data-group='${group}'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
            </div>`;
  }
  return `<div class="gallery ${cls}" data-group='${group}'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
            </div>`;

}

hexo.extend.tag.register('gallery', postFancybox, {ends: true});
