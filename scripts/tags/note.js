/**
 * note.js
 * transplant from hexo-theme-next
 */

'use strict';

function postNote(args) {
  args = args.join(' ').split(',')
  let p0 = args[0].trim()
  let p1 = args[1].trim()
  return `<div class="note ${p0}">${hexo.render.renderSync({text: p1, engine: 'markdown'}).split('\n').join('')}</div>`;
}

function postNoteBlock(args, content) {
  return `<div class="note ${args.join(' ')}">
            ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
          </div>`;
}

hexo.extend.tag.register('note', postNote);
hexo.extend.tag.register('noteblock', postNoteBlock, {ends: true});
