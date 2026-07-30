/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * link.js v1.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Link url [title] [desc:true/false] [icon:src] %}
 */

'use strict'

function Link(args) {
  const ctx = hexo;
  const full_url_for = require('hexo-util').full_url_for.bind(ctx)
  args = ctx.args.map(args, ['icon', 'desc'], ['url', 'title'])
  if (args.url == null) {
    return '';
  }
  const url = full_url_for(args.url)
  args.api = ctx.theme.config.data_services.siteinfo?.api
  if (args.api) {
    args.api = args.api.replace('{href}', url)
  }
  var autofill = []
  if (!args.title) {
    autofill.push('title')
  }
  if (!args.icon) {
    autofill.push('icon')
  }
  if (args.desc !== 'true' && args.desc !== true && !args.desc) {
    autofill.push('desc')
  }
  var el = ''
  el += '<div class="tag-plugin link dis-select">'
  el += '<a class="link-card' + (args.desc ? ' rich' : ' plain') + '" title="' + (args.title || '') + '" href="' + args.url + '"'
  if (args.url.includes('://')) {
    el += ' target="_blank" rel="external nofollow noopener noreferrer"'
  }
  el += ' cardlink'
  if (args.api) {
    el += ` data-api="${args.api}"`
  }
  el += ' autofill="'
  el += autofill.join(',')
  el += '"'
  el += '>'

  function loadIcon() {
    var el = ''
    el += '<div class="lazy img" data-bg="' + (args.icon || ctx.theme.config.default.link) + '"></div>'
    return el
  }
  function loadTitle() {
    return '<span class="title">' + (args.title || args.url) + '</span>'
  }
  function loadDesc() {
    return `<span class="cap desc footnote">${args.desc}</span>`
  }
  function loadLink() {
    return '<span class="cap link footnote">' + full_url_for(args.url) + '</span>'
  }

  if (args.desc) {
    // top
    el += '<div class="top">'
    el += loadIcon() + loadLink()
    el += '</div>'
    // bottom
    el += '<div class="bottom">'
    el += loadTitle() + loadDesc()
    el += '</div>'
  } else {
    // left
    el += '<div class="left">'
    el += loadTitle() + loadLink()
    el += '</div>'
    // right
    el += '<div class="right">'
    el += loadIcon()
    el += '</div>'
  }

  // end
  el += '</a></div>'

  return el
}


hexo.extend.tag.register('Link', Link)



// v5
// {% link title, url %}
// {% link title, url, img %}
hexo.extend.tag.register('link', function (args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  let text = '';
  let url = '';
  let img = '';
  if (args.length < 2) {
    return;
  } else if (args.length == 2) {
    text = args[0].trim();
    url = args[1].trim();
  } else if (args.length == 3) {
    text = args[0].trim();
    url = args[1].trim();
    img = args[2].trim();
  }
  let result = '';
  // 发现如果不套一层 div 在其它可渲染 md 的容器中容易被分解
  result += '<div class="tag link"><a class="link-card" title="' + text + '" href="' + url + '">';
  // left
  result += '<div class="left">';
  result += '<img src="' + (img || hexo.theme.config.tag_plugins.link.placeholder) + '"/>';
  result += '</div>';
  // right
  result += '<div class="right"><p class="text">' + text + '</p><p class="url">' + url + '</p></div>';
  result += '</a></div>';

  return result;
});

hexo.extend.tag.register('linkgroup', function (args, content) {
  let ret = '';
  ret += '<div class="link-group">';
  ret += content;
  ret += '</div>';
  return ret;
}, { ends: true });
