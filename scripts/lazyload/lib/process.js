/**
 * lazyload.js | https://github.com/ChrAlpha/hexo-theme-cards
 */

'use strict';

const fs = require('hexo-fs');

function lazyProcess(htmlContent)  {
  let loadingImg = this.config.lazyload.loadingImg;
  return htmlContent.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, function (str, p1, p2) {
    // might be duplicate
    if (/data-srcset/gi.test(str)){
        return str;
    }
    if (/src="data:image(.*?)/gi.test(str)) {
        return str;
    }
    if (/no-lazy/gi.test(str)) {
        return str;
    }
    if (loadingImg) {
      return str.replace(p2, p2 + '" class="lazyload placeholder" ' + 'data-srcset="' + p2 + '" srcset="' + loadingImg);
    } else {
      return str.replace(p2, p2 + '" class="lazyload" ' + 'data-srcset="' + p2 + '" srcset="' + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAADa6r/EAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=');
    }
  });
}

module.exports.processPost = function(data) {
  data.content = lazyProcess.call(this, data.content);
  return data;
};

module.exports.processSite = function (htmlContent) {
  return lazyProcess.call(this, htmlContent);
};
