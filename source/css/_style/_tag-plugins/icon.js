/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * icon.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% icon key [color:color] [style:css] %}
 *
 */

'use strict'

function icon(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'style'], ['key', 'text'])
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.icon.default_color
  }
  var el = ''
  if (args.text) {
    el += `<div class="tag-plugin icon-wrap">`
  }
  el += `<span class="tag-plugin icon colorful" ${ctx.args.joinTags(args, ['color']).join(' ')}>`
  var more = ''
  if (args.style) {
    more += `style="${args.style}"`
  }
  el += ctx.utils.icon(args.key, more)
  el += `</span>`
  if (args.text) {
    el += `<span class="text">${args.text}</span>`
    el += '</div>'
  }
  return el
}
