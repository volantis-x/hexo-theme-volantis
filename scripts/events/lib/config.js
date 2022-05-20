'use strict';

const { version } = require('../../../package.json');

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

// volantis_static_cdn
function volantis_static_cdn(source,hexo) {
  for (const key in source) {
    if (isObject(source[key])) {
      volantis_static_cdn(source[key],hexo);
    } else if(source[key] && typeof source[key] =="string") {
      if(source[key].match(/^volantis-static\//g)){
        source[key] = hexo.theme.config.volantis_static_cdn + source[key].replace(/^volantis-static\//g,"")
      }
    } else if(source[key] && Array.isArray(source[key]) && source[key].length>0) {
      source[key].forEach((item,index)=>{
        if(item && typeof item =="string") {
          if(item.match(/^volantis-static\//g)){
            source[key][index] = hexo.theme.config.volantis_static_cdn + item.replace(/^volantis-static\//g,"")
          }
        }else if (isObject(item)){
          volantis_static_cdn(item,hexo);
        }
      })
    }
  }
}

module.exports = hexo => {
  if (!hexo.locals.get) return;

  var data = hexo.locals.get('data');
  if (!data) return;

  /**
   * Merge configs from _data/volantis.yml into hexo.theme.config.
   * If `override`, configs in volantis.yml will rewrite configs in hexo.theme.config.
   * If volantis.yml not exists, merge all `theme_config.*` into hexo.theme.config.
   */

  if (data.volantis) {
    if (data.volantis.override) {
      hexo.theme.config = data.volantis;
    } else {
      merge(hexo.config, data.volantis);
      merge(hexo.theme.config, data.volantis);
    }
  } else {
    merge(hexo.theme.config, hexo.config.theme_config);
  }

  if (hexo.theme.config.cache && hexo.theme.config.cache.enable && hexo.config.relative_link) {
    hexo.log.warn('Since caching is turned on, the `relative_link` option in Hexo `_config.yml` is set to `false` to avoid potential hazards.');
    hexo.config.relative_link = false;
  }
  hexo.config.meta_generator = false;
  hexo.theme.config.getStartTime = Date.now();
  // Custom languages support. Introduced in NexT v6.3.0.
  if (data.languages) {
    var { language } = hexo.config;
    var { i18n } = hexo.theme;

    var mergeLang = lang => {
      i18n.set(lang, merge(i18n.get([lang]), data.languages[lang]));
    };

    if (Array.isArray(language)) {
      for (const lang of language) {
        mergeLang(lang);
      }
    } else {
      mergeLang(language);
    }
  }
  volantis_static_cdn(hexo.theme.config,hexo);
  hexo.theme.config.info.theme_version = version;
};
