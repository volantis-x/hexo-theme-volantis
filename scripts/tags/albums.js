


/**
 * albums.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% albums [group] [repo:owner/repo] [api:http] [size:s/m/l/xl/mix] %}
 */

'use strict'

function albums(args) {
  const ctx = hexo;
  var args = ctx.args.map(args, ['repo', 'api', 'size'], ['group'])
  const host = ctx.theme.config.api_host.ghraw
  if (args.size == null) {
    args.size = 's'
  }
  var api
  if (args.api) {
    api = args.api
  } else if (args.repo) {
    api = `https://${host}/${args.repo}/output/v2/data.json`
  }
  
  var el = ''
  el += `<div class="tag-plugin albums-wrap">`
  if (api) {
    el += `<div class="data-service ds-friends" data-api="${api}"><div class="tag-plugin gallery grid-box" layout="grid" ratio="square" ${ctx.args.joinTags(args, ['size']).join(' ')}></div></div>`
  } else if (args.group) {
    const links = ctx.theme.config.links || {}
    el += `<div class="tag-plugin gallery grid-box" layout="grid" ratio="square" ${ctx.args.joinTags(args, ['size']).join(' ')}>`
    for (let item of (links[args.group] || [])) {
      if (item?.url) {
        el += `<div class="grid-cell album-card">`
        el += `<a class="card-link lazy-box" target="_blank" rel="external nofollow noopener noreferrer" href="${item.url}">`
        el += `<img class="lazy" data-src="${item.cover || item.icon || item.avatar || ctx.theme.config.default.cover}" onerror="javascript:this.removeAttribute(&quot;data-src&quot;);this.src=&quot;${ctx.theme.config.default.cover}&quot;;"/>`
        el += `<div class="lazy-icon" style="background-image:url(${ctx.theme.config.default.loading});"></div>`
        el += `<div class="image-meta">`
        if (item.title) {
          el += `<span class="image-caption">${item.title}</span>`
        }
        el += `</div>`
        el += `</a>`
        el += `</div>`
      }
    }
    el += `</div>`
  }
  el += `</div>`
  return el
}

hexo.extend.tag.register('albums', albums)


