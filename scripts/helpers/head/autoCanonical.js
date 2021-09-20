/**
* hexo-auto-canonical
* https://github.com/hyunseob/hexo-auto-canonical.git
* Copyright (c) 2015, HyunSeob
* Licensed under the MIT license.
*/

'use strict';

hexo.extend.helper.register('autoCanonical', function (config, page) {
  var base_url = config.url;
  if (config.url.charAt(config.url.length - 1) !== '/') base_url += '/';

  return '<link rel="canonical" href="' + base_url + page.canonical_path.replace('index.html', '').toLowerCase() + '"/>';
});