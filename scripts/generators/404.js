hexo.extend.generator.register('404', function (locals) {
  const lang = hexo.config.language || 'en';
  const i18n = hexo.theme.i18n.data[lang];
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
      content: `<p class="p logo center huge">404</p><p class="p center bold">${i18n["error.what"]}</p><p class="p center small">${i18n["error.why"]}</p>`
  }, site_tree["404"].data||{});
  return {
    path: site_tree["404"].path,
    layout: [data.layout],
    data: data
  }
})
