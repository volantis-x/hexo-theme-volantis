/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * folders.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% folders [color:white] %}
 * <!-- folder title 1 -->
 * body 1
 * <!-- folder title 2 -->
 * body 2
 * {% endtable %}
 */

'use strict'

function folders(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color'])
  var el = ''
  el += '<div class="tag-plugin colorful folders"'
  el += ' ' + ctx.args.joinTags(args, ['color']).join(' ')
  el += '>'
  
  var arr = content.split(/<!--\s*folder (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (arr.length > 0) {
    var nodes = []
    arr.forEach((item, i) => {
      if (i % 2 == 0) {
        nodes.push({
          header: item
        })
      } else if (nodes.length > 0) {
        var node = nodes[nodes.length-1]
        if (node.body == undefined) {
          node.body = item
        } else {
          node.body += '\n' + item
        }
      }
    })
    nodes.forEach((node, i) => {
      el += '<details class="folder" index="' + (i) + '">'
      // summary
      el += '<summary>' + ctx.render.renderSync({text: (node.header || ''), engine: 'markdown'}) + '</summary>'
      // content
      el += '<div class="body">'
      el += ctx.render.renderSync({text: (node.body || ''), engine: 'markdown'}).split('\n').join('')
      el += '</div></details>'
    })  
  }

  el += '</div>'
  
  return el
}

hexo.extend.tag.register('folders', folders, true)

