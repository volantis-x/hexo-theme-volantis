'use strict';

function postMenu(args, content) {
  args = args.join(' ').split(',')
  let text = args[0] || ''
  let icon = args[1] || ''
  if (icon.length > 0) {
    return `<div class='dropmenu'>
              <i class='${icon} fa-fw'></i>
              <span>${text}</span>
              <i class='fas fa-caret-down'></i>
              <ul class='list-v'>
                ${content}
              </ul>
            </div>`
  } else {
    return `<div class='dropmenu'>
              <span>${text}</span>
              <i class='fas fa-caret-down'></i>
              <ul class='list-v'>
                ${content}
              </ul>
            </div>`
  }
}
function postSubmenu(args, content) {
  args = args.join(' ').split(',')
  let text = args[0] || ''
  let icon = args[1] || ''
  if (icon.length > 0) {
    return `<li>
              <a>
                <i class='${icon} fa-fw'></i>
                ${text}
              </a>
              <ul class='list-v'>
                ${content}
              </ul>
            </li>`
  } else {
    return `<li>
              <a>${text}</a>
              <ul class='list-v'>
                ${content}
              </ul>
            </li>`
  }
}

function postMenuItem(args) {
  args = args.join(' ').split(',')
  let text = args[0] || ''
  let url = args[1] || ''
  text = text.trim()
  url = url.trim()
  if (url.length > 0) {
    url = "href='" + url + "'"
  }
  let icon = ''
  if (args.length > 2) {
    icon = args[2].trim()
  }
  if (url.length > 0) {
    if (icon.length > 0) {
      return `<li>
                <a ${url} title='${text}'>
                  <i class='${icon} fa-fw'></i>
                  ${text}
                </a>
              </li>`
    } else {
      return `<li>
                <a ${url} title='${text}'>
                  ${text}
                </a>
              </li>`
    }
  } else {
    if (text == 'hr') {
      return `<hr>`
    }
  }

}

hexo.extend.tag.register('menu', postMenu, {ends: true});
hexo.extend.tag.register('submenu', postSubmenu, {ends: true});
hexo.extend.tag.register('menuitem', postMenuItem);
