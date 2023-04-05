module.exports = (hexo, option) => {
  const { config, page: post } = hexo;

  const blogposting = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    headline: post.title || post.seo_title,
    description: post.description || hexo.strip_html(post.excerpt) || config.description,
    inLanguage: config.language,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.permalink,
    },
    author: {
      "@type": "Person",
      name: option.person.name,
      image: {
        "@type": "ImageObject",
        url: option.logo.path,
      },
      url: option.person.url,
    },
    publisher: {
      "@type": "Organization",
      name: option.organization.name,
      logo: {
        "@type": "ImageObject",
        url: option.logo.path,
        width: option.logo.width,
        height: option.logo.height,
      },
    },
    url: post.permalink,
  };

  blogposting.wordCount = hexo.strip_html(post.excerpt).length;

  if (post.date) {
    blogposting.datePublished = post.date.toISOString();
  }
  if (post.updated) {
    blogposting.dateModified = post.updated.toISOString();
  }
  if (post.categories && post.categories.length) {
    if (post.categories.data) {
      blogposting.articleSection = post.categories.data[0].name;
    } else {
      blogposting.articleSection = post.categories[0];
    }
  }

  if (post.tags && post.tags.length) {
    if (post.tags.data) {
      blogposting.keywords = post.tags.map((tag) => tag.name).join(",");
    } else {
      blogposting.keywords = post.tags.map((tag) => tag).join(",");
    }
  }
  let image = post.headimg || "";
  if (image) {
    blogposting.image = {
      "@type": "ImageObject",
      url: image,
      width: 1024,
      height: 768,
    };
  }else{
    blogposting.image = {
      "@type": "ImageObject",
      url: option.logo.path,
      width: option.logo.width,
      height: option.logo.height,
    };
  }

  return blogposting;
};
