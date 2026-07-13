hexo.extend.generator.register('404', function (locals) {
  const { site_tree } = hexo.theme.config
  site_tree["404"].data.layout = site_tree["404"].layout;
  return {
    path: site_tree["404"].path,
    layout: [site_tree["404"].layout],
    data: site_tree["404"].data
  }
})
