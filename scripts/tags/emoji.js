/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * emoji.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% emoji [source] name [height:1.75em] %}
 *
 */
/*
emoji 表情包

内置了可配置的表情标签 {% emoji aini %} {% emoji blobcat 0_0 %} {% emoji tieba huaji %} 使用方法如下：

```
{% emoji aini %}
{% emoji blobcat 0_0 %}
{% emoji tieba huaji %}
```

如果对高度有特别要求，可以指定高度，例如：

{% emoji blobcat party height:1em %}{% emoji blobcat party height:2em %}{% emoji blobcat party height:3em %}{% emoji blobcat party height:2em %}{% emoji blobcat party height:1em %}



语法格式

```
{% emoji [source] name [height:1.75em] %}
```

其中 `source` 可省略，默认为配置中的第一个 `source`（详见「引入表情包」部分）

> 表情速查表：[Stellar内嵌blobcat小表情](https://weekdaycare.cn/posts/emoji-blob/)

引入表情包

```yaml blog/_config.volantis.yml
tag_plugins:
  ...
  emoji:
    default: https://gcore.jsdelivr.net/gh/cdn-x/emoticons/qq/{name}.gif
    twemoji: https://gcore.jsdelivr.net/gh/twitter/twemoji/assets/svg/{name}.svg
    qq: https://gcore.jsdelivr.net/gh/cdn-x/emoticons/qq/{name}.gif
    aru: https://gcore.jsdelivr.net/gh/cdn-x/emoticons/aru-l/{name}.gif
    tieba: https://gcore.jsdelivr.net/gh/cdn-x/emoticons/tieba/{name}.png
```

> 在配置文件中，文件名用 `{name}` 代替。


*/
'use strict'

function emoji(args) {
  const ctx = hexo;
  const config = ctx.theme.config.tag_plugins.emoji
  args = ctx.args.map(args, ['height'], ['source', 'name'])
  var el = ''
  if (args.source == undefined) {
    return el
  }
  el += '<span class="tag-plugin emoji">'
  if (args.name == undefined) {
    // 省略了 source
    for (let id in config) {
      if (config[id]) {
        args.name = args.source
        args.source = id
        break
      }
    }
  }
  if (config[args.source] && args.name) {
    let url = config[args.source].replace('{name}', args.name)
    el += '<img no-lazy="" class="inline"'
    el += ' src="' + url + '"'
    if (args.height) {
      el += ' style="height:' + args.height + '"'
    }
    el += '/>'
  }
  el += '</span>'
  return el
}

hexo.extend.tag.register('emoji', emoji)


