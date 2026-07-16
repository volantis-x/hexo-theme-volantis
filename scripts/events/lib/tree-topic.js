'use strict';

function getTopicTree(ctx) {
  var tree = {}
  const data = ctx.locals.get('data')
  var list = []
  for (let key of Object.keys(data)) {
    if (key.endsWith('.DS_Store')) {
      continue
    }
    if (key.startsWith('topic/') && key.length > 5) {
      let newKey = key.replace('topic/', '')
      let obj = data[key]
      obj.id = newKey
      if (obj.order_by == null) {
        obj.order_by = '-date'
      }
      if (obj.path == null) {
        obj.path = `/topic/${newKey}/`
      }
      obj.pages = []
      list.push(obj)
    }
  }
  for (let item of list) {
    tree[item.id] = item
  }
  return tree
}

module.exports = ctx => {
  var topic = ctx.locals.get('data').topic || {}
  // 专栏结构树
  topic.tree = getTopicTree(ctx)
  // 索引页显示的专栏列表
  if (topic.publish_list == null) {
    topic.publish_list = Object.keys(topic.tree)
  }
  ctx.theme.config.topic = topic
}
