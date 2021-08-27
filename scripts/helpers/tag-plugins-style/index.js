// 标签插件样式按需加载
const fs = require("hexo-fs");
const Database = require('warehouse'); // https://hexojs.github.io/warehouse/

hexo.database.model("TagPluginCSS", new Database.Schema({
  _id: { type: String, required: true },
  data: { type: String }
}));

hexo.database.model("TagPluginOfPost", new Database.Schema({
  _id: { type: String, required: true },
  tags: { type: Array }
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
function getTagPluginCSSInfo() {
  let info = hexo.locals.get('TagPluginCSSInfo')
  if (!info) {
    info = fs.readFileSync(
      hexo.theme.context.theme_dir + "source/css/_style/_tag-plugins/tag.json"
    );
    info = JSON.parse(info)
    hexo.locals.set('TagPluginCSSInfo', function () {
      return info
    });
  }
  return info
}

function setTagPluginCSS(uuidTagCSS, css) {
  let TagPluginCSS = hexo.locals.get('TagPluginCSS')
  if (!TagPluginCSS) {
    TagPluginCSS = {}
  }
  TagPluginCSS[uuidTagCSS] = css
  hexo.locals.set('TagPluginCSS', function () {
    return TagPluginCSS
  });
}
function renderTagCSSAllPage(info) {
  let styListAllPage = []
  hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins.forEach(e => {
    if (e in info) {
      info[e].forEach(x => {
        styListAllPage.push(x)
      })
    }
  })
  renderStyl(styListAllPage, (css) => {
    setTagPluginCSS("AllPage", css)
  })

}
function insertTagCSS(uuidTagCSS, tagList) {
  let info = getTagPluginCSSInfo()
  let styList = []
  let tagListSave = []
  if (tagList) {
    tagList.forEach(e => {
      if (e in info) {
        info[e].forEach(x => {
          styList.push(x)
        })
        tagListSave.push(e)
      }
    })
  }
  hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins.forEach(e => {
    if (e in info) {
      info[e].forEach(x => {
        styList.push(x)
      })
      tagListSave.push(e)
    }
  })
  renderStyl(styList, (css) => {
    setTagPluginCSS(uuidTagCSS, css)
  })
  if (!hexo.locals.get('TagCSSAllPageFlag') && hexo.theme.config.plugins.tag_plugin_load_on_demand.plugins) {
    hexo.locals.set('TagCSSAllPageFlag', function () {
      return 1
    });
    renderTagCSSAllPage(info)
  }
  hexo.database.model('TagPluginOfPost').insert({
    _id: uuidTagCSS,
    tags: tagListSave,
  })
}

function updateTagCSS(uuidTagCSS) {
  // 这里在第二次刷新页面时生效
  let arg = process.argv[2];
  if (arg != "s" && arg != "server") {
    return
  }
  let info = getTagPluginCSSInfo()
  let res = hexo.database.model('TagPluginOfPost').find({ _id: uuidTagCSS })
  if (res && res.data && res.data[0] && res.data[0].tags) {
    let tags = res.data[0].tags;
    let styList = []
    tags.forEach(e => {
      if (e in info) {
        info[e].forEach(x => {
          styList.push(x)
        })
      }
    })
    renderStyl(styList, (css) => {
      setTagPluginCSS(uuidTagCSS, css)
    })
  } else {
    renderTagCSSAllPage(info)
  }
}

function generateTagCSS(data) {
  if (!hexo.theme.config.plugins.tag_plugin_load_on_demand.enable) {
    return data
  }
  let uuidTagCSS = hexo.createUuid()
  data.uuidTagCSS = uuidTagCSS
  let tagList = findTags(data._content)
  insertTagCSS(uuidTagCSS, tagList)
  return data;
}

function getTagCSS(page) {
  if (!hexo.theme.config.plugins.tag_plugin_load_on_demand.enable) {
    return
  }
  updateTagCSS(page.uuidTagCSS)
  let TagPluginCSS = hexo.locals.get('TagPluginCSS')
  if (TagPluginCSS) {
    if (TagPluginCSS[page.uuidTagCSS]) {
      return TagPluginCSS[page.uuidTagCSS]
    } else {
      return TagPluginCSS["AllPage"]
    }
  }
}
hexo.extend.filter.register("before_generate", function () {
  if (!hexo.theme.config.plugins.tag_plugin_load_on_demand.enable) {
    return
  }
  let arg = process.argv[2];
  if (arg != "s" && arg != "server") {
    return
  }
  // 只执行一次
  if (hexo.locals.get('TagCSSbeforeFlag')) {
    return
  }
  hexo.locals.set('TagCSSbeforeFlag', function () {
    return 1
  });
  let info = getTagPluginCSSInfo()
  hexo.database.model('TagPluginOfPost').forEach(x => {
    if (x.tags) {
      let tags = x.tags;
      let styList = []
      tags.forEach(e => {
        if (e in info) {
          info[e].forEach(x => {
            styList.push(x)
          })
        }
      })
      renderStyl(styList, (css) => {
        setTagPluginCSS(x._id, css)
      })
    }
  })
  renderTagCSSAllPage(info)
});
hexo.extend.filter.register('before_post_render', generateTagCSS)
hexo.extend.helper.register("TagCSS", getTagCSS);