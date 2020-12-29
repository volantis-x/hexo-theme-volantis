/**
 * frame.js | https://github.com/volantis-x/hexo-theme-volantis
 */

'use strict';

// frame 带有设备模型的图片或视频
// {% frame device | img=xxx %}
// {% frame device | img=xxx | part=top %}
// {% frame device | img=xxx | part=bottom %}
// {% frame device | video=xxx %}
// {% frame device | video=xxx | part=top %}
// {% frame device | video=xxx | part=bottom %}
// device: iphone11,
hexo.extend.tag.register('frame', function(args) {
  args = args.join(' ').split(' | ');
  // 所有支持的参数
  const device = args[0].trim();
  let img = '';
  let video = '';
  let part = '';
  let alt = '';
  // 解析
  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const tmp = args[i].trim();
      if (tmp.includes('img=')) {
        img = tmp.substring(4, tmp.length);
      } else if (tmp.includes('video=')) {
        video = tmp.substring(6, tmp.length);
      } else if (tmp.includes('part=')) {
        part = tmp.substring(5, tmp.length);
      } else if (tmp.includes('alt=')) {
        alt = tmp.substring(4, tmp.length);
      }
    }
  }
  if ((img.length == 0 && video.length == 0) || device.length == 0) {
    return;
  }
  let ret = '';
  function imgTag(url, alt) {
    let i = '';
    i += '<img class="img" src="' + url + '"';
    if (alt.length > 0) {
      i += ' alt="' + alt + '"';
    }
    i += '/>';
    return i;
  }
  if (video.length > 0) {
    ret += '<div class="video-wrap">';
    ret += '<div class="frame-wrap" id="' + device + '"';
    if (part.length > 0) {
      ret += 'part="' + part + '">';
    } else {
      ret += '>';
    }
    ret += '<video';
    if (img.length > 0) {
      ret += ' poster="' + img + '"';
    }
    ret += ' playsinline="" muted="" loop="" autoplay="" preload="metadata">';
    ret += '<source src="' + video + '" type="video/mp4">';
    ret += '</video>';

    ret += '<div class="frame"></div>';
    ret += '</div>';
    ret += '</div>';
  } else if (img.length > 0) {
    ret += '<div class="img-wrap">';
    ret += '<div class="frame-wrap" id="' + device + '"';
    if (part.length > 0) {
      ret += 'part="' + part + '">';
    } else {
      ret += '>';
    }
    ret += imgTag(img, alt);
    ret += '<div class="frame"></div>';
    ret += '</div>';
    if (alt.length > 0) {
      ret += '<span class="image-caption">' + alt + '</span>';
    }
    ret += '</div>';
  }
  return ret;
});
