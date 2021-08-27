// 标签插件样式按需加载
const fs = require("hexo-fs");
const Database = require('warehouse'); // https://hexojs.github.io/warehouse/

hexo.database.model("TagPluginCSS", new Database.Schema({
  _id: { type: String, required: true },
  data: { type: String }
}));

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

const renderStyl = (styList, callback) => {
  let stySet = new Set(styList)
  let tagPageStyleDir = "_style/_tag-plugins/"
  let tagPageStyle = `@import '_defines/*'\n`
  stySet.forEach(e => {
    tagPageStyle += `@import '` + tagPageStyleDir + e + `'` + "\n"
  })
  hexo.renderStylus(tagPageStyle).then(callback)
}

// 获取标签
hexo.extend.filter.register('before_post_render', function (data) {
  if (!hexo.theme.config.plugins.tag_plugin_load_on_demand.enable) {
    return data
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
  renderStyl(styList, (css) => {
    hexo.database.model('TagPluginCSS').insert({
      _id: uuidTagCSS,
      data: css,
    })
  })
  if (!hexo.locals.get('TagCSSAllPageFlag') && hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins) {
    hexo.locals.set('TagCSSAllPageFlag', function () {
      return 1
    });
    let styListAllPage = []
    hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins.forEach(e => {
      if (e in info) {
        info[e].forEach(x => {
          styListAllPage.push(x)
        })
      }
    })
    renderStyl(styListAllPage, (css) => {
      hexo.database.model('TagPluginCSS').insert({
        _id: "AllPage",
        data: css,
      })
    })
  }
  return data;
});
function getTagCSS(page) {
  let res = hexo.database.model('TagPluginCSS').find({ _id: page.uuidTagCSS })
  if (res && res.data && res.data[0] && res.data[0].data) {
    return res.data[0].data
  } else {
    let res = hexo.database.model('TagPluginCSS').find({ _id: "AllPage" })
    if (res && res.data && res.data[0] && res.data[0].data) {
      return res.data[0].data
    }
  }
}

hexo.extend.helper.register("TagCSS", getTagCSS);