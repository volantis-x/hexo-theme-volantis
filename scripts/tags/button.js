/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * button.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% button [color:color] text url [icon:key/src] [size:xs] %}
 *
 */

'use strict'

function button(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'icon', 'size'], ['text', 'url'])
  if (!args.text) {
    return ''
  }
  if (!args.url) {
    return ''
  }
  if (args.url.includes(' ')) {
    var arr = args.url.split(' ')
    args.url = arr.pop()
    args.text = `${args.text} ${arr.join(' ')}`
  }
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.button.default_color
  }
  var el = ''
  el += '<a class="tag-plugin colorful button"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'size']).join(' ')
  el += ` title="${args.text}"`
  el += ` href="${args.url}"`
  el += '>'
  if (args.icon) {
    el += ctx.utils.icon(args.icon)
  }
  el += `<span>${args.text}</span>`
  el += '</a>'
  return el
}

hexo.extend.tag.register('button', button)


