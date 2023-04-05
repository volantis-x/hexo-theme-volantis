/* global hexo */

'use strict';

hexo.extend.filter.register('after_render:html', function(data) {
  if (hexo.theme.config.replace) {
    hexo.theme.config.replace.forEach(e => {
      let s = e.split(" => ")
      let a = s[0]
      let b = s[1]
      data = data.replace(new RegExp(a,"g"), b);
    });
  }
  return data;
},999999999999);
