/**
 * 上次修改更新：6.8.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * banner.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% banner title [subtitle] [bg:src] [avatar:src] [link] %}
 * {% navbar xxx %}
 * {% endbanner %}
 */

'use strict';

function banner(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['bg', 'avatar', 'link'], ['title', 'subtitle'])
  var el = ''
  el += `<div class="tag-plugin banner">`
  // bg
  el += `<img class="lazy bg" data-src="${args.bg ? args.bg : ctx.theme.config.default.banner}">`
  // content
  el += `<div class="content">`
  // content.top
  el += `<div class="top">`
  // content.top.back
  if (args.link?.length > 0) {
    el += `<div></div>`
  } else {
    el += `
    <button class="back cap" onclick="window.history.back()">
      <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"></path></svg>
    </button>
    `
  }
  
  // content.top.menus
  const rows = content.split('\n').filter(item => item.trim().length > 0)
  for (let row of rows) {
    if (row.includes('tag-plugin navbar')) {
      el += row
      break
    }
  }
  el += `</div>`
  // content.bottom
  el += `<div class="bottom">`
  // content.bottom.avatar
  if (args.avatar?.length > 0) {
    el += `<img class="avatar" src="${args.avatar}">`
  }
  // content.bottom.text-area
  if (args.title?.length > 0 || args.subtitle?.length > 0) {
    el += `<div class="text-area">`
    if (args.title?.length > 0) {
      el += `<div class="text title">${args.title}</div>`
    }
    if (args.subtitle?.length > 0) {
      el += `<div class="text subtitle">${args.subtitle}</div>`
    }
    el += `</div>`
  }
  el += `</div>`
  el += `</div>`
  // link
  if (args.link?.length > 0) {
    el += `<a class="banner-link" href="${args.link}"></a>`
  }
  el += `</div>`
  return el
}
hexo.extend.tag.register('banner', banner, true)

