// Custom Files 自定义文件   --- Modified From NexT ---

const fs = require('hexo-fs');
const path = require('path');
const defaultExtname = '.ejs';
let points = {
  styles: [
    "first",
    "style",
    "dark",
    "darkVar",
  ],
  views: [
    "head",
    "header",
    "side",
    "topMeta",
    "bottomMeta",
    "footer",
    "postEnd",
    "bodyEnd",
  ]
}
// hexo s 和 hexo server 时监听自定义文件变动
function watchFile(path) {
  let arg = process.argv[2];
  if (arg == "s" || arg == "server") {
    fs.watch(path)
  }
}
hexo.extend.filter.register('theme_inject', injects => {

  let filePath = {}
  points.styles.forEach(key => {
    filePath[key] = "source/_volantis/" + key + ".styl"
  });
  points.views.forEach(key => {
    filePath[key] = "source/_volantis/" + key + defaultExtname
  });
  filePath = hexo.merge(filePath, hexo.theme.config.custom_files)
  // console.log(filePath);
  // console.log(hexo.theme.config.custom_files);


  points.styles.forEach(key => {
    if (filePath[key]) {
      injects[key].push(filePath[key]);
    }
  });
  points.views.forEach(key => {
    if (filePath[key]) {
      injects[key].file('custom', filePath[key]);
    }
  });
}, 99);
hexo.extend.helper.register('volantis_inject', function (point) {
  if (this.theme.injects[point]) {
    return this.theme.injects[point]
      .map(item => this.partial(item.layout, item.locals, item.options))
      .join('');
  }
  return []
});
hexo.on('generateBefore', function () {
  hexo.theme.config.custom = {};
  // Defining stylus types
  class StylusInject {
    constructor(base_dir) {
      this.base_dir = base_dir;
      this.files = [];
    }
    push(file) {
      // Get absolute path base on hexo dir
      let temp_path = path.resolve(this.base_dir, file)
      watchFile(temp_path)
      if (fs.existsSync(temp_path)) {
        this.files.push(temp_path);
      }
    }
  }
  // Defining view types
  class ViewInject {
    constructor(base_dir) {
      this.base_dir = base_dir;
      this.raws = [];
    }
    raw(name, raw, ...args) {
      // Set default extname
      if (path.extname(name) === '') {
        name += defaultExtname;
      }
      this.raws.push({ name, raw, args });
    }
    file(name, file, ...args) {
      // Set default extname from file's extname
      if (path.extname(name) === '') {
        name += path.extname(file);
      }
      // Get absolute path base on hexo dir
      let temp_path = path.resolve(this.base_dir, file)
      let temp_raw = ""
      watchFile(temp_path)
      if (fs.existsSync(temp_path)) {
        temp_raw = fs.readFileSync(temp_path)
      }
      this.raw(name, temp_raw, ...args);
    }
  }
  // Init injects
  function initInject(base_dir) {
    const injects = {};
    points.styles.forEach(item => {
      injects[item] = new StylusInject(base_dir);
    });
    points.views.forEach(item => {
      injects[item] = new ViewInject(base_dir);
    });
    return injects;
  }
  hexo.theme.config.injects = {};
  const injects = initInject(hexo.base_dir);
  hexo.execFilterSync('theme_inject', injects);
  points.styles.forEach(type => {
    hexo.theme.config.injects[type] = injects[type].files;
  });
  // Inject views
  points.views.forEach(type => {
    const configs = Object.create(null);
    hexo.theme.config.injects[type] = [];
    // Add or override view.
    injects[type].raws.forEach((injectObj, index) => {
      const name = `inject/${type}/${injectObj.name}`;
      hexo.theme.setView(name, injectObj.raw);
      configs[name] = {
        layout: name,
        locals: injectObj.args[0],
        options: injectObj.args[1],
        order: injectObj.args[2] || index
      };
    });
    // Views sort.
    hexo.theme.config.injects[type] = Object.values(configs).sort((x, y) => x.order - y.order)
    // console.log(injects);
  });
});



