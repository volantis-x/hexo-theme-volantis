/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * button.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% button [color:color] text url [icon:key/src] [size:xs] %}
 *
 */

'use strict'

function button(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'icon', 'size'], ['text', 'url'])
  if (!args.text) {
    return ''
  }
  if (!args.url) {
    return ''
  }
  if (args.url.includes(' ')) {
    var arr = args.url.split(' ')
    args.url = arr.pop()
    args.text = `${args.text} ${arr.join(' ')}`
  }
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.button.default_color
  }
  var el = ''
  el += '<a class="tag-plugin colorful button"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'size']).join(' ')
  el += ` title="${args.text}"`
  el += ` href="${args.url}"`
  el += '>'
  if (args.icon) {
    el += ctx.utils.icon(args.icon)
  }
  el += `<span>${args.text}</span>`
  el += '</a>'
  return el
}

hexo.extend.tag.register('button', button)



// v5
/*
{% btn 样式参数（可选）::标题::链接::图标（可选） %}

样式参数

regular, large, center

图标

第1个或者第2个参数包含 fa- 的那个被识别为图

不设置任何参数的 {% btn 按钮:: / %} 适合融入段落中。

regular 按钮适合独立于段落之外：

{% btn regular::示例博客::https://xaoxuu.com::fas fa-play-circle %}

large 按钮更具有强调作用，建议搭配 center 使用：

{% btn center large::开始使用::https://volantis.js.org/v3/getting-started/::fas fa-download %}

*/
'use strict';

function postBtn(args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  let cls = '';
  let text = '';
  let url = '';
  let icon = '';
  if (args.length > 3) {
    cls = args[0];
    text = args[1];
    url = args[2];
    icon = args[3];
  } else if (args.length > 2) {
    if (args[2].indexOf(' fa-') > -1) {
      // text, url, icon
      text = args[0];
      url = args[1];
      icon = args[2];
    } else {
      cls = args[0];
      text = args[1];
      url = args[2];
    }
  } else if (args.length > 1) {
    text = args[0];
    url = args[1];
  } else if (args.length > 0) {
    text = args[0];
  }

  cls = cls.trim();
  icon = icon.trim();
  text = text.trim();
  url = url.trim();
  if (url.length > 0) {
    url = 'href=\'' + url + '\'';
  }
  if (cls.length > 0) {
    cls = ' ' + cls;
  }
  if (icon.length > 0) {
    return `<span class='btn${cls}'><a class="button" ${url} title='${text}'><i class='${icon}'></i>${text}</a></span>`;
  }
  return `<span class='btn${cls}'><a class="button" ${url} title='${text}'>${text}</a></span>`;

}

hexo.extend.tag.register('btn', postBtn);
