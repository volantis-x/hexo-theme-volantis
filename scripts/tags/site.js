'use strict';

function postSiteCardGroup(args, content) {
  if (args.length > 0) {
    return `<div class="site-card-group"><p class='p h2'>${args}</p>${content}</div>`;
  } else {
    return `<div class="site-card-group">${content}</div>`;
  }
}
function postSiteCard(args) {
  args = args.join(' ').split(',')
  let link = args[0].trim()
  let img = args[1].trim()
  let title = args[2].trim()
  
  if (args.length > 3) {
    let desc = args[3].trim()
    return `<div class='site-card'>
      <a href='${link}'>
        <div class='img'>
          <img src='${img}'/>
        </div>
        <div class='info'>
          <span class='title'>${title}</span>
          <span class='desc'>${desc}</span>
        </div>
      </a>
    </div>`;
  } else if (args.length == 3) {
    return `<div class='site-card'>
      <a href='${link}'>
        <div class='img'>
          <img src='${img}'/>
        </div>
        <div class='info'>
          <span class='title'>${title}</span>
        </div>
      </a>
    </div>`;
  }
}

// {% site link, img, title %}
// {% site link, img, title, description %}
hexo.extend.tag.register('site', postSiteCard);
hexo.extend.tag.register('sitegroup', postSiteCardGroup, {ends: true});