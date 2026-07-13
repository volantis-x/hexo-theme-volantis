'use strict';

hexo.extend.helper.register('pretty_url', function (path = '') {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // 如果是绝对 URL，直接返回
    return path;
  }
  
  let url = this.url_for(path);

  // 替换 /index.html → /
  url = url.replace(/\/index\.html$/, '/');

  // 替换 /about.html → /about
  url = url.replace(/\.html$/, '');


  // 去除多余斜杠（避免 // 出现，但保留://协议部分）
  url = url.replace(/([^:]\/)\/+/g, '$1');

  return url;
});
