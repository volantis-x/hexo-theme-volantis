/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */


/**
 * copy.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% copy xxx %}
 * {% copy git xaoxuu/hexo-theme-stellar %}
 *
 */

'use strict'

var copy_index = 0

function copy(args) {
  args = ctx.args.map(args, ['git', 'prefix'], ['text'])
  if (args == undefined || args.text == undefined) {
    return ''
  }
  var text = args.text
  if (args.git) {
    if (text.substr(0,1) == '/') {
      text = text.substring(1)
    }
    if (args.git == 'ssh') {
      text = 'git@github.com:' + text + '.git'
    } else if (args.git == 'gh') {
      text = 'gh repo clone ' + text
    } else {
      text = 'https://github.com/' + text + '.git'
    }
  }

  const copy_id = 'copy_' + ++copy_index
  const toast = ctx.theme.config.tag_plugins.copy.toast

  var el = ``
  el += `<div class="tag-plugin copy">`
  if (args.prefix?.length > 0) {
    el += `<span>${args.prefix}</span>`
  }
  el += `<input class="copy-area" id="${copy_id}" value="${text}">`
  el += `<button class="copy-btn" onclick="util.copy(&quot;${copy_id}&quot;,&quot;${toast}&quot;)">`
  el += `<svg class="icon copy-btn" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>`
  el += `</button>`
  el += `</div>`
  return el
}



