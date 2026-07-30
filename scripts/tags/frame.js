/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * frame.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Frame iphone11 [img:src] [video:url] [focus:top/bottom] [alt] %}
 */

'use strict'

function Frame(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['focus', 'img', 'video'], ['device', 'alt'])
  const img = args.img || ''
  const video = args.video || ''
  const device = args.device || ''
  const focus = args.focus || ''
  const alt = args.alt || ''
  if ((img.length == 0 && video.length == 0) || device.length == 0) {
    return
  }
  var el = ''
  function imgTag(url, alt) {
    let i = ''
    i += '<img class="img" src="' + url + '"'
    if (alt.length > 0) {
      i += ' alt="' + alt + '"'
    }
    i += '/>'
    return i
  }
  if (video.length > 0) {
    el += '<div class="tag-plugin video-wrap">'
    el += '<div class="frame-wrap" id="' + device + '"'
    if (focus.length > 0) {
      el += 'focus="' + focus + '">'
    } else {
      el += '>'
    }
    el += '<video'
    if (img.length > 0) {
      el += ' poster="' + img + '"'
    }
    el += ' playsinline="" muted="" loop="" autoplay="" preload="metadata">'
    el += '<source src="' + video + '" type="video/mp4">'
    el += '</video>'

    el += '<div class="frame"></div>'
    el += '</div>'
    el += '</div>'
  } else if (img.length > 0) {
    el += '<div class="tag-plugin img-wrap">'
    el += '<div class="frame-wrap" id="' + device + '"'
    if (focus.length > 0) {
      el += 'focus="' + focus + '">'
    } else {
      el += '>'
    }
    el += imgTag(img, alt)
    el += '<div class="frame"></div>'
    el += '</div>'
    if (alt.length > 0) {
      el += '<span class="image-caption">' + alt + '</span>'
    }
    el += '</div>'
  }
  return el
}

hexo.extend.tag.register('Frame', Frame)



// v5
/**
 * frame.js | https://github.com/volantis-x/hexo-theme-volantis
 */

// frame 带有设备模型的图片或视频
// {% frame device | img=xxx %}
// {% frame device | img=xxx | part=top %}
// {% frame device | img=xxx | part=bottom %}
// {% frame device | video=xxx %}
// {% frame device | video=xxx | part=top %}
// {% frame device | video=xxx | part=bottom %}
// device: iphone11,
hexo.extend.tag.register('frame', function (args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(' | ');
  }
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
