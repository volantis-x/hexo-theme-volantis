/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * grid.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% grid [bg:box/card] [w:240px] [c:2] [gap:16px] [br:12px] %}
 * <!-- cell -->
 * left body
 * <!-- cell -->
 * right body
 * {% endgrid %}
 */

'use strict'

function grid(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['bg', 'w', 'c', 'gap', 'br'])
  if (args.w == null && args.c == null) {
    args.w = '240px'
  }
  var el = ''
  el += '<div class="tag-plugin grid"'
  el += ' ' + ctx.args.joinTags(args, ['bg', 'columns']).join(' ')
  el += ' style="'
  if (args.w) {
    el += `grid-template-columns: repeat(auto-fill, minmax(${args.w}, 1fr));`
  } else if (args.c) {
    el += `grid-template-columns: repeat(${args.c}, 1fr);`
  }
  if (args.gap) {
    el += `grid-gap:${args.gap};`
  }
  el += '"'
  el += '>'
  // 分组
  var cells = content.split(/<!--\s*cell(.*?)-->/g).filter(item => item.trim().length > 0)
  for (let cell of cells) {
    el += `<div class="cell" style="`
    if (args.br) {
      el += `border-radius:${args.br};`
    }
    el += `">`
    el += `
    ${ctx.render.renderSync({text: (cell || ''), engine: 'markdown'}).split('\n').join('')}
    </div>
    `
  }
  el += '</div>'
  return el
}

hexo.extend.tag.register('grid', grid, true)
