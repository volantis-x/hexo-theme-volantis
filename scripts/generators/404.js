hexo.extend.generator.register('404', function (locals) {
  const { site_tree } = hexo.theme.config
  return {
    path: site_tree.404_page.path,
    layout: [site_tree.404_page.layout],
    data: {}
  }
})
