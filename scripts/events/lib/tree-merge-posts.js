
'use strict';

class RelatedPage {
  constructor(page) { 
    this.id = page._id
    this.wiki = page.wiki
    this.topic = page.topic
    this.title = page.title || page.short_title || page.seo_title
    this.path = page.path
    this.path_key = page.path.replace('.html', '')
    this.layout = page.layout
    this.date = page.date
    this.updated = page.updated
  }
}

module.exports = ctx => {
  var topic = ctx.theme.config.topic
  const posts = ctx.locals.get('posts')
  posts.sort('date').each(function(post) {
    let obj = new RelatedPage(post)
    // 合并拥有共同 topic 的文章到 topic.tree
    if (post.topic?.length > 0) {
      var topicObject = topic.tree[post.topic]
      if (topicObject) {
        obj.page_number = topicObject.pages.length + 1
        topicObject.pages.push(obj)
      }
    }
  })
  
  // topic homepage
  for (let tid of Object.keys(topic.tree)) {
    let topicObject = topic.tree[tid]
    if (topicObject.order_by == '-date') {
      topicObject.pages = topicObject.pages.reverse()
    }
    topicObject.homepage = topicObject.pages[0]
  }

}
