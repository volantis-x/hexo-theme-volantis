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
    if (!keywords && page.tags && page.tags.length > 0) {
      let tags = page.tags
        .map(function (t) {
          return t.name;
        })
        .join(",");
      if (tags.length > 0) {
        keywords += tags;
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
  let s = "<title>"
  if (title) {
    s += `${title} - `
  }
  s += `${config.title}</title>`
  return s
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
  return `<meta name="keywords" content="${keywords}">`
});

hexo.extend.helper.register("generate_description", function (config, theme, page) {
  const hexo = this;
  let data = init(hexo, config, theme, page);
  let description = data.description
  if (!description) {
    if (config.description) {
      description = config.description
    }else{
      description = config.title
    }
  }
  description += ` - ${config.author} - ${config.title}`
  return `<meta desc name="description" content="${description}">`
});
// open_graph() 函数会生成一个 description 标签???  https://github.com/hexojs/hexo/blob/92b979f4a3fa8714aebd3d11c3295d466b870905/lib/plugins/helper/open_graph.js#L98
// 移除 open_graph() 函数会生成的 description
hexo.extend.filter.register('after_render:html', function(data) {
  data = data.replace(/<meta name="description".*>/g, "");
  return data;
},99);