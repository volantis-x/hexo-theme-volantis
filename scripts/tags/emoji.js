/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * emoji.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% emoji [source] name [height:1.75em] %}
 *
 */

'use strict'

function emoji(args) {
  const ctx = hexo;
  const config = ctx.theme.config.tag_plugins.emoji
  args = ctx.args.map(args, ['height'], ['source', 'name'])
  var el = ''
  if (args.source == undefined) {
    return el
  }
  el += '<span class="tag-plugin emoji">'
  if (args.name == undefined) {
    // 省略了 source
    for (let id in config) {
      if (config[id]) {
        args.name = args.source
        args.source = id
        break
      }
    }
  }
  if (config[args.source] && args.name) {
    let url = config[args.source].replace('{name}', args.name)
    el += '<img no-lazy="" class="inline"'
    el += ' src="' + url + '"'
    if (args.height) {
      el += ' style="height:' + args.height + '"'
    }
    el += '/>'
  }
  el += '</span>'
  return el
}



