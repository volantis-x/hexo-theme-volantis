// hexo.renderStylus 渲染 Stylus 的工具函数
// hexo.createUuid   创建 uuid

const stylus = require("stylus");
const Promise = require("bluebird");

module.exports = hexo => {
  hexo.renderStylus = async (str) => {
    /**************************************************************************** */
    // from https://github.com/hexojs/hexo-renderer-stylus/blob/8f63a5e1ad886466ce59532978dfa34b4b3c6dc7/lib/renderer.js#L5
    function getProperty(obj, name) {
      name = name.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "");
      const split = name.split(".");
      let key = split.shift();
      if (!Object.prototype.hasOwnProperty.call(obj, key)) return "";
      let result = obj[key];
      const len = split.length;
      if (!len) return result || "";
      if (typeof result !== "object") return "";
      for (let i = 0; i < len; i++) {
        key = split[i];
        if (!Object.prototype.hasOwnProperty.call(result, key)) return "";
        result = result[split[i]];
        if (typeof result !== "object") return result;
      }
      return result;
    }
    function defineConfig(style) {
      style.define("hexo-config", (data) => {
        return getProperty(hexo.theme.config, data.val);
      });
    }
    /**************************************************************************** */
    return new Promise((resolve) => {
      return stylus(str)
        .use(defineConfig)
        .include(hexo.theme.context.theme_dir + "source/css/")
        .render(function (err, css) {
          if (err) throw err;
          resolve(css);
          return css;
        });
    })
  }
  hexo.createUuid = () => {
    let s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join('');
  };
  hexo.merge = merge;
  hexo.getType = getType;
};
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function merge(target, source) {
  for (const key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
function getType(file){
  var filename=file;
  var index1=filename.lastIndexOf(".");
  var index2=filename.length;
  var type=filename.substring(index1+1,index2);
  return type;
}