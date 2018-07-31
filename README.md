# Material X

> **⚠️声明：此主题是基于 [stkevintan/hexo-theme-material-flow](https://github.com/stkevintan/hexo-theme-material-flow) 改编**。
>
> 由于原作者已经将博客迁移至Hugo，作者的主题只进行bug修复，详见作者的 [README](https://github.com/stkevintan/hexo-theme-material-flow) 。



本主题将持续更新和维护，最新**Demo**：[https://blog.xaoxuu.com](https://blog.xaoxuu.com)

![screen shot 2017-10-24 at 1 47 17 pm](https://user-images.githubusercontent.com/16400144/31926581-fbe1debc-b8c1-11e7-93e7-ab08ce97ea61.png)

相对作者原主题主要有一下方面改动：

- 调整卡片阴影细节以及增加卡片的动画效果。
- 博文列表将作者的多列布局改为单列布局。
- 使用了 [fontawesome](http://fontawesome.io) 图标。
- 优化了颜色搭配，方便更换主题色。
- 一些UI细节，如调整搜索框长度使之与右边卡片等宽、优化了在手机端的显示效果。
- 增加对来必力评论系统的支持（虽然我用的是Disqus）。



### 评论

在博客主目录的`_config.yml`文件中添加以下代码即可：

```
# disqus评论
disqus_shortname: xaoxuu
# 来必力评论
# livere_shortname: xaoxuu
```



### 更多图片预览

![screen shot 2017-10-24 at 2 05 33 pm](https://user-images.githubusercontent.com/16400144/31926974-7932afca-b8c4-11e7-997f-3d9d28b5a08b.png)



![screen shot 2017-10-24 at 2 02 52 pm](https://user-images.githubusercontent.com/16400144/31927078-f7c74f26-b8c4-11e7-98c6-ac2987abd2fd.png)

![screen shot 2017-10-24 at 2 04 22 pm](https://user-images.githubusercontent.com/16400144/31927076-f47fb4d4-b8c4-11e7-9cbd-158e2c31d9e0.png)



## 安装
```bash
# change to work dir
cd /your_blog_dir/
# install dependencies
npm i -S hexo-generator-search hexo-generator-feed hexo-renderer-less hexo-autoprefixer hexo-generator-json-content
# download source
git clone https://github.com/xaoxuu/hexo-theme-material-x themes/material-x
```

## 配置
1. Change the value of `theme` to `material-x` in `_config.yml`.
2. Put your avatar && favicon  images to `source/images/`.
3. Edit `_config.yml` and `themes/material-x/_config.yml` for your needs.  

## More
Please refer to offical doc : <https://hexo.io/docs/index.html>
