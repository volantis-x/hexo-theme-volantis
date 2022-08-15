const { version } = require('../../../package.json');
const theme_version = version;
const path = require('path')
const site_root = hexo.config.root;
const cdn_info = hexo.render.renderSync({ path: path.join(hexo.theme_dir, '/_cdn.yml'), engine: 'yaml' })

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

const minFile = (file) => {
  return file.replace(/(?<!\.min)\.(js|css)$/g, ext => '.min' + ext)
}

// 匹配 CDN 资源
function match_cdn_source(key) {
  if (key && cdn_info[key]) {
    const info = cdn_info[key];
    const system_config = hexo.theme.config.cdn_system.system_config;
    for (const iterator of system_config.priority) {
      if (iterator === "custom") {
        if (system_config.custom) {
          const r = system_config.custom[info.name];
          if (r) {
            return r;
          }
        }
      } else {
        if (info[iterator] === true) {
          const prefix = system_config[iterator].prefix?.replace(/\$\{site_root\}/g, site_root);
          const format = system_config[iterator].format;
          const name = info.name;
          let file = info.file;
          if (iterator === "cdnjs") {
            file = file.replace(/^[lib|dist]*\/|browser\//g, '')
          }
          if (info.local === true) {
            file = file.replace(/^source\//g, '')
          }
          const min_file = minFile(file)
          let version = info.version;
          if (info.local === true) {
            version = theme_version
          }
          const value = {
            version,
            name,
            file,
            min_file,
            prefix,
          }
          return format.replace(/\$\{(.+?)\}/g, (match, $1) => value[$1])
        }
      }
    }
  }
  return null;
}

// 收集 CDN 资源
function collect_cdn_source() {
  hexo.theme.config.cdn1 = {}
  Object.keys(cdn_info).forEach(e => {
    hexo.theme.config.cdn1[e] = match_cdn_source(e)
  })
  console.log(hexo.theme.config.cdn1);
}

hexo.on('generateBefore', () => {
  volantis_cdn_system_prefix(hexo.theme.config, hexo);
  // 可以在 source/_data/cdn.yml 覆盖 theme/_cdn.yml
  const data = hexo.locals.get('data');
  if (data.cdn) {
    merge(cdn_info, data.cdn);
  }
  collect_cdn_source();
});