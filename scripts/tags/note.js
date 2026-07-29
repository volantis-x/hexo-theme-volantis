/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * note.js v1.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Note [color:color] [title] content %}
 */

'use strict'

function Note(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color'], ['title', 'content'])
  if (args.content == undefined || args.content.length <= 0) {
    args.content = args.title
    args.title = ''
  }
  const { title } = args
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.Note.default_color
  }
  var el = ''
  // header
  el += '<div class="tag-plugin colorful note"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'child']).join(' ')
  el += '>'
  // title
  if (title && title.length > 0) {
    el += `<div class="title">${title}</div>`
  }
  // content
  el += '<div class="body">'
  el += ctx.render.renderSync({text: args.content, engine: 'markdown'}).split('\n').join('')
  el += '</div></div>'

  return el
}
hexo.extend.tag.register('Note', Note)


// v5
/**
 * note.js | https://github.com/volantis-x/hexo-theme-volantis
 */


// {% note style, content %}
function postNote(args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  if (args.length > 1) {
    const cls = args[0].trim();
    const text = args[1].trim();
    return `<div class="note ${cls}">${hexo.render.renderSync({ text: text, engine: 'markdown' }).split('\n').join('')}</div>`;
  } else if (args.length > 0) {
    const text = args[0].trim();
    return `<div class="note">${hexo.render.renderSync({ text: text, engine: 'markdown' }).split('\n').join('')}</div>`;
  }
}

// {% noteblock style, title %}
// content
// {% endnoteblock %}
function postNoteBlock(args, content) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
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
  ret += hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('');
  ret += '</div>';
  return ret;
}

hexo.extend.tag.register('note', postNote);

// https://github.com/volantis-x/hexo-theme-volantis/issues/712
// {% blocknote style, title %}
// content
// {% endblocknote %}
hexo.extend.tag.register('blocknote', postNoteBlock, { ends: true });
// 兼容 noteblock
hexo.extend.filter.register('before_post_render', function (data) {
  data.content = data.content.replace(/{%\s+noteblock(.*)%}/g, (p, q) => {
    return `{% blocknote ${q} %}`
  });
  data.content = data.content.replace(/{%\s+endnoteblock\s+%}/g, '{% endblocknote %}');
  return data;
});
// 兼容 noteblock 失败
hexo.extend.tag.register('noteblock', postNoteBlockDeprecated, { ends: true });
function postNoteBlockDeprecated(args, content) {
  throw new Error(`
==================================================================================
        {% noteblock %} is deprecated. Use {% blocknote %} instead.
        see: https://github.com/volantis-x/hexo-theme-volantis/issues/712
==================================================================================
  `);
}
