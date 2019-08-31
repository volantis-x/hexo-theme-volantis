# Material X

一个简约的卡片式Hexo博客主题。

![](https://img.vim-cn.com/52/a54815c02ce232f11f54b2c547c1337828833c.png)


#### 完全自由的模块化、易于定制化设计

- 可以自由决定每个页面是否需要封面、封面是否需要背景图片、多少图片、是否需要轮播、速度如何。
- 可以自由决定每个页面是否需要侧边栏、侧边栏小部件显示什么卡片、顺序如何。
- 可以自由决定每个页面的主体结构（默认文章+评论），可以按需增加卡片（与侧边栏小部件共用卡片库）。
- 可以自由决定每篇文章的meta标签（日期、更新日期、分类、标签、分享、阅读统计、置顶）显示与否、放置在文章开头还是末尾。标题、缩略图、小图标（用于归档页面）、页面专属的音乐播放器也算做meta标签，但是它们的位置固定。
- 大部分按钮可以自由设置图标、文字、target、nofollow等
- 方便更换主题色、自定义字体、边距、圆角、阴影等视觉效果，快速实现暗色主题。

#### 易于扩展

- 使用 [import](https://xaoxuu.com/wiki/material-x/config/#import) 字段方便导入css和js到主题中。

#### 移动端优化

- 针对移动端布局进行了大量优化。

#### 更多功能的支持

- 支持4种评论系统：Disqus、Gitalk、来必力和Valine评论。
- 提供主题CDN，也可自定义CDN。
- 使用卡片设计元素以及交互动效。
- 使用 fontawesome 5.6.3 免费版图标。
- 支持APlayer播放器，可以播放网易云、QQ音乐、虾米、酷狗平台以及其它服务器的音乐。
- 支持不蒜子阅读统计、百度分析、Google分析。
- 支持渲染MathJax数学公式，优化了渲染效果。



<br>

## 博客示例

| 博客                                | 源码                                   | 说明               |
| ----------------------------------- | -------------------------------------- | ------------------ |
| [@mxclub](https://mxclub.github.io) | https://github.com/xaoxuu/blog-example | master分支默认效果 |
| [@xaoxuu](https://xaoxuu.com)       | 暂未开源                               | myblog分支效果     |


- **更多示例请见 [#示例博客](https://github.com/xaoxuu/hexo-theme-material-x/issues/97)**



<br>

## 下载安装

### A. 使用脚本全自动安装（目前仅支持macOS）

1. 打开终端输入下面命令安装脚本，脚本文档见[#hexo.sh](https://xaoxuu.com/wiki/hexo.sh/)。
```bash
curl -s https://xaoxuu.com/install | sh -s hexo.sh
```

2. 安装成功后，在你的博客路径打开终端，输入下面命令即可安装主题和依赖包。
```bash
hexo.sh i x
```



### B. 手动安装

1. 下载主题到 `themes/` 文件夹
```bash
git clone https://github.com/xaoxuu/hexo-theme-material-x themes/material-x
```

2. 然后安装必要的依赖包
```bash
npm i -S hexo-generator-search hexo-generator-json-content hexo-renderer-less
```



<br>

## 文档

https://xaoxuu.com/wiki/material-x/
