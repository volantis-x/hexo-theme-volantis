function getType(file) {
  var filename = file;
  var index1 = filename.lastIndexOf(".");
  var index2 = filename.length;
  var type = filename.substring(index1 + 1, index2);
  return type;
}
function getLink_preload(Url) {
  return `<link rel="preload" href="${Url}" as="font" type="font/${getType(Url)}" crossorigin="anonymous">\n`
}

hexo.extend.helper.register("generate_preload_fontfamily", function (theme) {
  const hexo = this;
  let preload = "";
  if (theme.custom_css.fontfamily.logofont && theme.custom_css.fontfamily.logofont.url) {
    preload += getLink_preload(theme.custom_css.fontfamily.logofont.url)
  }
  if (theme.custom_css.fontfamily.bodyfont && theme.custom_css.fontfamily.bodyfont.url) {
    preload += getLink_preload(theme.custom_css.fontfamily.bodyfont.url)
  }
  return preload
});
