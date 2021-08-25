const fs = require("hexo-fs");

const findTags = (data) => {
  dataList = data.match(/{% (\w*?)\W.*?%}/g)
  let tagSet = new Set()
  if (dataList) {
    dataList.forEach(e => {
      let tag = /{% (\w*?)\W.*?%}/g.exec(e)
      if (tag && tag[1].indexOf('end') != 0) {
        tagSet.add(tag[1])
      }
    });
  }
  return Array.from(tagSet)
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!hexo.theme.config.plugins.tag_plugin_load_on_demand.enable) {
    return data
  }
  if (!hexo.theme.mycss.TagCSS) {
    hexo.theme.mycss.TagCSS = {}
  }
  let uuidTagCSS = hexo.createUuid()
  data.uuidTagCSS = uuidTagCSS
  let tagList = findTags(data._content)
  let info = fs.readFileSync(
    hexo.theme.context.theme_dir + "source/css/_style/_tag-plugins/tag.json"
  );
  info = JSON.parse(info)
  let styList = []
  if (tagList) {
    tagList.forEach(e => {
      if (e in info) {
        info[e].forEach(x => {
          styList.push(x)
        })
      }
    })
  }
  hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins.forEach(e => {
    if (e in info) {
      info[e].forEach(x => {
        styList.push(x)
      })
    }
  })
  let stySet = new Set(styList)
  let tagPageStyleDir = "_style/_tag-plugins/"
  let tagPageStyle = `@import '_defines/*'\n`
  stySet.forEach(e => {
    tagPageStyle += `@import '` + tagPageStyleDir + e + `'` + "\n"
  })
  hexo.renderStylus(tagPageStyle).then((css) => {
    if (!hexo.theme.mycss.TagCSS) {
      hexo.theme.mycss.TagCSS = {}
    }
    hexo.theme.mycss.TagCSS[uuidTagCSS] = css;
  })
  if (!hexo.theme.mycss.TagCSS.allFlag && hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins) {
    hexo.theme.mycss.TagCSS.allFlag = 1
    let styListAll = []
    hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins.forEach(e => {
      if (e in info) {
        info[e].forEach(x => {
          styListAll.push(x)
        })
      }
    })
    let stySetAll = new Set(styListAll)
    let tagPageStyleDir = "_style/_tag-plugins/"
    let tagPageStyleAll = `@import '_defines/*'\n`
    stySetAll.forEach(e => {
      tagPageStyleAll += `@import '` + tagPageStyleDir + e + `'` + "\n"
    })
    hexo.renderStylus(tagPageStyleAll).then((css) => {
      hexo.theme.mycss.TagCSS["all"] = css;
    })
  }
  return data;
});
function getTagCSS(page) {
  try {
    if (page.uuidTagCSS in hexo.theme.mycss.TagCSS) {
      return hexo.theme.mycss.TagCSS[page.uuidTagCSS];
    } else {
      return hexo.theme.mycss.TagCSS["all"];
    }
  } catch (error) {
    console.error("=======================================");
    console.error("       需要执行 hexo clean");
    console.error("=======================================");
    throw error
  }
}
hexo.extend.helper.register("TagCSS", getTagCSS);