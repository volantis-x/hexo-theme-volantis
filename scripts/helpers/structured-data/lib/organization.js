
module.exports = (hexo, option) => {
  return {
    "@context": "https://schema.org.cn",
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
