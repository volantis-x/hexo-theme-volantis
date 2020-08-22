'use strict';

hexo.extend.filter.register('after_post_render', require('./lib/process').processPost);
hexo.extend.filter.register('after_render:html',  require('./lib/process').processSite);
