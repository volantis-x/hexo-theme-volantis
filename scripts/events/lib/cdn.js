const { version } = require('../../../package.json');
const site_root = hexo.config.root;
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

// volantis_cdn_system_prefix
// 在本配置文件中 匹配以 "volantis-local/npm/static/cdnjs" 开头的链接路径替换为该格式的前缀开头 prefix
function volantis_cdn_system_prefix(source, hexo) {
  const prefix_list = ["local", "npm", "static", "cdnjs"];
  for (const key in source) {
    if (isObject(source[key])) {
      volantis_cdn_system_prefix(source[key], hexo);
    } else if (source[key] && typeof source[key] == "string") {
      for (const prefix of prefix_list) {
        if (source[key].match(new RegExp(`^volantis-${prefix}\/`, "g"))) {
          const my_prefix = hexo.theme.config.cdn_system.system_config[prefix].prefix.replace(/\$\{site_root\}/g, site_root)
          source[key] = my_prefix + source[key].replace(new RegExp(`^volantis-${prefix}`, "g"), "")
          break;
        }
      }
    } else if (source[key] && Array.isArray(source[key]) && source[key].length > 0) {
      source[key].forEach((item, index) => {
        if (item && typeof item == "string") {
          for (const prefix of prefix_list) {
            if (item.match(new RegExp(`^volantis-${prefix}\/`, "g"))) {
              const my_prefix = hexo.theme.config.cdn_system.system_config[prefix].prefix.replace(/\$\{site_root\}/g, site_root)
              source[key][index] = my_prefix + item.replace(new RegExp(`^volantis-${prefix}`, "g"), "")
              break;
            }
          }
        } else if (isObject(item)) {
          volantis_cdn_system_prefix(item, hexo);
        }
      })
    }
  }
}

hexo.on('generateBefore', () => {
  volantis_cdn_system_prefix(hexo.theme.config, hexo);
});