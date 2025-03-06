// yml string to list
// yml 太烂了

hexo.extend.helper.register('getList', function (list) {
  return list ? (typeof list === "string" ? [list] : [...list]) : [];
});