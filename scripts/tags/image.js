/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * image.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Image src [alt] [width:400px] [bg:#eee] [download:true/false/url] [fancybox:true/false/url] [ratio] %}
 */

'use strict'

function Image(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['width', 'height', 'bg', 'download', 'padding', 'fancybox', 'ratio'], ['src', 'alt'])
  var style = ''
  if (args.width) {
    style += 'width:' + args.width + ';'
  }
  if (args.height) {
    style += 'height:' + args.height + ';'
  }
  // fancybox
  var fancybox = false
  var fancyboxHref = null
    // 主题配置
    if (ctx.theme.config.tag_plugins.Image && ctx.theme.config.tag_plugins.Image.fancybox) {
      fancybox = ctx.theme.config.tag_plugins.Image.fancybox
    }
    // 覆盖配置
    if (args.fancybox && args.fancybox.length > 0) {
      if (args.fancybox == 'false') {
        fancybox = false
      } else if (args.fancybox === 'true') {
        fancybox = args.fancybox
      } else {
        fancybox = true
        fancyboxHref = args.fancybox
      }
    }
  

  function img(src, alt, style) {
    let a = '<a data-fancybox'
    let img = ''
    img += `<img class="lazy" src="${src}" data-src="${src}"`
    if (alt) {
      img += ` alt="${alt}"`
      a += ` data-caption="${alt}"`
    }
    if (fancybox && !fancyboxHref) {
      img += `fancybox data-fancybox="${fancybox}"`
    }
    if (style.length > 0 && !args.ratio) {
      img += ' style="' + style + '"'
    }
    img += `onerror="this.src=&quot;${ctx.theme.config.default.image_onerror}&quot;"`
    img += '/>'
    // loading
    img += `<div class="lazy-icon" style="background-image:url(${ctx.theme.config.default.loading});"></div>`
    if (fancyboxHref) {
      a += ` href="${fancyboxHref}">${img}</a>`
      return a
    }
    return img
  }

  var el = ''
  // wrap
  el += '<div class="tag-plugin image">'
  // bg
  el += `<div class="image-bg"`
  if (args.bg || args.padding || args.ratio || style) {
    el += ' style="'
    if (args.bg && args.bg.length > 0) {
      el += 'background:' + args.bg + ';'
    }
    if (args.padding) {
      el += 'padding:' + args.padding + ';'
    }
    if (args.ratio) {
      el += 'aspect-ratio:' + args.ratio + ';'
      if (style) {
        el += style
      }
    } else if (style) {
      // 如果设置了图片宽度，但没有长宽比，那背景区就要铺满宽度
      el += 'width:100%;'
    }
    el += '"'
  }
  el += '>'
  el += img(args.src, args.alt, style)
  if (args.download && args.download.length > 0) {
    let href = args.download
    if (args.download == 'true') {
      href = args.src
    }
    let download = ''
    if (args.alt) {
      download = ' download="' + args.alt + '"'
    }
    el += '<a class="image-download blur" style="opacity:0" target="_blank"' + download + ' href="' + href + '"><svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3734"><path d="M561.00682908 685.55838913a111.03077546 111.03077546 0 0 1-106.8895062 0L256.23182837 487.72885783a55.96309219 55.96309219 0 0 1 79.13181253-79.18777574L450.70357448 523.88101491V181.55477937a55.96309219 55.96309219 0 0 1 111.92618438 0v344.06109173l117.07478902-117.07478901a55.96309219 55.96309219 0 0 1 79.13181252 79.18777574zM282.81429711 797.1487951h447.70473912a55.96309219 55.96309219 0 0 1 0 111.92618438H282.81429711a55.96309219 55.96309219 0 0 1 0-111.92618438z" p-id="3735"></path></svg></a>'
  }
  el += '</div>'

  if (args.alt && args.alt.length > 0) {
    el += '<div class="image-meta">'
    el += '<span class="image-caption center">' + args.alt + '</span>'
    el += '</div>'
  }

  el += '</div>'
  return el
}


hexo.extend.tag.register('Image', Image)


// v5
/**
 * image.js v4 | https://volantis.js.org
 *
 */

// {% image url %}
// {% image url, alt=haha %}
// {% image url, width=50% %}
// {% image url, height=32px %}
// {% image url, bg=#eee %}
// {% image url, alt=haha, width=400px %}
// {% image url, alt=haha, width=400px, bg=#eee %}
hexo.extend.tag.register('image', function (args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  const url = args[0].trim();
  let alt = '';
  let bg = '';
  let style = '';
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      const tmp = args[i].trim();
      if (tmp.includes('alt=')) {
        alt = tmp.substring(4, tmp.length);
      } else if (tmp.includes('width=')) {
        style += 'width:' + tmp.substring(6, tmp.length) + ';';
      } else if (tmp.includes('height=')) {
        style += 'height:' + tmp.substring(7, tmp.length) + ';';
      } else if (tmp.includes('bg=')) {
        bg = tmp.substring(3, tmp.length);
      }
    }
  }
  function img(url, alt, style) {
    let img = '';
    img += '<img class="img" src="' + url + '"';
    if (alt.length > 0) {
      img += ' alt="' + alt + '"';
    } else {
      img += ' alt="image"';
    }
    if (style.length > 0) {
      img += ' style="' + style + '"';
    }
    img += '/>';
    return img;
  }

  let ret = '';
  // wrap
  ret += '<div class="img-wrap">';
  // bg
  ret += '<div class="img-bg"';
  if (bg.length > 0) {
    ret += ' style="background:' + bg + '"';
  }
  ret += '>';
  ret += img(url, alt, style);
  ret += '</div>';

  if (alt.length > 0) {
    ret += '<span class="image-caption">' + alt + '</span>';
  }

  ret += '</div>';
  return ret;
});


// {% inlineimage url %}
// {% inlineimage url, height=22px %}
hexo.extend.tag.register('inlineimage', function (args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  const url = args[0].trim();
  let ret = '';
  ret += '<img no-lazy class="inline" src="' + url + '"';
  let style = '';
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      const tmp = args[i].trim();
      if (tmp.includes('height=')) {
        style += 'height:' + tmp.substring(7, tmp.length) + ';';
      }
    }
  }
  if (style.length > 0) {
    ret += ' style="' + style + '"';
  } else {
    ret += ' style="height:1.5em"';
  }
  ret += '/>';
  return ret;
});
