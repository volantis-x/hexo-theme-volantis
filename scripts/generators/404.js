hexo.extend.generator.register('404', function (locals) {
  const { site_tree } = hexo.theme.config
  return {
    path: site_tree.["404"].path,
    layout: [site_tree.["404"].layout],
    data: {}
  }
})
