/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * hashtag.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% hashtag text href [color:color] %}
 *
 */

'use strict'

const tag_colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
var tag_index = 0

function hashtag(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color'], ['text', 'href'])
  if (args.color == null) {
    const default_color = ctx.theme.config.tag_plugins.hashtag?.default_color
    if (default_color) {
      args.color = default_color
    } else {
      args.color = tag_colors[tag_index]
      tag_index += 1
      if (tag_index >= tag_colors.length) {
        tag_index = 0
      }
    }
  }
  var el = ''
  el += '<a class="tag-plugin colorful hashtag"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'href']).join(' ')
  el += '>'
  el += '<svg t="1701408144765" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4228" width="200" height="200"><path d="M426.6 64.8c34.8 5.8 58.4 38.8 52.6 73.6l-19.6 117.6h190.2l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6s58.4 38.8 52.6 73.6l-19.4 117.6H896c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-42.6 256H832c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.6-117.4h-190.4l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.4-117.8H128c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l42.6-256H192c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6z m11.6 319.2l-42.6 256h190.2l42.6-256h-190.2z" p-id="4229"></path></svg>'
  el += '<span>' + args.text + '</span>'
  el += '</a>'
  return el
}


hexo.extend.tag.register('hashtag', hashtag)
