module.exports = (hexo, option) => {
  const { config, page: post } = hexo;

  const blogposting = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    dateModified: post.updated.toISOString(),
    inLanguage: config.language,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.permalink,
    },
    author: {
      "@type": "Person",
      name: option.person.name,
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

  if (post.categories && post.categories.length) {
    blogposting.articleSection = post.categories.data[0].name;
  }

  if (post.tags && post.tags.length) {
    blogposting.keywords = post.tags.map((tag) => tag.name).join(",");
  }
  let image = post.headimg || "";
  if (image) {
    blogposting.image = {
      "@type": "ImageObject",
      url: image,
      width: 1024,
      height: 768,
    };
  }

  return blogposting;
};
