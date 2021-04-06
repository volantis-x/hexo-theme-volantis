"use strict";
const stylus = require("stylus");
const fs = require("hexo-fs");
const Promise = require("bluebird");
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
function renderStylus(str) {
  stylus(str)
    .use(defineConfig)
    .include(hexo.theme.context.theme_dir + "source/css/")
    .render(function (err, css) {
      if (err) throw err;
      hexo.theme.FirstCSS = css;
    });
}
function generateFirstCSS() {
  let s = fs.readFileSync(
    hexo.theme.context.theme_dir + "source/css/first.styl"
  );
  renderStylus(s);
}
function getFirstCSS() {
  return hexo.theme.FirstCSS;
}
hexo.extend.filter.register("before_generate", generateFirstCSS);
hexo.extend.helper.register("getFirstCSS", getFirstCSS);
