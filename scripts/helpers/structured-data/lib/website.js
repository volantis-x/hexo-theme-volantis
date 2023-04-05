module.exports = (hexo,option) => {
  const { config } = hexo;

  return {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: option.website.name,
    url: option.website.url,
    keywords: option.website.keywords,
    description: option.website.description,
    author: {
      "@type": "Person",
      name: option.person.name,
      image: {
        "@type": "ImageObject",
        url: option.logo.path,
      },
      url: option.person.url,
      description: option.person.description,
    },
    publisher: {
      "@type": "Organization",
      name: option.organization.name,
      url: option.organization.url,
      logo: {
        "@type": "ImageObject",
        url: option.logo.path,
        width: option.logo.width,
        height: option.logo.height,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      name: option.website.search.name,
      target: {
        "@type": "EntryPoint",
        urlTemplate: option.website.search.url,
      },
      "query-input": option.website.search.query,
    },
  };
};
