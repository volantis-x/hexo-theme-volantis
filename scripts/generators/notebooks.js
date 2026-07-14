hexo.extend.generator.register('notebooks', function (locals) {
  const { site_tree, notebooks } = hexo.theme.config
  if (!notebooks?.tree || Object.keys(notebooks.tree).length === 0) {
    return []
  }
  const noteBooksData = Object.assign({
      layout: 'notebooks',
      index: true,
      title: "Notebooks",
      robots: "noindex,follow",
      sitemap: false,
      keywords: ["notebooks"],
      description: "notebooks",
      meta: {
        header: [],
        footer: []
      },
      //sidebar: [],
      date: "2020-1-1 1:1",
      content: ''
  }, site_tree.notebooks.data||{});
  const noteData = Object.assign(notebooksData,{
      layout: 'notes',
  });
  // 不用 blog 和 notebooks 时不必依赖 hexo-pagination
  const pagination = require('hexo-pagination')

  function paginationWithEmpty(base, posts, options={}) {
    const { layout, data = {} } = options
    if (posts.length === 0) {
      base = `${base}/`
      return [{
        path: base,
        layout: layout,
        data: {
          ...data,
          base: base,
          total: 1,
          current: 1,
          current_url: base,
          posts: posts,
          prev: 0,
          prev_link: '',
          next: 0,
          next_link: '',
        }
      }]
    } else {
      return pagination(base, posts, options)
    }
  }

  const routes = []

  // The index page of all notebooks.
  routes.push({
    path: site_tree.notebooks.base_dir + '/index.html',
    layout: [noteBooksData.layout],
    data: noteBooksData
  })

  for (const notebook of Object.values(notebooks.tree)) {
    const pages = locals.pages.filter(p => notebook.noteMap.has(p._id)).sort(notebook.order_by)
    pages.data.sort((a, b) => notebook.noteMap.get(b._id).pin - notebook.noteMap.get(a._id).pin)

    // Note list pages (for every tag) of current notebook.
    for (const [_, tag] of notebook.tagTree) {
      const notes = pages.filter(p => tag.noteSet.has(p._id))
      const slices = paginationWithEmpty(tag.path, notes, {
        perPage: notebook.per_page,
        layout: ['notes'],
        data: {
          layout: 'notes',
          menu_id: notebook.menu_id,
          notebook: notebook.id,
          activeTag: tag.id,
        }
      })
      routes.push(...slices)
    }
  }

  return routes
})
