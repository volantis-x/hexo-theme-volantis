/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * tabs.js v2.1 | 基于NexT修改： https://theme-next.js.org/docs/tag-plugins/tabs
 */
// v6
/*
{% Tabs active:2 align:center %}

<!-- tab 图片 -->
{% image https://unpkg.com/volantis-static@0.0.1761982841160/media/wallpaper/minimalist/2020/001.webp %}

<!-- tab 代码块 -->

```swift
let x = 123
print("hello world")
```

<!-- tab 表格 -->
| a | b | c |
| --- | --- | --- |
| a1 | b1 | c1 |
| a2 | b2 | c2 |

{% endTabs %}

支持设置 align:center 来使内容居中
设置默认激活的标签方式为 `active:1` 而非 `, 1`（使用默认格式降低学习成本，且显式声明可读性更强）
不需要 <!-- endtab --> 来作为结束标识（会自动判断）
不需要 tabs id 来保证唯一性（会设置唯一标识）
不支持 @icon 方式设置图标
*/

'use strict'

var tab_index = 0 

function Tabs_v6(args, content = '') {
  const ctx = hexo;
  var arr = content.split(/<!--\s*tab (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (arr.length < 1) {
    return ''
  }
  var tabs = []
  arr.forEach((item, i) => {
    if (i % 2 == 0) {
      tabs.push({
        header: item
      })
    } else if (tabs.length > 0) {
      var tab = tabs[tabs.length-1]
      if (tab.body == undefined) {
        tab.body = item
      } else {
        tab.body += '\n' + item
      }
    }
  })

  args = ctx.args.map(args, ['active', 'align'])
  const tabName = 'tab_' + ++tab_index
  const tabActive = Number(args.active) || 0

  let tabId = 0
  let tabNav = ''
  let tabContent = ''
  tabs.forEach((tab, i) => {
    let content = ctx.render.renderSync({ text: (tab.body || ''), engine: 'markdown' }).trim()
    const abbr = tabName + ' ' + ++tabId
    const href = abbr.toLowerCase().split(' ').join('-')
    const isActive = (tabActive > 0 && tabActive === tabId) || (tabActive === 0 && tabId === 1) ? ' active' : ''
    tabNav += `<li class="tab${isActive}"><a class="#${href}">${tab.header || abbr}</a></li>`
    tabContent += `<div class="tab-pane${isActive}" id="${href}">${content}</div>`
  })

  tabNav = `<ul class="nav-tabs">${tabNav}</ul>`
  tabContent = `<div class="tab-content">${tabContent}</div>`

  var el = ''
  el += '<div class="tag-plugin tabs"'
  if (args.align != undefined) {
    el += ' align="' + args.align + '"'
  }
  el += 'id="' + tabName.toLowerCase().split(' ').join('-') + '"'
  el += '>'
  el += tabNav + tabContent
  el += '</div>'
  return el
}

hexo.extend.tag.register('Tabs', Tabs_v6, true)
hexo.extend.tag.register('subTabs', Tabs_v6, true)
hexo.extend.tag.register('subsubTabs', Tabs_v6, true)



/**
 * tabs.js | https://theme-next.org/docs/tag-plugins/tabs
 */
// v5
/*
{% tabs 页面内不重复的ID %}
<!-- tab 栏目1 -->
内容
<!-- endtab -->
<!-- tab 栏目2 -->
内容
<!-- endtab -->
{% endtabs %}
*/

function postTabs(args, content) {
  var tabBlock = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g;

  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  var tabName = args[0];
  var tabActive = Number(args[1]) || 0;

  var matches = [];
  var match;
  var tabId = 0;
  var tabNav = '';
  var tabContent = '';

  !tabName && hexo.log.warn('Tabs block must have unique name!');

  while ((match = tabBlock.exec(content)) !== null) {
    matches.push(match[1]);
    matches.push(match[2]);
  }

  for (var i = 0; i < matches.length; i += 2) {
    var tabParameters = matches[i].split('@');
    var postContent = matches[i + 1];
    var tabCaption = tabParameters[0] || '';
    var tabIcon = tabParameters[1] || '';
    var tabHref = '';


    // 兼容aplayer插件 https://github.com/volantis-x/hexo-theme-volantis/issues/575
    var aplayerTag = 0
    var aplayerTagReg = /\<div.*class=\"aplayer aplayer-tag-marker\"(.|\n)*\<\/script\>/g
    if (/class="aplayer aplayer-tag-marker"/g.test(postContent)) {
      aplayerTag = aplayerTagReg.exec(postContent)[0]
      postContent = postContent.replace(aplayerTagReg, "@aplayerTag@")
    }

    // 兼容 gallery 标签
    var fancyboxTag = 0
    var fancyboxTagReg = /\<div.*galleryFlag(.|\n)*\<\/span\>\<\/div\>\<\/div\>/g
    if (/galleryFlag/g.test(postContent)) {
      fancyboxTag = fancyboxTagReg.exec(postContent)[0]
      postContent = postContent.replace(fancyboxTagReg, "@fancyboxTag@")
    }

    postContent = hexo.render.renderSync({ text: postContent, engine: 'markdown' }).trim();

    if (aplayerTag) {
      postContent = postContent.replace(/\<pre\>\<code\>.*@aplayerTag@.*\<\/code><\/pre>/, aplayerTag)
    }

    if (fancyboxTag) {
      postContent = postContent.replace(/.*@fancyboxTag@.*/, fancyboxTag)
    }

    tabId += 1;
    tabHref = (tabName + ' ' + tabId).toLowerCase().split(' ').join('-');

    ((tabCaption.length === 0) && (tabIcon.length === 0)) && (tabCaption = tabName + ' ' + tabId);

    var isOnlyicon = tabIcon.length > 0 && tabCaption.length === 0 ? ' style="text-align: center;"' : '';
    let icon = tabIcon.trim();
    icon = icon.startsWith('fa') ? icon : 'fa fa-' + icon;
    tabIcon.length > 0 && (tabIcon = `<i class="${icon}"${isOnlyicon}></i>`);

    var isActive = (tabActive > 0 && tabActive === tabId) || (tabActive === 0 && tabId === 1) ? ' active' : '';
    tabNav += `<li class="tab${isActive}"><a class="#${tabHref}">${tabIcon + tabCaption.trim()}</a></li>`;
    tabContent += `<div class="tab-pane${isActive}" id="${tabHref}">${postContent}</div>`;
  }

  tabNav = `<ul class="nav-tabs">${tabNav}</ul>`;
  tabContent = `<div class="tab-content">${tabContent}</div>`;
  // https://github.com/volantis-x/hexo-theme-volantis/issues/703
  return `<div class="tabs" id="tab-${tabName.toLowerCase().split(' ').join('-')}">${tabNav + tabContent}</div>`;
}

hexo.extend.tag.register('tabs', postTabs, { ends: true });
hexo.extend.tag.register('subtabs', postTabs, { ends: true });
hexo.extend.tag.register('subsubtabs', postTabs, { ends: true });
