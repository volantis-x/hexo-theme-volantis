hexo.extend.generator.register('tags', function (locals) {
  const { site_tree } = hexo.theme.config;
  if (!site_tree.tag.enable) return;
  const data = Object.assign({
      layout: 'tag',
      index: true,
      title: "Tags",
      robots: "noindex,follow",
      sitemap: false,
      keywords: ["tags"],
      description: "tags",
      meta: {
        header: [],
        footer: []
      },
      //sidebar: [],
      date: "2020-1-1 1:1",
      content: ''
  }, site_tree.tag.data||{});
  if (locals.tags && locals.tags.length > 0) {
    return {
      path: hexo.config.tag_dir + '/index.html',
      layout: [data.layout],
      data: data
    }
  } else {
    return {}
  }
})
