// 将首屏样式 first.styl 硬编码到HTML页面
"use strict";
const fs = require("hexo-fs");

function generateFirstCSS() {
  let s = fs.readFileSync(
    hexo.theme.context.theme_dir + "source/css/first.styl"
  );
  hexo.renderStylus(s).then((css)=>{
    hexo.locals.set('FirstCSS', function(){
      return css
    });
  })
}
function getFirstCSS() {
  return hexo.locals.get('FirstCSS');
}
hexo.extend.filter.register("before_generate", generateFirstCSS);
hexo.extend.helper.register("FirstCSS", getFirstCSS);
