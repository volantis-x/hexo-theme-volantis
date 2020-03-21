'use strict';

function postFolding(args, content) {
  args = args.join(' ').split(',');
  var title = args[0];
  var style = args[1];
  if (style != undefined) {
    return `<details ${style}><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;
  } else {
    return `<details><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;
  }

}

hexo.extend.tag.register('folding', postFolding, {ends: true});
