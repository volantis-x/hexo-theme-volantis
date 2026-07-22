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
      content: `<p class="p logo center huge">404</p><p class="p center bold">${__("error.what")}</p><p class="p center small">${__("error.why")}</p>`
  }, site_tree["404"].data||{});
  return {
    path: site_tree["404"].path,
    layout: [data.layout],
    data: data
  }
})
