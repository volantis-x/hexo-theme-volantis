'use strict';

const fs = require('hexo-fs');

function lazyProcess(htmlContent, target) {
  const cfg = this.theme.config.plugins.lazyload;
  if (cfg == undefined || cfg.enable != true) {
    return htmlContent;
  }
  if (cfg.onlypost == true) {
    if (target != 'post') {
      return htmlContent;
    }
  }
  const loadingImg = cfg.loadingImg;
  return htmlContent.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, function(str, p1, p2) {
    // might be duplicate
    if (/data-srcset/gi.test(str)) {
      return str;
    }
    if (/src="data:image(.*?)/gi.test(str)) {
      return str;
    }
    if (/no-lazy/gi.test(str)) {
      return str;
    }
    let cls = '';
    if (str.indexOf('class=') > -1) {
      cls = str.substring(str.indexOf('class='));
      if (cls.length > 7) {
        const c = cls.substring(6, 7);
        cls = cls.split(c);
        if (cls.length > 1) {
          cls = cls[0] + '"' + cls[1] + '"';
        }
      }
    }
    let result = str;
    let newCls = '';
    if (cls.length > 0 && result.includes('class=')) {
      newCls = cls.replace(/(class=|[\"]*)/g, '') + ' ';
    }
    const oldCls = newCls.trim();
    if (loadingImg) {
      newCls += 'lazyload placeholder';
    } else {
      newCls += 'lazyload';
    }
    if (cls.length > 0) {
      result = result.replace('"' + oldCls + '"', '"' + newCls + '"');
    }
    if (loadingImg) {
      return result.replace(p2, p2 + '" class="lazyload placeholder" ' + 'data-srcset="' + p2 + '" srcset="' + loadingImg);
    }
    return result.replace(p2, p2 + '" class="lazyload" ' + 'data-srcset="' + p2 + '" srcset="' + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAADa6r/EAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=');

  });
}

module.exports.processPost = function(data) {
  data.content = lazyProcess.call(this, data.content, 'post');
  return data;
};

module.exports.processSite = function(htmlContent) {
  return lazyProcess.call(this, htmlContent, 'site');
};
