'use strict';

function postBtn(args) {
  args = args.join(' ').split(',')
  let cls = args[0].trim()
  let icon = ''
  let text = ''
  let url = ''
  if (args[1].indexOf('fas') > -1) {
    icon = args[1].trim()
    text = args[2].trim()
    url = args[3] || ''
  } else {
    text = args[1].trim()
    url = args[2] || ''
  }
  url = url.trim()
  if (url.length > 0) {
    url = "href='" + url + "'"
  }
  if (cls.length > 0) {
    cls = ' ' + cls
  }
  if (icon.length > 0) {
    return `<span class='btn${cls}'><a ${url} title='${text}'><i class='${icon}'></i>${text}</a></span>`;
  } else {
    return `<span class='btn${cls}'><a ${url} title='${text}'>${text}</a></span>`;
  }
}

hexo.extend.tag.register('btn', postBtn);
