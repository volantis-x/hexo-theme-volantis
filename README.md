# Material-X

> **⚠️声明：此主题是基于 [stkevintan/hexo-theme-material-flow](https://github.com/stkevintan/hexo-theme-material-flow) 改编**。
>
> 由于原作者已经将博客迁移至Hugo，作者的主题只进行bug修复，详见作者的 [README](https://github.com/stkevintan/hexo-theme-material-flow) 。

本主题将持续更新和维护，你可以在这里查看主题的效果：👉 [https://blog.xaoxuu.com](https://blog.xaoxuu.com) 👈

相对作者原主题主要有一下方面改动：

- 调整卡片阴影细节以及增加卡片的动画效果。
- 博文列表将作者的多列布局改为单列布局。
- 使用了 [fontawesome](http://fontawesome.io) 图标。
- 优化了颜色搭配，方便更换主题色。
- 一些UI细节，如调整搜索框长度使之与右边卡片等宽、优化了在手机端的显示效果。
- 增加对来必力评论系统的支持。
- 增加了推荐文章列表，增加流量。



## 安装

提供两种安装方式：脚本和手动，脚本不仅可以安装主题，还可以方便你发布博客，详见 [@hexo.sh](https://github.com/xaoxuu/hexo.sh) 。



### A. 脚本安装【推荐】

首先打开终端，`cd`到你博客的路径，如果你想省事，复制下面这行脚本到终端中执行，全程自动化操作。

```bash
curl -O 'https://raw.githubusercontent.com/xaoxuu/hexo.sh/master/hexo.sh' -# && chmod 777 hexo.sh && . hexo.sh m x
```

如果你选择了脚本安装，现在可以直接往下看配置项啦~

### B. 手动安装

如果你想手动安装，第一步下载主题到`themes/`文件夹：

```bash
git clone https://github.com/xaoxuu/hexo-theme-material-x themes/material-x
```

然后安装依赖包：

```bash
npm i -S hexo-generator-search hexo-generator-feed hexo-renderer-less hexo-autoprefixer hexo-generator-json-content hexo-recommended-posts
```



## 博客配置项 

这一部分属于博客配置，要修改的文件是博客主目录的`_config.yml`文件。



### 头像

如果你没有设置头像，将会显示我的博客的头像作为默认头像，如果你不想显示任何头像，请自己修改主题。

```yaml
avatar: "https://xaoxuu.com/assets/img/avatar.jpg"
```
### 评论

如果你使用其他的评论系统，请自己修改主题。

```yaml
# disqus评论
disqus_shortname: #你的disqus的shortname#
# 来必力评论
livere_shortname: #你的disqus的shortname#
```

### 推荐文章

如果你不想显示推荐文章，请卸载 `hexo-recommended-posts` 这个依赖包。

```yaml
# 推荐文章
recommended_posts:
  autoDisplay: false # 自动在文章底部显示推荐文章，如果你使用Material-X主题，这里要设置为false。
  server: https://api.truelaurel.com # 后端推荐服务器地址
  timeoutInMillis: 10000 # 服务时长，超过此时长，则使用离线推荐模式
  excludePattern: []
  titleHtml: <h3>推荐文章</h3> #自定义标题
  internalLinks: 3 # 内部文章数量
  externalLinks: 2 # 外部文章数量
  fixedNumber: false
```

> 注意：autoDisplay: false 这一项不要修改，因为显示效果不佳，我已经在主题里给它设置显示位置了。



## 主题配置项

`themes/material-x/_config.yml` 这个才是主题的配置项，别搞错了哦。



### 导航栏

你可以找到类似这一段，把它改为你需要的：

```yaml
menu:
- name: 主页
  slug: about
  fa:   home
  url: https://xaoxuu.com
- name: 项目
  slug: projects
  fa:   cube
  url: https://xaoxuu.com/proj
- name: 博客
  slug: home
  fa:   rss
  url: /
- name: 归档
  slug: archives
  fa:   archive
  url: /archives
```

其中 `fa` 是 `font-awesome` 图标名，你要显示什么图标，去 [font-awesome](https://fontawesome.com/icons?d=gallery) 找就可以了。



### 自定样式

打开 `themes/material-x/source/less/_definess.less` 这个文件，修改下面这些内容为你需要的即可：

```yaml
// 主题色
@primary-color: @xiaowenwen-green;
// 强调色
@accent-color: @material-orange;
```



其他的暂时不想写了，自己摸索吧~
