/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * icon.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% icon key [color:color] [style:css] %}
 *
 */
/*
icon 图标标签

支持在任意{% icon solar:planet-bold-duotone %}位置插入图标，支持外链{% icon https://api.iconify.design/fluent-color:link-multiple-20.svg?color=%23888888 %}图标，也可以在 icons.yml 中提前配置好。

**{% icon ph:seal-question-fill color:purple %}可以指定图标的颜色吗？**

当然可以，还可以在主题配置中设置默认颜色：

```md 写法如下
icons.yml 中的图标：{% icon solar:planet-bold-duotone %}
外链图标：{% icon https://api.iconify.design/solar:link-circle-bold.svg %}
指定颜色：{% icon ph:seal-question-fill color:red %}
```

```yaml 配置默认颜色
tag_plugins:
  icon:
    # 留空时，图标和文字颜色相同
    default_color: accent # theme, accent, red, orange, yellow, green, cyan, blue, purple
```

> 还支持 style 参数，可以直接对样式进行修改，仅支持外链图标，style 参数中间不能有空格。

*/
'use strict'

function icon(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'style'], ['key', 'text'])
  if (args.color == null) {
    args.color = ctx.theme.config.tag_plugins.icon.default_color
  }
  var el = ''
  if (args.text) {
    el += `<div class="tag-plugin icon-wrap">`
  }
  el += `<span class="tag-plugin icon colorful" ${ctx.args.joinTags(args, ['color']).join(' ')}>`
  var more = ''
  if (args.style) {
    more += `style="${args.style}"`
  }
  el += ctx.utils.icon(args.key, more)
  el += `</span>`
  if (args.text) {
    el += `<span class="text">${args.text}</span>`
    el += '</div>'
  }
  return el
}
hexo.extend.tag.register('icon', icon)
