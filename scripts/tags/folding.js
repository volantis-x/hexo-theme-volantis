'use strict';

function postFolding(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  let style = '';
  let title = '';
  if (args.length > 1) {
    style = args[0].trim();
    title = args[1].trim();
  } else if (args.length > 0) {
    title = args[0].trim();
  }
  if (style != undefined) {
    return `<details ${style}><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;
  }
  return `<details><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;


}

hexo.extend.tag.register('folding', postFolding, {ends: true});
