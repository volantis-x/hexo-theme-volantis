hexo.extend.generator.register('404', function (locals) {
  const { site_tree } = hexo.theme.config;
  if (!site_tree["404"].enable) return;
  const data = Object.assign({
      layout: "page",
      body: ["article", "comments"],
      top_meta: false,
      bottom_meta: false,
      sidebar: [],
      index: false,
      robots: "noindex,nofollow",
      sitemap: false,
      date: "2020-1-1 1:1",
      content: '<p class="p logo center huge">404</p><p class="p center bold">很抱歉，您访问的页面不存在</p><p class="p center small">可能是输入地址有误或该地址已被删除</p>'
  }, site_tree["404"].data||{});
  return {
    path: site_tree["404"].path,
    layout: [data.layout],
    data: data
  }
})
