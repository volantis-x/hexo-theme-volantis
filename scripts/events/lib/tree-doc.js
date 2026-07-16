
'use strict';

class WikiPage {
  constructor(page) { 
    this.id = page._id
    this.wiki = page.wiki
    this.title = page.title || page.short_title //|| page.seo_title
    this.path = page.path
    this.path_key = page.path.replace('.html', '')
    this.layout = page.layout
    this.updated = page.updated
  }
}

function getWikiObject(ctx) {
  var wiki = { tree:{} }
  const data = ctx.locals.get('data')
  var list = []
  for (let key of Object.keys(data)) {
    if (key.endsWith('.DS_Store')) {
      continue
    }
    if (key.includes('wiki/') && key.length > 5) {
      let newKey = key.replace('wiki/', '')
      let obj = data[key]
      if ((typeof obj.tags == 'string') && obj.tags.constructor == String) {
        obj.tags = [obj.tags]
      }
      if ((typeof obj.tree == 'object') && obj.tree.constructor == Array) {
        obj.tree = { '': obj.tree }
      }
      obj.id = newKey
      if (obj.sort == null) {
        obj.sort = 0
      }
      if (obj.base_dir) {
        if (obj.base_dir.startsWith('/')) {
          obj.base_dir = obj.base_dir.substring(1)
        }
        if (obj.base_dir.length > 1 && obj.base_dir.endsWith('/') == false) {
          obj.base_dir = obj.base_dir + '/'
        }
      } else {
        obj.base_dir = ''
      }
      list.push(obj)
    }
  }
  list = list.sort((p1, p2) => p2.sort - p1.sort)
  for (let item of list) {
    wiki.tree[item.id] = item
  }
  return wiki
}

module.exports = ctx => {
  // wiki 配置
  var wiki = getWikiObject(ctx)
  const pages = ctx.locals.get('pages')
  // wiki 所有页面
  const wiki_pages = pages.filter(p => (p.wiki != null)).map(p => new WikiPage(p))
  const wiki_list = Object.keys(wiki.tree).filter(id => wiki_pages.some(p => p.wiki === id))
  // 上架的项目列表
  wiki.shelf = ctx.locals.get('data').wiki || []
  
  // 数据整合：项目标签
  var all_tag_name = []
  for (let id of wiki_list) {
    let item = wiki.tree[id]
    let tags = item.tags
    if (tags) {
      tags.forEach((tag, i) => {
        if (all_tag_name.includes(tag) === false) {
          all_tag_name.push(tag)
        }
      })
      wiki.tree[id].tags = tags
    }
  }

  // 补充项目名称和首页
  for (let id of wiki_list) {
    let item = wiki.tree[id]
    item.id = id
    if (item.title == undefined || item.title.length === 0) {
      item.title = id
    }
    if (item.name == undefined || item.name.length == 0) {
      item.name = id
    }
  }
  
  // 数据整合：每个项目的子页面
  for (let i = 0; i < wiki_list.length; i++) {
    let id = wiki_list[i];
    let item = wiki.tree[id]
    let sub_pages = wiki_pages.filter(p => p.wiki === id)

    // 首页
    // 未特别指定首页时，获取TOC第一页作为首页
    var homepage = item.homepage
    if (homepage == null && item.tree != null) {
      for (let id of Object.keys(item.tree)) {
        const sec = item.tree[id]
        for (let key of sec) {
          let hs = sub_pages.filter(p => p.path_key == item.base_dir + key)
          if (hs.length > 0) {
            homepage = hs[0]
            break
          }
        }
        if (homepage != null) {
          break
        }
      }
    }
    if (homepage == null) {
      homepage = sub_pages[0]
    }
    if (typeof homepage == 'string') {
      homepage = {path: homepage}
    }
    homepage.is_homepage = true
    item.homepage = homepage
    // 内页分组
    var sections = []
    var others = sub_pages
    if (item.tree) {
      // 根据配置设置顺序
      for (let title of Object.keys(item.tree)) {
        var sec = { title: title, pages: []}
        for (let key of item.tree[title]) {
          sec.pages = sec.pages.concat(sub_pages.filter(p => p.path_key == item.base_dir + key))
          others = others.filter(p => p.path_key != item.base_dir + key)
        }
        sections.push(sec)
      }
      if (others.length > 0 && others.filter(p => p.title?.length > 0).length > 0) {
        sections.push({
          title: '...',
          pages: others.sort((p1, p2) => p1.title - p2.title)
        })
      }
    } else {
      // 自动设置顺序
      sections.push({
        pages: sub_pages.sort((p1, p2) => p1.title - p2.title)
      })
    }
    
    // page number
    var page_number = 0
    for (let sec of sections) {
      for (let page of sec.pages) {
        page.page_number = page_number++
      }
    }
    item.sections = sections
    item.pages = sub_pages
  }
  
  // 全站所有的项目标签
  var all_tags = {}
  all_tag_name.forEach((tag_name, i) => {
    var items = []
    for (let id of wiki_list) {
      let item = wiki.tree[id]
      // 过滤掉找不到页面的项目
      if (item.homepage == null) {
        continue
      }
      // 过滤掉未上架的项目
      if (!wiki.shelf.includes(item.id)) {
        continue
      }
      if (item.tags && item.tags.includes(tag_name) === true && items.includes(tag_name) === false) {
        items.push(item.id)
      }
    }
    all_tags[tag_name] = {
      name: tag_name,
      path: (ctx.theme.config.site_tree.index_wiki.base_dir) + '/tags/' + tag_name + '/index.html',
      items: items
    }
  })

  // 关联相似项目
  for (let id of wiki_list) {
    let item = wiki.tree[id]
    if (item.tags) {
      var relatedItems = []
      item.tags.forEach((tag_name, i) => {
        let relatedOtherItems = all_tags[tag_name].items.filter(name => name != item.id)
        if (relatedOtherItems.length > 0) {
          relatedItems.push({
            name: tag_name,
            items: relatedOtherItems
          })
        }
      })
      item.relatedItems = relatedItems
    }
  }

  wiki.all_tags = all_tags
  wiki.all_pages = wiki_pages
  ctx.theme.config.wiki = wiki

}
