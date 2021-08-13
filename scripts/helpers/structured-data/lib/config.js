module.exports = function (hexo) {
  const {config} = hexo;
  return {
    person: {
      name: config.author,
      url: config.url + config.root,
      sns: [],
      description: config.description,
    },
    logo: {
      path: "https://cdn.jsdelivr.net/gh/volantis-x/cdn-org/blog/favicon/android-chrome-192x192.png",
      width: 192,
      height: 192,
    },
    organization: {
      name: config.title,
      url: config.url + config.root,
    },
    website: {
      name: config.title,
      url: config.url + config.root,
      keywords: config.keywords,
      description: config.description,
      search: {
        name: "Site Search",
        url: config.url + "?s={search_term_string}",
        query: "required name=search_term_string",
      },
    },
  };
};
