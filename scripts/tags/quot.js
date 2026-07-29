/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * quot.js v1.2 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * quot:
 * {% quot [el:h2] [icon:default] [prefix:icon] text [suffix:icon] %}
 *
 */

'use strict'

function quot(args) {
  const ctx = hexo;
  var el = ''
  args = ctx.args.map(args, ['el', 'icon', 'prefix', 'suffix'], ['text'])
  if (!args.el) {
    args.el = 'p'
  }

  function content() {
    const cfg = ctx.theme.config.tag_plugins.quot[args.icon || 'default']
    var el = ''
    var prefix = null
    var suffix = null
    if (args.prefix || args.suffix) {
      // 临时设定的样式
      prefix = args.prefix
      suffix = args.suffix
    } else {
      // yml中配置的样式
      prefix = cfg?.prefix
      suffix = cfg?.suffix
    }
    if (prefix) {
      el += ctx.utils.icon(prefix, 'class="icon prefix"')
    } else {
      el += `<span class="empty"></span>`
    }
    el += `<span class="text">${args.text}</span>`
    if (suffix) {
      el += ctx.utils.icon(suffix, 'class="icon prefix"')
    } else {
      el += `<span class="empty"></span>`
    }
    return el
  }
  el += `<div class="tag-plugin quot ${args.el}">`
  if (args.el.includes('h')) {
    el += `<${args.el} class="content" id="${args.text}">`
    el += content()
    el += '</' + args.el + '>'
  } else {
    el += `<${args.el} class="content">`
    el += content()
    el += '</' + args.el + '>'
  }
  el += '</div>'
  return el
}

hexo.extend.tag.register('quot', quot)


