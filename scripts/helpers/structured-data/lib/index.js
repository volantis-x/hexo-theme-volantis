const config = require("./config");

const WebSite = require("./website");
const Organization = require("./organization");
const Person = require("./person");
const BlogPosting = require("./blogposting");
const BreadcrumbList = require("./breadcrumblist");

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function merge(target, source) {
  for (const key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

module.exports = function () {
  const hexo = this;
  const option = merge(config(hexo), hexo.theme.structured_data.data);
  const builder = [Organization, Person, BreadcrumbList, WebSite, BlogPosting];
  const jsonld = JSON.stringify(builder.map((f) => f(hexo, option)));
  return `<script type="application/ld+json">${jsonld}</script>`;
};
