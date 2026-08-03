// chat 标签 工具函数

'use strict';

// 判断颜色是否合法 rgb rgba hex hsl hsla
function CheckIsColor(bgVal) {
  var type='';
  var color_mode = '';
  if(/^rgb\(/.test(bgVal)){
      //如果是rgb开头，200-249，250-255，0-199
      type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$";
      color_mode = 'rgb';
  }else if(/^rgba\(/.test(bgVal)){
      //如果是rgba开头，判断0-255:200-249，250-255，0-199 判断0-1：0 1 1.0 0.0-0.9
      type = "^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0.[0-9])[\\s]*[\)]{1}$";
      color_mode = 'rgba';
  }else if(/^#/.test(bgVal)){
      //六位或者三位
      type = "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"
      color_mode = 'hex';
  }else if(/^hsl\(/.test(bgVal)){
      //判断0-360 判断0-100%(0可以没有百分号)
      type = "^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$";
      color_mode = 'hsl';
  }else if(/^hsla\(/.test(bgVal)){
      type = "^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0.[0-9])[\\s]*)[\)]$";
      color_mode = 'hsla';
  }
  var re = new RegExp(type);
  if (bgVal.match(re) == null){
    return null
  }else{
    return color_mode
  }
}

// 颜色格式转换：hex ==> rgb
//使用
// hexToRGB("#27ae60ff"); // 'rgba(39, 174, 96, 255)'
// hexToRGB("27ae60");    // 'rgb(39, 174, 96)'
// hexToRGB("#fff");      // 'rgb(255, 255, 255)'
function hexToRgba(hex) {
  let alpha = false,
      h = hex.slice(hex.startsWith("#") ? 1 : 0);
  if (h.length === 3) h = [...h].map((x) => x + x).join("");
  else if (h.length === 8) alpha = true;
  h = parseInt(h, 16);
  let r = h >>> (alpha ? 24 : 16);
  let g = (h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8);
  let b = (h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0);
  let a = alpha ? h & 0x000000ff : 1;
  return {r, g, b, a}
}

function getRgbaValue(rgba_color) {
  if (rgba_color.indexOf('rgb') === 0) {
    if (rgba_color.indexOf('rgba') === -1)
      rgba_color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
    let [r,g,b,a] = rgba_color.match(/[\.\d]+/g).map(function (a) {
      return +a
    });
    return {
      r,
      g,
      b,
      a
    }
  } else {
    return {}
  }
}

function getHslaValue(hsla_color) {
  if (hsla_color.indexOf('hsl') === 0) {
    if (hsla_color.indexOf('hsla') === -1)
      hsla_color += ',1'; // convert 'hsl(R,G,B)' to 'hsl(R,G,B)A' which looks awful but will pass the regxep below
    let [h, s, l, a] = hsla_color.match(/[\.\d]+/g).map(function (a) {
      return +a
    });
    return {
      h,
      s,
      l,
      a
    }
  } else {
    return {}
  }
}

// 颜色格式转换：rgb ==> hsl
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let l = Math.max(r, g, b);
  let s = l - Math.min(r, g, b);
  let h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  h = 60 * h < 0 ? 60 * h + 360 : 60 * h;
  s = 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
  l = (100 * (2 * l - s)) / 2;
  return { h, s, l };
}

function dynamic_color(color, index, mark) {
  var colorType = CheckIsColor(color);
  if (colorType) {
    if (colorType == 'hex') {
      var {r,g,b,a} = hexToRgba(color);
      var {h,s,l} = rgbToHsl(r,g,b);
    } else if (colorType == 'rgb' || colorType == 'rgba') {
      var {r,g,b,a} = getRgbaValue(color);
      var {h,s,l} = rgbToHsl(r,g,b);
    } else if (colorType == 'hsl' || colorType == 'hsla') {
      var {h,s,l,a} = getHslaValue(color);
    }
    let light_bg = `hsl(${h}deg, 55%, 75%)`;
    let light_bg_2 = `hsl(${h}deg, 55%, 60%)`;
    let light_text_color = `hsl(${h}deg, 50%, 40%)`;
    let dark_bg = `hsl(${h}deg, 40%, 26%)`;
    let dark_bg_2 = `hsl(${h}deg, 40%, 40%)`;
    let dark_text_color = `hsl(${h}deg, 60%, 60%)`;
    let style_light = `--${mark}-label-bg-${index}: ${light_bg};--${mark}-label-bg-2-${index}: ${light_bg_2};--${mark}-label-text-color-${index}: ${light_text_color};`;
    let style_dark = `--${mark}-label-bg-${index}: ${dark_bg};--${mark}-label-bg-2-${index}: ${dark_bg_2};--${mark}-label-text-color-${index}: ${dark_text_color};`;
    let style_hover = `.${mark}-label-hover-${index}{color: var(--${mark}-label-text-color-${index}) !important;background: var(--${mark}-label-bg-${index}) !important;transition: all .2s ease-out;}.${mark}-label-hover-${index}:hover{background: var(--${mark}-label-bg-2-${index}) !important;}`;
    return {
      style_light: style_light,
      style_dark: style_dark,
      style_hover: style_hover
    }
  }
}

hexo.extend.helper.register("dynamic_color", dynamic_color);
