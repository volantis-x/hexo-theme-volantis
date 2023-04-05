/**
 * note.js | https://github.com/volantis-x/hexo-theme-volantis
 */

'use strict';

// {% note style, content %}
function postNote(args) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  if (args.length > 1) {
    const cls = args[0].trim();
    const text = args[1].trim();
    return `<div class="note ${cls}">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  } else if (args.length > 0) {
    const text = args[0].trim();
    return `<div class="note">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div>`;
  }
}

// {% noteblock style, title %}
// content
// {% endnoteblock %}
function postNoteBlock(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  if (args.length < 1) {
    return;
  }
  const cls = args[0].trim();
  let ret = '';
  ret += '<div class="note ' + cls + '">';
  if (args.length > 1) {
    const title = args[1].trim();
    ret += '<p><strong>' + title + '</strong></p>';
  }
  ret += hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('');
  ret += '</div>';
  return ret;
}

hexo.extend.tag.register('note', postNote);

// https://github.com/volantis-x/hexo-theme-volantis/issues/712
// {% blocknote style, title %}
// content
// {% endblocknote %}
hexo.extend.tag.register('blocknote', postNoteBlock, {ends: true});
// 兼容 noteblock
hexo.extend.filter.register('before_post_render', function(data) {
  data.content = data.content.replace(/{%\s+noteblock(.*)%}/g, (p,q)=>{
    return `{% blocknote ${q} %}`
  });
  data.content = data.content.replace(/{%\s+endnoteblock\s+%}/g, '{% endblocknote %}');
  return data;
});
// 兼容 noteblock 失败
hexo.extend.tag.register('noteblock', postNoteBlockDeprecated, {ends: true});
function postNoteBlockDeprecated(args, content) {
    throw new Error(`
==================================================================================
        {% noteblock %} is deprecated. Use {% blocknote %} instead.
        see: https://github.com/volantis-x/hexo-theme-volantis/issues/712
==================================================================================
  `);
}