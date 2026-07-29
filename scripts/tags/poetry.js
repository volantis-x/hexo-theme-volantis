/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * poetry.js v1.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * poetry:
 * {% poetry [title] [author:作者] [date:日期] [footer:footer] %}
 * body
 * {% endpoetry %}
 *
 */

'use strict'

function poetry(args, content) {
  const ctx = hexo;
  var el = ''
  args = ctx.args.map(args, ['author', 'date', 'footer'], ['title'])

  el += '<div class="tag-plugin poetry"'
  el += '>'
  el += '<div class="content">'
  if (args.title) {
    el += '<div class="title">'
    el += args.title
    el += '</div>'
  }
  if (args.author || args.date) {
    el += '<div class="meta">'
    if (args.author) {
      el += '<span>' + args.author + '</span>'
    }
    if (args.date) {
      el += '<span>' + args.date + '</span>'
    }
    el += '</div>'
  }
  el += '<div class="body">'
  el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  el += '</div>'
  if (args.footer) {
    el += '<div class="footer">'
    el += args.footer
    el += '</div>'
  }
  el += '</div>'
  el += '</div>'
  return el
}

hexo.extend.tag.register('poetry', poetry, true)


