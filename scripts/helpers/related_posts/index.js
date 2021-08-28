/**
 * https://github.com/tea3/hexo-related-popular-posts/wiki/More-Settings#customize-html
 */

'use strict';
var util = require('hexo-util');

// Examples of helper
hexo.extend.helper.register('htmlGenerator', function(args) {
  if (!args || !args.json || args.json.length == 0) return '';
  const cfg = hexo.theme.config.article.body.footer_widget.related_posts;
  var returnHTML = '';
  var div = `
  <div class="related_posts">
    <section class='header'>
      <i class="${cfg.icon} fa-fw" aria-hidden="true"></i><span>${cfg.title}</span>
    </section>
    <section class='body'>
      `;


  function generateHTML(list) {

    var ret = '';
    ret += '<a class="item" href="' + list.path + '" title="' + list.title + '" rel="bookmark ">';

    if (cfg.placeholder_img && cfg.placeholder_img.length > 0) {
      if (list.img && list.img != '') {
        ret += '<img src="' + list.img + '" />';
      } else {
        ret += '<img src="' + cfg.placeholder_img + '" />';
      }
    }

    ret += '<span class="title">' + list.title + '</span>';

    if (list.excerpt && list.excerpt.length > 0) {
      ret += '<span class="excerpt">' + util.truncate(util.stripHTML(list.excerpt), {length: 64}) + '</span>';
    }

    ret +=  '</a>';
    return ret;
  }

  for (var i = 0; i < args.json.length; i++) {
    returnHTML += generateHTML(args.json[i]);
  }


  if (returnHTML != '') returnHTML = '<div class="' + args.class + '">' + returnHTML + '</div>';
  div += returnHTML;
  div += '</section></div>';
  return div;
});
