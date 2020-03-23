'use strict';

function postBtns(args, content) {
  return `<div class="btns ${args.join(' ')}">
            ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
          </div>`;
}

hexo.extend.tag.register('btns', postBtns, {ends: true});
