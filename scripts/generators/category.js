hexo.extend.generator.register('categories', function (locals) {
  const { site_tree } = hexo.theme.config;
  if (!site_tree.category.enable) return;
  const data = Object.assign({
      layout: 'category',
      index: true,
      title: "Categories",
      robots: "noindex,follow",
      sitemap: false,
      keywords: ["categorise"],
      description: "categories",
      meta: {
        header: [],
        footer: []
      },
      sidebar: [],
      date: "2020-1-1 1:1",
      content: ''
  }, site_tree.category.data||{});
  if (locals.categories && locals.categories.length > 0) {
    return {
      path: hexo.config.category_dir + '/index.html',
      layout: ['category'],
      data: data
    }
  } else {
    return {}
  }
})
