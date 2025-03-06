/* global hexo */

'use strict';

hexo.extend.filter.register('after_render:html', function(data) {
  if (hexo.theme.config.replace) {
    const replacements = hexo.theme.config.replace.map(e => {
      const [a, b] = e.split(" => ");
      return { regex: new RegExp(a, "g"), replacement: b };
    });

    replacements.forEach(({ regex, replacement }) => {
      data = data.replace(regex, replacement);
    });
  }
  return data;
}, 999999999999);