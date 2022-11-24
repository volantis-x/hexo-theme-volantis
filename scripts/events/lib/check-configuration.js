module.exports =(hexo) => {
  try {
    let config = hexo.config;
    let themeConfig = hexo.theme.config;
    if (!config.title) {
      config.title = `Volantis`
      hexo.log.warn(`title 未配置！
请在站点配置 _config.yml 中配置 title
see: https://hexo.io/zh-cn/docs/configuration
title is not configured!`)
    }
    if (!config.description) {
      config.description = `Volantis 是一个功能丰富、高度模块化的 Hexo 博客主题。得益于其强大的模块化特性，您可以轻松搭建一个极简风格的博客，也可以仿照官网搭建一个多人协作的、包含文档模块的大体量综合型博客。`
      hexo.log.warn(`description 未配置！
请在站点配置 _config.yml 中配置 description
description主要用于SEO，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词。
see: https://hexo.io/zh-cn/docs/configuration
description is not configured!`);
    }
    if (themeConfig?.search?.service===`google`||themeConfig?.search?.service===`algolia`||themeConfig?.search?.service===`azure`||themeConfig?.search?.service===`baidu`) {
      return `原 google, algolia, azure, baidu 站内搜索 系祖传代码, 且文档丢失, 不便后续维护 在 5.0 版本被移除
The google, algolia, azure, baidu site search is ancestral code, and the document is lost, which is inconvenient for subsequent maintenance. It was removed in version 5.0
see: https://volantis.js.org/v5/theme-settings/#站内搜索`
    }
    if (`backstretch` in themeConfig?.plugins) {
      return `jquery.backstretch 在 5.0 版本被移除, 被 parallax 替代
jquery.backstretch was removed in version 5.0, replaced by parallax
see: https://volantis.js.org/v5/theme-settings/#幻灯片背景-视差滚动效果`
    }
    if ("valinecount" in themeConfig?.article?.body?.top_meta||"valinecount" in themeConfig?.article?.body?.bottom_meta||"valinecount" in themeConfig?.article?.body?.meta_library) {
      return `ValineCount 在 5.0 版本被移除
ValineCount has been removed in version 5.0
see: https://volantis.js.org/v5/theme-settings/#文章布局配置`
    }
    if (themeConfig?.comments?.service=="valine"||themeConfig?.comments?.service=="minivaline") {
      return `Valine 在 5.0 版本被移除
Valine has been removed in version 5.0
see: https://volantis.js.org/v5/theme-settings/#选择评论系统`
    }
  } catch (error) {}
  hexo.log.info(`Check environment configuration success!`);
  return true;
};

