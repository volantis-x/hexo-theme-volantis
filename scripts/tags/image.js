'use strict';

function postImage(args) {
  args = args.join(' ').split(',')
  let url = (args[0]||'').trim()
  let title = ''
  let width = ''
  function getP2(p2) {
    let px = p2.match(/^[0-9]*px$/g)
    if (px) {
      width = px[0]
    } else {
      title = p2
    }
  }
  if (args.length > 2) {
    getP2(args[1].trim())
    getP2(args[2].trim())
  } else if (args.length > 1) {
    getP2(args[1].trim())
  }
  if (width.length > 0) {
    if (title.length > 0) {
      return `<div class="fancybox caption">
                <img src='${url}' style='width:${width}'>
                <span class='image-caption'>${title}</span>
              </div>`;
    } else {
      return `<div class="fancybox caption">
                <img src='${url}' style='width:${width}'>
              </div>`;
    }
  } else {
    if (title.length > 0) {
      return `<div class="fancybox caption">
                <img src='${url}'>
                <span class='image-caption'>${title}</span>
              </div>`;
    } else {
      return `<div class="fancybox caption">
                <img src='${url}'>
              </div>`;
    }
  }
}

// {% image url %}
// {% image url, title %}
// {% image url, width(px) %}
// {% image url, title, width(px) %}
hexo.extend.tag.register('image', postImage);
