module.exports = (hexo, option) => {
  const { config } = hexo;

  return {
    "@context": "http://schema.org",
    "@type": "Person",
    name: option.person.name,
    image: {
      "@type": "ImageObject",
      url: option.logo.path,
    },
    url: option.person.url,
    sameAs: option.person.sns,
    description: option.person.description,
  };
};
