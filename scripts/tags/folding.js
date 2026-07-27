/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

'use strict';

// v6
/**
 * folding.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Folding [color:yellow] [child:codeblock] [open:false] title %}
 * body
 * {% endFolding %}
 */
/*
## Folding 折叠容器

折叠块标签的语法格式为：

```
{% Folding title [codeblock:bool] [open:bool] [color:color] %}
content
{% endFolding %}
```

```yaml 参数说明
codeblock: true/false
open: true/false
color: red/orange/yellow/green/cyan/blue/purple/light/dark
```

### 彩色可折叠代码块

备注标签相较于旧版进行了增强，可以实现更多种颜色，还可以通过设置 `child:codeblock` 来实现可折叠的代码块。以下是一个默认打开的代码折叠框：

{% Folding child:codeblock open:true color:yellow 默认打开的代码折叠框 %}
```swift
func test() {
  print("hello world")
}
```
{% endFolding %}

代码如下：

```
{% Folding child:codeblock open:true color:yellow 默认打开的代码折叠框 %}
代码块
{% endFolding %}
```

{% Folding color:yellow 危险，请不要打开这个 %}
通过设置颜色，以实现更醒目的作用，但不要滥用色彩哦～
{% Folding color:orange 警告，真的很危险 %}
通过设置颜色，以实现更醒目的作用，但不要滥用色彩哦～
{% Folding color:red 最后一次警告，千万不要打开这个 %}
不要说我们没有警告过你，Windows 10 不是為所有人設計，而是為每個人設計。
{% endFolding %}
{% endFolding %}
{% endFolding %}

*/


function Folding(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'child', 'open'], ['title'])
  var el = ''
  // header
  el += '<details class="tag-plugin colorful folding"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'child']).join(' ')
  if (args.open && args.open == 'true') {
    el += ' open'
  }
  el += '>'
  // summary
  el += '<summary>' + ctx.render.renderSync({text: (args.title || ''), engine: 'markdown'}) + '</summary>'
  // content
  el += '<div class="body">'
  el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join(' ')
  el += '</div></details>'

  return el
}

hexo.extend.tag.register('Folding', Folding, true)






// v5
/*
{% folding 参数（可选）::标题 %}
![](https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/41F215B9-261F-48B4-80B5-4E86E165259E.jpeg)
{% endfolding %}


{% folding 查看图片测试 %}

![](https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/41F215B9-261F-48B4-80B5-4E86E165259E.jpeg)

{% endfolding %}

{% folding cyan open::查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green::查看代码测试 %}

{% endfolding %}

{% folding yellow::查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red::查看嵌套测试 %}

{% folding blue::查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha <span><img src='https://gcore.jsdelivr.net/gh/volantis-x/cdn-emoji/tieba/%E6%BB%91%E7%A8%BD.png' style='height:24px'></span>

{% endfolding %}

{% endfolding %}

{% endfolding %}
*/

function postFolding(args, content) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  let style = '';
  let title = '';
  if (args.length > 1) {
    style = args[0].trim();
    title = args[1].trim();
  } else if (args.length > 0) {
    title = args[0].trim();
  }
  if (style != undefined) {
    return `<details ${style}><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}
              </div>
            </details>`;
  }
  return `<details><summary> ${title} </summary>
              <div class='content'>
              ${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}
              </div>
            </details>`;


}

hexo.extend.tag.register('folding', postFolding, { ends: true });
