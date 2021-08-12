'use strict';

// {% link title, url %}
// {% link title, url, img %}
hexo.extend.tag.register('link', function(args) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  let text = '';
  let url = '';
  let img = '';
  if (args.length < 2) {
    return;
  } else if (args.length == 2) {
    text = args[0].trim();
    url = args[1].trim();
  } else if (args.length == 3) {
    text = args[0].trim();
    url = args[1].trim();
    img = args[2].trim();
  }
  let result = '';
  // 发现如果不套一层 div 在其它可渲染 md 的容器中容易被分解
  result += '<div class="tag link"><a class="link-card" title="' + text + '" href="' + url + '">';
  // left
  result += '<div class="left">';
  result += '<img src="' + (img || hexo.theme.config.tag_plugins.link.placeholder) + '"/>';
  result += '</div>';
  // right
  result += '<div class="right"><p class="text">' + text + '</p><p class="url">' + url + '</p></div>';
  result += '</a></div>';

  return result;
});

hexo.extend.tag.register('linkgroup', function(args, content) {
  let ret = '';
  ret += '<div class="link-group">';
  ret += content;
  ret += '</div>';
  return ret;
}, {ends: true});
