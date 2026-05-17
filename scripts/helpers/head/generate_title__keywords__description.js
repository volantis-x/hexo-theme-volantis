function init(hexo, config, theme, page) {
  var title = page.seo_title || page.title;
  var keywords = page.keywords || "";
  var description = page.description || "";
  if (hexo.is_archive()) {
    title = hexo.__("navbar.archive");
    if (hexo.is_month()) {
      title += hexo.__("symbol.colon") + page.year + "/" + page.month;
    } else if (hexo.is_year()) {
      title += hexo.__("symbol.colon") + page.year;
    }
  } else if (hexo.is_category()) {
    title = hexo.__("navbar.category") + hexo.__("symbol.colon") + page.category;
  } else if (hexo.is_tag()) {
    title = hexo.__("navbar.tag") + hexo.__("symbol.colon") + page.tag;
  } else if (hexo.is_home() && page.prev == 0) {
    keywords = config.keywords || "";
    description = config.description || "";
    title = config.seo_title || config.title;
  } else {
    if (
      page.layout == "docs" &&
      page.group &&
      page.group in theme.sidebar.widget_library
    ) {
      let widget = theme.sidebar.widget_library[page.group];
      if (widget.class == "group" && widget.seo_title) {
        title = widget.seo_title + ": " + title;
      }
    }
  }
  if (theme.seo && theme.seo.use_tags_as_keywords) {
    if(!keywords){
    if (page.categories && page.categories.length > 0) {
      let categories = page.categories
        .map(function (tag) {
          return tag.name ? tag.name : tag;
        })
        .join(",");
      if (categories.length > 0) {
        keywords += categories;
      }
    }
    if (page.tags && page.tags.length > 0) {
      let tags = page.tags
        .map(function (tag) {
          return tag.name ? tag.name : tag;
        })
        .join(",");
      if (tags.length > 0) {
        keywords += ", ";
        keywords += tags;
      }
    }
    }
  }
  if (theme.seo && theme.seo.use_excerpt_as_description) {
    if (page.description == undefined) {
      if (page.excerpt) {
        description = hexo.truncate(hexo.strip_html(page.excerpt), { length: 160 });
      }
    }
  }
  return {
    title: title,
    keywords: keywords,
    description: description,
  };
}

hexo.extend.helper.register("generate_title", function (config, theme, page) {
  const hexo = this;
  let data = init(hexo, config, theme, page);
  let title = data.title
  let s = ""
  if (title) {
    s += `${title} - `
  }
  s += `${config.title}`
  s = hexo.strip_html(s)
  s = hexo.escape_html(s)
  return `<title>${s}</title>`
});

hexo.extend.helper.register("generate_keywords", function (config, theme, page) {
  const hexo = this;
  let data = init(hexo, config, theme, page);
  let keywords = data.keywords
  if (!(hexo.is_home() && page.prev == 0)) {
    if (keywords) {
      keywords += `,`
    }
    keywords += `${config.keywords}`
  }
  keywords = hexo.strip_html(keywords)
  keywords = hexo.escape_html(keywords)
  return `<meta name="keywords" content="${keywords}">`
});

hexo.extend.helper.register("generate_description", function (config, theme, page) {
  const hexo = this;
  let data = init(hexo, config, theme, page);
  let description = data.description
  if (!description) {
    if (config.description) {
      description = config.description
    } else {
      description = config.title
    }
  }
  description += ` - ${config.author} - ${config.title}`
  description = hexo.strip_html(description)
  description = hexo.escape_html(description)
  return `<meta desc name="description" content="${description}">`
});
// open_graph() 函数会生成一个 description 标签???  https://github.com/hexojs/hexo/blob/92b979f4a3fa8714aebd3d11c3295d466b870905/lib/plugins/helper/open_graph.js#L98
// 移除 open_graph() 函数会生成的 description
hexo.extend.filter.register('after_render:html', function (data) {
  data = data.replace(/<meta name="description".*>/g, "");
  return data;
}, 99);
