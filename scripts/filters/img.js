/* global hexo */

'use strict';

const imgRegex = /<p><img src="(.*?)" alt="(.*?)"\/><\/p>/g;
const imgReplacement = '<div class="img-wrap"><div class="img-bg"><img class="img" src="$1" alt="$2"\/><\/div><span class="image-caption">$2<\/span><\/div>';

hexo.extend.filter.register('after_post_render', function(data) {
  data.content = data.content.replace(imgRegex, imgReplacement);
  return data;
});