/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * reel.js v1.1 | https://github.com/HcGys/stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * reel:
 * {% reel [title] [author:作者] [date:日期] [footer:footer] %}
 * body
 * {% endreel %}
 *
 */

'use strict'

function reel(args, content) {
  const ctx = hexo;
  var el = ''
  args = ctx.args.map(args, ['author', 'date', 'footer'], ['title'])

  el += '<div class="tag-plugin reel"'
  el += '>'
  el += '<div class="content">'
  el += '<div class="title">'
  if (args.title) el += args.title   // 布局需要
  el += '</div>'
  if (args.author) {
    el += '<div class="meta">'
    if (args.author) {
      el += '<span>' + args.author + '</span>'
    }
    el += '</div>'
  }
  el += '<div class="body"><div class="main">'
  el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  el += '</div></div>'
  if (args.date) {
    el += '<div class="date">' + args.date + '</div>'
  }
  el += '<div class="footer">'
  if(args.footer) el += args.footer  // 布局需要
  el += '</div>'
  el += '</div>'
  el += '</div>'
  return el
}

hexo.extend.tag.register('reel', reel, true)




