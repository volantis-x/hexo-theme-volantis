// yml string to list
// yml 太烂了

hexo.extend.helper.register('getList', function (list) {
  if (!list) return []
  if (typeof list == "string") {
    return [list]
  } else {
    return [...list]
  }
});