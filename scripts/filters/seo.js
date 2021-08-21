// SEO 相关 (/滑稽)

hexo.extend.filter.register('after_render:html', function (data) {
  // img 设置默认 alt https://web.dev/image-alt/
  data = data.replace(/<img(.*?)>/gi, function (str, p) {
    if (p && !str.includes('alt=')) {
      str = str.replace(p, p + ' alt="Volantis" ');
    }
    return str
  });
  // a 设置默认 href 确保链接可供抓取  https://developers.google.com/search/docs/advanced/guidelines/links-crawlable
  data = data.replace(/<a(.*?)>/gi, function (str, p) {
    if (!p) {
      str = `<a href="/" onclick="return false;" title="Volantis">`
    }
    if (p && !str.includes('href=')) {
      str = str.replace(p, p + ' href="/" onclick="return false;" title="Volantis" ');
    }
    return str
  });
  return data;
});
