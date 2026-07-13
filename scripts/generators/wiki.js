hexo.extend.generator.register('wiki', function (locals) {
  const { site_tree, wiki } = hexo.theme.config
  const wikiIdList = Object.keys(wiki.tree)
  if (wikiIdList.length == 0) {
    return {}
  }
  var ret = []
  ret.push({
    path: site_tree.index_wiki.base_dir + '/index.html',
    layout: ['index_wiki'],
    data: {
      layout: 'index_wiki',
      menu_id: site_tree.index_wiki.menu_id,
      filter: false
    }
  })
  if (wiki.all_tags) {
    for (let id of Object.keys(wiki.all_tags)) {
      let tag = wiki.all_tags[id]
      ret.push({
        path: tag.path,
        layout: ['index_wiki'],
        data: {
          layout: 'index_wiki',
          menu_id: site_tree.index_wiki.menu_id,
          filter: true,
          tagName: tag.name,
          title: tag.name
        }
      })
    }
  }
  return ret
})
