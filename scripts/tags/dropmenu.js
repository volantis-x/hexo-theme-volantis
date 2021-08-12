'use strict';

function postMenu(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  if (args.length == 1) {
    const title = args[0].trim();
    return `<div class='dropmenu-wrapper'>
              <div class='dropmenu'>
                <a>${title}</a>
                <ul class='list-v'>
                  ${content}
                </ul>
              </div>
            </div>`;
  } else if (args.length == 2) {
    const prefix = args[0].trim();
    const title = args[1].trim();
    return `<div class='dropmenu-wrapper'>
              <span>${prefix}</span>
              <div class='dropmenu'>
                <a>${title}</a>
                <ul class='list-v'>
                  ${content}
                </ul>
              </div>
            </div>`;
  } else if (args.length == 3) {
    const prefix = args[0].trim();
    const title = args[1].trim();
    const suffix = args[2].trim();
    return `<div class='dropmenu-wrapper'>
              <span>${prefix}</span>
              <div class='dropmenu'>
                <a>${title}</a>
                <ul class='list-v'>
                  ${content}
                </ul>
              </div>
              <span>${suffix}</span>
            </div>`;
  }
}
function postSubmenu(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  const text = args[0] || '';
  const icon = args[1] || '';
  if (icon.length > 0) {
    return `<li>
              <a class='menuitem'>
                <i class='${icon} fa-fw'></i>
                ${text}
              </a>
              <ul class='list-v'>
                ${content}
              </ul>
            </li>`;
  }
  return `<li>
              <a class='menuitem'>${text}</a>
              <ul class='list-v'>
                ${content}
              </ul>
            </li>`;

}

function postMenuItem(args) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  let text = args[0] || '';
  let url = args[1] || '';
  text = text.trim();
  url = url.trim();
  if (url.length > 0) {
    url = 'href=\'' + url + '\'';
  }
  let icon = '';
  if (args.length > 2) {
    icon = args[2].trim();
  }
  if (url.length > 0) {
    if (icon.length > 0) {
      return `<li>
                <a class='menuitem' ${url} title='${text}'>
                  <i class='${icon} fa-fw'></i>
                  ${text}
                </a>
              </li>`;
    }
    return `<li>
                <a class='menuitem' ${url} title='${text}'>
                  ${text}
                </a>
              </li>`;

  }
  if (text == 'hr') {
    return '<hr>';
  }


}

// {% menu 标题 %}
// {% menu 前缀, 标题 %}
// {% menu 前缀, 标题, 后缀 %}
hexo.extend.tag.register('menu', postMenu, {ends: true});
hexo.extend.tag.register('submenu', postSubmenu, {ends: true});
hexo.extend.tag.register('menuitem', postMenuItem);
