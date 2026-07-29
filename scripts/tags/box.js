/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * box.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% box [color:color] [child:codeblock/tabs] title %}
 * body
 * {% endbox %}
 */

'use strict';

function box(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'child'], ['title'])
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
    el += '<div class="title"><strong>' + ctx.render.renderSync({text: title, engine: 'markdown'}) + '</strong></div>'
  }
  // content
  el += '<div class="body">'
  el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  el += '</div></div>'

  return el
}
hexo.extend.tag.register('box', box, true)
