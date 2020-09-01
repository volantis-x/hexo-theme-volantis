'use strict'; 
 
hexo.extend.filter.register('after_post_render', require('./lib/fancybox').processPost); 
hexo.extend.filter.register('after_render:html',  require('./lib/fancybox').processSite); 
