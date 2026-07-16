hexo.extend.generator.register('wiki', function (locals) {
  const { site_tree, wiki } = hexo.theme.config
  const data = Object.assign({
      layout: 'index_wiki',
      index: true,
      title: "Wiki",
      robots: "noindex,follow",
      sitemap: false,
      keywords: ["wiki"],
      description: "wiki",
      meta: {
        header: [],
        footer: []
      },
      //sidebar: [],
      date: "2020-1-1 1:1",
      content: ''
  }, site_tree.index_wiki.data||{});
  if (wiki.shelf.length == 0) {
    return {}
  }
  const wikiIdList = Object.keys(wiki.tree)
  if (wikiIdList.length == 0) {
    return {}
  }
  var ret = []
  ret.push({
    path: site_tree.index_wiki.base_dir + '/index.html',
    layout: [data.layout],
    data: Object.assign(data,{
      filter: false
    })
  })
  /*// wiki tag 页面 
  if (wiki.all_tags) {
    for (let id of Object.keys(wiki.all_tags)) {
      let tag = wiki.all_tags[id]
      ret.push({
        path: tag.path,
        layout: [data.layout],
        data: Object.assign(data,{
          filter: true,
          tagName: tag.name,
          title: tag.name
        })
      })
    }
  }*/
  return ret
})
