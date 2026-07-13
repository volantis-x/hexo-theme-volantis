hexo.extend.generator.register('404', function (locals) {
  const { site_tree } = hexo.theme.config
  return {
    path: site_tree.error_page['404'],
    layout: ['404'],
    data: {
      layout: '404',
      menu_id: site_tree.error_page.menu_id
    }
  }
})
