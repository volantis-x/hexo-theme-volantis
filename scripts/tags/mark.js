/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * mark.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% mark text [color:color] %}
 *
 */

'use strict'

function mark(args) {
  args = ctx.args.map(args, ['color'], ['text'])
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.mark.default_color
  }
  var el = ''
  el += '<mark class="tag-plugin colorful mark"'
  el += ' ' + ctx.args.joinTags(args, ['color']).join(' ')
  el += '>'
  el += args.text
  el += '</mark>'
  return el
}

hexo.extend.tag.register('mark', mark)
