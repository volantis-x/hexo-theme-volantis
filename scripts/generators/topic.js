hexo.extend.generator.register('index_topic', function (locals) {
  const { site_tree, topic } = hexo.theme.config
  const topicIdList = Object.keys(topic.tree)
  if (topicIdList.length == 0) {
    return {}
  }
  var ret = []
  ret.push({
    path: site_tree.index_topic.base_dir + '/index.html',
    layout: ['index_topic'],
    data: {
      layout: 'index_topic',
    }
  })
  return ret
})
