
module.exports = (hexo, option) => {
  return {
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": option.organization.name,
    "url": option.organization.url,
    "logo": {
      "@type": "ImageObject",
      "url": option.logo.path,
      "width": option.logo.width,
      "height": option.logo.height
    }
  };
};
