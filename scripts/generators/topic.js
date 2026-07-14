hexo.extend.generator.register('index_topic', function (locals) {
  const { site_tree, topic } = hexo.theme.config
  const data = Object.assign({
      layout: 'index_topic',
      index: true,
      title: "Topic",
      // robots: "noindex,follow",
      // sitemap: false,
      keywords: ["topic"],
      description: "topic",
      meta: {
        header: [],
        footer: []
      },
      //sidebar: [],
      date: "2020-1-1 1:1",
      content: ''
  }, site_tree.index_topic.data||{});
  const topicIdList = Object.keys(topic.tree)
  if (topicIdList.length == 0) {
    return {}
  }  
  return {
    path: site_tree.index_topic.base_dir + '/index.html',
    layout: [data.layout],
    data: data
  }
})
