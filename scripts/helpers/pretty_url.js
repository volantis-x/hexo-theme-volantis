'use strict';

// 站点 _config.yml 推荐配置：
// pretty_urls:
//   trailing_index: false # Set to false to remove trailing 'index.html' from permalinks
//   trailing_html: false # Set to false to remove trailing '.html' from permalinks


hexo.extend.helper.register('pretty_url', function (path = '') {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // 如果是绝对 URL，直接返回
    return path;
  }
  
  let url = this.url_for(path);

  // 替换 /index.html → /            这是文件夹
  url = url.replace(/\/index\.html$/, '/');

  // 替换 /about.html → /about       这是文件
  url = url.replace(/\.html$/, '');


  // 去除多余斜杠（避免 // 出现，但保留://协议部分）
  url = url.replace(/([^:]\/)\/+/g, '$1');

  return url;
});
