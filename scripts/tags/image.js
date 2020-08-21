'use strict';

function postImage(args) {
  args = args.join(' ').split(',')
  let url = (args[0]||'').trim()
  let title = ''
  let width = ''
  let bg = 'fff0'
  function getP2(p2) {
    let px = p2.match(/^[0-9]*px$/g)
    let color = p2.match(/color=[\S]*/g)
    if (px) {
      width = px[0]
    } else if (color) {
      bg = '#' + color[0].replace(/color=[#]?/g, '')
      console.log(bg);
    } else {
      title = p2
    }
  }
  if (args.length > 3) {
    getP2(args[1].trim())
    getP2(args[2].trim())
    getP2(args[3].trim())
  } else if (args.length > 2) {
    getP2(args[1].trim())
    getP2(args[2].trim())
  } else if (args.length > 1) {
    getP2(args[1].trim())
  }
  if (width.length > 0) {
    if (title.length > 0) {
      return `<img bg='${bg}' src='${url}' alt='${title}' style='width:${width}'>`;
    } else {
      return `<img bg='${bg}' src='${url}' style='width:${width}'>`;
    }
  } else {
    if (title.length > 0) {
      return `<img bg='${bg}' src='${url}' alt='${title}'>`;
    } else {
      return `<img bg='${bg}' src='${url}'>`;
    }
  }
}

function postInlineImage(args) {
  args = args.join(' ').split(',')
  let url = (args[0]||'').trim()
  let height = '1.5em'
  function getP2(p2) {
    let px = p2.match(/^[0-9]*px$/g)
    if (px) {
      height = px[0]
    }
  }
  if (args.length > 1) {
    getP2(args[1].trim())
  }
  return `<img no-lazy class='inline' src='${url}' style='height:${height}'>`;
}


// {% image url %}
// {% image url, title %}
// {% image url, width(px) %}
// {% image url, title, width(px) %}
hexo.extend.tag.register('image', postImage);


// {% image-inline url %}
// {% image-inline url, height(px) %}
hexo.extend.tag.register('inlineimage', postInlineImage);
