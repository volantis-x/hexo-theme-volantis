/**
 * https://github.com/anuraghazra/github-readme-stats
 */

'use strict';

// {% ghcard volantis-x %}
// {% ghcard volantis-x/hexo-theme-volantis %}
hexo.extend.tag.register('ghcard', function(args) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  const path = args[0].trim();
  let card = '';
  card += '<a class="ghcard" rel="external nofollow noopener noreferrer" href="https://github.com/' + path + '">';
  let url = '';
  if (path.includes('/')) {
    // is repo
    const ps = path.split('/');
    url += 'https://github-readme-stats.vercel.app/api/pin/?username=' + ps[0] + '&repo=' + ps[1];
  } else {
    // is user
    url += 'https://github-readme-stats.vercel.app/api/?username=' + path;
  }
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      const tmp = args[i].trim();
      url += '&' + tmp;
    }
  }
  if (!url.includes('&show_owner=')) {
    url += '&show_owner=true';
  }
  card += '<img src="' + url + '"/>';
  card += '</a>';
  return card;
});

hexo.extend.tag.register('ghcardgroup', function(args, content) {
  let ret = '';
  // wrap
  ret += '<div class="ghcard-group">';
  ret += content;
  ret += '</div>';
  return ret;
}, {ends: true});
