/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * paper.js v1.1 | https://github.com/HcGys/stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * paper:
 * {% paper [style:underline|无] [title:标题] [author:作者] [date:日期] [footer:footer] %}
 * 
 * <!-- section section-title -->
 * section-content
 * 
 * <!-- paragraph -->
 * paragraph-content
 * 
 *  <!-- line [right|left] -->
 * line-content
 * 
 * {% endpaper %}
 *
 */

'use strict'

function paper(args, content) {
  const ctx = hexo;
  var el = ''
  args = ctx.args.map(args, ['style','title', 'author', 'date', 'footer'])

  el += '<div class="tag-plugin paper">'

  el += '<div class="content' + (typeof args.style === 'undefined' ? '' : ' ' + args.style)  + '">'
  el += '<div class="title">'  // 布局需要
  if (args.title) el += args.title
  el += '</div>'


  el += '<div class="body">'

  var arr = content.split(/<!--\s*(paragraph|section|line) (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (arr.length > 0) {
    var nodeType = ''
    var innerTitle = ''
    arr.forEach((node, i) => {
      if (node == 'paragraph' || node == 'section' || node == 'line') {
        nodeType = node
      } else if (nodeType == 'paragraph'){
        el += '<div class="paragraph">'
        el += ctx.render.renderSync({text: (node || ''), engine: 'markdown'}).split('\n').join('')
        el += '</div>'
      } else if (nodeType == 'line'){
        if (innerTitle == '') {
          innerTitle = node
        } else {
          el += '<div class="line'
          el += innerTitle == 'right' ? ' right">' : '">'
          el += ctx.render.renderSync({text: (node || ''), engine: 'markdown'}).split('\n').join('')
          el += '</div>'
          innerTitle = ''  // 防止被下一个section|line使用
        }
      } else if (nodeType == 'section') {
        if (innerTitle == '') {
          innerTitle = node
        } else {
          el += '<div class="section">'
          el += '<div class="section-title">'
          el += innerTitle + '</div>'
          el += '<div class="section-content">'
          el += ctx.render.renderSync({text: (node || ''), engine: 'markdown'}).split('\n').join('')
          el += '</div></div>'
          innerTitle = ''  // 防止被下一个section|line使用
        }
      }
    })
  }

  el += '</div>'


  el += '<div class="footer">'  // 布局需要
  if (args.author || args.date) {
    el += '<div class="author-date">'
    if (args.author) el += '<span class="author">' + args.author + '</span>'
    if (args.date) el += '<span class="date">' + args.date + '</span>'
    el += '</div>'
  }
  if (args.footer) el += args.footer
  el += '</div>'

  el += '</div>'
  el += '</div>'
  return el
}

hexo.extend.tag.register('paper', paper, true)

