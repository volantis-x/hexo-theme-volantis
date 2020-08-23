/**
 * image.js v4 | https://volantis.js.org
 */

'use strict';

// {% image url %}
// {% image url, alt=haha %}
// {% image url, width=50% %}
// {% image url, height=32px %}
// {% image url, bg=#eee %}
// {% image url, alt=haha, width=400px %}
// {% image url, alt=haha, width=400px, bg=#eee %}
hexo.extend.tag.register('image', function(args) {
  args = args.join(' ').split(', ');
  let url = args[0].trim();
  let result = '';
  result += '<img class="img" src="' + url + '"';
  let style = '';
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      let tmp = args[i].trim();
      if (tmp.includes('alt=')) {
        result += ' alt="' + tmp.substring(4, tmp.length) + '"';
      } else if (tmp.includes('width=')) {
        style += 'width:' + tmp.substring(6, tmp.length) + ';';
      } else if (tmp.includes('height=')) {
        style += 'height:' + tmp.substring(7, tmp.length) + ';';
      } else if (tmp.includes('bg=')) {
        result += ' bg="' + tmp.substring(3, tmp.length) + '"';
      }
    }
  }
  if (style.length > 0) {
    result += ' style="' + style + '"';
  }
  result += '/>';
  return result;
});


// {% inlineimage url %}
// {% inlineimage url, height=22px %}
hexo.extend.tag.register('inlineimage', function(args) {
  args = args.join(' ').split(', ');
  let url = args[0].trim();
  let result = '';
  result += '<img no-lazy class="inline" src="' + url + '"';
  let style = '';
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      let tmp = args[i].trim();
      if (tmp.includes('height=')) {
        style += 'height:' + tmp.substring(7, tmp.length) + ';';
      }
    }
  }
  if (style.length > 0) {
    result += ' style="' + style + '"';
  } else {
    result += ' style="height:1.5em"';
  }
  result += '/>';
  return result;
});
