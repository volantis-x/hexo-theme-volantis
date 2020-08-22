/**
 * https://github.com/tea3/hexo-related-popular-posts/wiki/More-Settings#customize-html
 */

'use strict';
var util = require('hexo-util');

// Examples of helper
hexo.extend.helper.register('htmlGenerator', function(args){
  if (!args || !args.json || args.json.length == 0) return "";

  var returnHTML = "";

  function generateHTML(list){

    var ret = '';
    ret += '<a class="item" href="' + list.path + '" title="' + list.title + '" rel="bookmark ">';
    
    if (hexo.theme.config.article.body.footer_widget.related_posts.placeholder_img.length > 0) {
      if (list.img && list.img != "") {
        ret += '<img src="' + list.img + '" />';
      } else {
        ret += '<img src="' + hexo.theme.config.article.body.footer_widget.related_posts.placeholder_img + '" />';
      }
    }

    ret += '<span class="title">' + list.title + '</span>';

    if (list.excerpt && list.excerpt.length > 0) {
      ret += '<span class="excerpt">' + util.truncate(util.stripHTML(list.excerpt), {length: 64}) + '</span>';
    }

    ret +=  '</a>';
    return ret;
  }

  for(var i=0; i<args.json.length; i++){
      returnHTML += generateHTML(args.json[i]);
  }

  if (returnHTML != "") returnHTML = "<div class=\"" + args.class + "\">" + returnHTML + "</div>";

  return returnHTML;
});
