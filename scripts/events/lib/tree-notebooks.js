
'use strict'

class NotePage {
  constructor(page) {
    this.id = page._id
    this.notebook = page.notebook
    this.title = page.title
    this.tags = page.tags
    this.path = page.path
    this.path_key = page.path.replace('.html', '')
    this.layout = page.layout
    this.date = page.date
    this.updated = page.updated || page.date

    const pin = page.pin ?? page.sticky ?? 0
    if (pin === true) {
      this.pin = 1
    } else if (pin === false) {
      this.pin = 0
    } else {
      this.pin = pin
    }
  }
}

function splitTag(tag) {
  return tag.split('/').filter(t => t.length > 0)
}

function prepareNotebook(id, info, ctx) {
  const notebook = info
  notebook.id = id

  if (notebook.base_dir) {
    if (notebook.base_dir.startsWith('/')) {
      notebook.base_dir = notebook.base_dir.substring(1)
    }
    if (notebook.base_dir.endsWith('/')) {
      notebook.base_dir = notebook.base_dir.substring(0, notebook.base_dir.length - 1)
    }
  } else {
    const notebooksBaseDir = ctx.theme.config.site_tree.notebooks.base_dir
    notebook.base_dir = notebooksBaseDir ? `${notebooksBaseDir}/${id}` : id
  }

  notebook.sort ||= 0
  notebook.auto_excerpt ||= 128
  notebook.per_page ??=  ctx.config.per_page ?? 10
  notebook.order_by ||= '-updated'

  notebook.sidebar ??= ctx.theme.config.sidebar.for.notes
  notebook.note_sidebar ??= ctx.theme.config.sidebar.for.note


  
  const tagMap = new Map() // tagId: tagInfo
  notebook.tagTree = tagMap

  const rootTag = {
    id: '',
    name: '',
    part: '',
    path: notebook.base_dir,
    parent: null, // parent tag id
    childSet: new Set(), // child tag ids
    noteSet: new Set(), // note ids
  }
  tagMap.set(rootTag.id, rootTag)

  // Iterate through all notes in the notebook, build the tag tree.
  const allPages = ctx.locals.get('pages')
  const pages = allPages.filter(p => p.notebook === notebook.id)
  for (const page of pages.data) {
    rootTag.noteSet.add(page._id)

    if (!page.tags) {
      continue
    }

    for (const hierarchyTag of page.tags) {
      const parts = splitTag(hierarchyTag)
      let parent = rootTag
      for (const part of parts) {
        const tagName = parent.name ? `${parent.name}/${part}` : part
        const tagId = tagName.toLowerCase()
        let tag = tagMap.get(tagId)
        if (tag == null) {
          tag = {
            id: tagId,
            name: tagName,
            part: part,
            path: `${notebook.base_dir}/tags/${tagId}`,
            parent: parent.id,
            childSet: new Set(),
            noteSet: new Set(),
          }
          tagMap.set(tagId, tag)
          parent.childSet.add(tagId)
        }

        tag.noteSet.add(page._id)
        parent = tag
      }
    }
  }

  notebook.noteMap = pages.map(p => new NotePage(p)).reduce((map, note) => {
    map.set(note.id, note)
    return map
  }, new Map())

  // Sort child tags for each tag.
  for (const [_, tag] of tagMap) {
    tag.children = Array.from(tag.childSet)
    tag.children.sort()
  }

  return notebook
}

function getNotebooksObject(ctx) {
  const notebooks = {
    tree: {},
  }

  const data = ctx.locals.get('data')
  const list = []
  for (const [key, info] of Object.entries(data)) {
    if (!key.startsWith('notebooks/') || key.endsWith('.DS_Store')) {
      continue
    }
    const id = key.substring(10)
    list.push(prepareNotebook(id, info, ctx))
  }
  list.sort((a, b) => a.sort - b.sort)
  for (const info of list) {
    notebooks.tree[info.id] = info
  }

  return notebooks
}

module.exports = ctx => {
  const notebooks = getNotebooksObject(ctx)
  ctx.theme.config.notebooks = notebooks
}
