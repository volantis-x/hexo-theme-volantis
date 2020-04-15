/**
 * note.js
 * transplant from hexo-theme-next
 */

'use strict';

function postNote(args) {
  args = args.join(' ').split(',')
  if (args.length > 1) {
    let cls = args[0].trim()
    let text = args[1].trim()
    return `<div class="note ${cls}">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  } else if (args.length > 0) {
    let text = args[0].trim()
    return `<div class="note">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  }
}

function postNoteBlock(args, content) {
  return `<div class="note ${args.join(' ')}">
            ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
          </div>`;
}

hexo.extend.tag.register('note', postNote);
hexo.extend.tag.register('noteblock', postNoteBlock, {ends: true});
