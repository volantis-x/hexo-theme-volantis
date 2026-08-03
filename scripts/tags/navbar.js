/**
 * 上次修改更新：6.8.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * navbar.js v2 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% navbar [active:url] [markdown-link] ... %}
 *
 * example:
 * {% navbar active:/about/ [Home](/) [About](/about/) [Comments](#comments) %}
 */

'use strict'

function navbar(args) {
  const ctx = hexo;
  if (args.length == 0) {
    return
  }
  args = ctx.args.map(args, ['active'], ['links'])
  if (args.links) {
    args.links = args.links.split(' ')
  }
  var el = `<div class="tag-plugin navbar">`
  for (let link of args.links) {
    const matches = link.match(/\[(.*?)\]\((.*?)\)/i)
    if (matches?.length > 2) {
      let text = matches[1]
      let href = matches[2]
      if (href == args.active) {
        el += `<a class="link active" href="${href}">${text}</a>`
      } else {
        el += `<a class="link" href="${href}">${text}</a>`
      }
    } else {
      el += `<a class="link" href="#${link}">${link}</a>`
    }
  }
  el += `</div>`
  return el
}

hexo.extend.tag.register('navbar', navbar)

