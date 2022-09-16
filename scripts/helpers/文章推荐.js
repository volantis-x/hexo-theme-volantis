const 文章库 = [];
const 语料库 = [];
let 标记 = null;

hexo.extend.filter.register('template_locals', function (本地变量) {
  const cfg = hexo.theme.config.article.body.footer_widget.recommended_article;
  if (!cfg.enable) {
    return 本地变量;
  }
  if (!标记) {
    标记 = 1
    获取数据(本地变量.site.posts, cfg)
    获取数据(本地变量.site.pages, cfg)
    文章推荐(cfg)
  }
  return 本地变量;
});

function 获取数据(s, cfg) {
  s.each(function (p) {
    if (["post", "docs"].includes(p.layout)) {
      文章库.push({
        path: p.path,
        title: p.title || p.seo_title || p.short_title,
        headimg: p.headimg || cfg.placeholder_img,
      })
      语料库.push(分词(p.raw))
    }
  })
}

function 数据清洗(数据) {
  const 标点符号列表 = [
    ",", ".", "?", "!", ":", ";", "、", "……", "~", "&", "@", "#", "，", "。", "？", "！", "：", "；", "·", "…", "～", "＆", "＠", "＃", "“", "”", "‘", "’", "〝", "〞", "\"", "'", "＂", "＇", "´", "＇", "(", ")", "【",
    "】", "《", "》", "＜", "＞", "﹝", "﹞", "<", ">", "(", ")", "[", "]", "«", "»", "‹", "›", "〔", "〕", "〈", "〉", "{", "}", "［", "］", "「", "」", "｛", "｝", "〖", "〗", "『", "』", "︵", "︷", "︹", "︿", "︽", "﹁",
    "﹃", "︻", "︗", "/", "|", "\\", "︶", "︸", "︺", "﹀", "︾", "﹂", "﹄", "﹄", "︼", "︘", "／", "｜", "＼",
    "_", "¯", "＿", "￣", "﹏", "﹋", "﹍", "﹉", "﹎", "﹊", "`", "ˋ", "¦", "︴", "¡", "¿", "^", "ˇ", "­", "¨", "ˊ", " ", "　",
    "%", "*", "-", "+", "=", "￥", "$", "（", "）"
  ]
  数据 = 数据.replace(/\s/g, " ")
  数据 = 数据.replace(/\!\[(.*?)\]\(.*?\)/g, (_a, b) => { return b })
  数据 = 数据.replace(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g, " ")
  for (const 标点符号 of 标点符号列表) {
    数据 = 数据.replace(new RegExp("\\" + 标点符号, "g"), " ")
  }
  数据 = 数据.replace(/\d+/g, " ")
  数据 = 数据.replace(/\s/g, " ")
  return 数据
}

function 分词(数据) {
  const 结巴 = require("nodejieba");
  return 结巴.cut(数据清洗(数据), true).filter(词 => 词 !== " " && !/^[0-9]*$/.test(词))
}

function 余弦相似度(向量1, 向量2) {
  let 分子 = 0;
  let 根式1 = 0;
  let 根式2 = 0;
  if (向量1.length == 向量2.length) {
    for (let i = 0; i < 向量1.length; i++) {
      分子 += (向量1[i] * 向量2[i])
      根式1 += (向量1[i] * 向量1[i])
      根式2 += (向量2[i] * 向量2[i])
    }
    return 分子 / (Math.sqrt(根式1) * Math.sqrt(根式2))
  }
}


function 文章推荐(cfg) {
  const 数据集 = {};
  const 相似度集 = {};
  const 推荐集 = {}
  let 所有文章中所有的词 = [];

  for (let i = 0; i < 语料库.length; i++) {
    const 分词表 = 语料库[i];
    所有文章中所有的词 = [...new Set(所有文章中所有的词.concat(分词表))]
  }
  const 词库 = {}
  所有文章中所有的词.forEach(e => {
    词库[e] = 0
  })
  const 包含该词的文档数库 = JSON.parse(JSON.stringify(词库))
  for (let i = 0; i < 语料库.length; i++) {
    const 文章路径 = 文章库[i].path;
    const 文章中的词 = 语料库[i];

    const 词在文章中出现的次数库 = 文章中的词.reduce((词计数对象, 词名称) => {
      if (词名称 in 词计数对象) {
        词计数对象[词名称]++;
      }
      return 词计数对象
    }, JSON.parse(JSON.stringify(词库)))

    数据集[文章路径] = {};
    数据集[文章路径]["词频"] = JSON.parse(JSON.stringify(词库));
    for (const 词 of Object.keys(词库)) {
      数据集[文章路径]["词频"][词] = 词在文章中出现的次数库[词] / 文章中的词.length;
      if (词在文章中出现的次数库[词]) {
        包含该词的文档数库[词]++;
      }
    }
  }

  for (let i = 0; i < 语料库.length; i++) {
    const 文章路径 = 文章库[i].path;
    数据集[文章路径]["逆文档频率"] = JSON.parse(JSON.stringify(词库));
    数据集[文章路径]["词频-逆文档频率"] = JSON.parse(JSON.stringify(词库));
    数据集[文章路径]["词频向量"] = []
    for (const 词 of Object.keys(词库)) {
      const 逆文档频率 = Math.log(语料库.length / (包含该词的文档数库[词] + 1))
      const 词频逆文档频率 = 数据集[文章路径]["词频"][词] * 逆文档频率
      // 数据集[文章路径]["逆文档频率"][词] = 逆文档频率
      // 数据集[文章路径]["词频-逆文档频率"][词] = 词频逆文档频率
      数据集[文章路径]["词频向量"].push(词频逆文档频率)
    }
  }
  for (let i = 0; i < 语料库.length; i++) {
    const 文章路径1 = 文章库[i].path;
    相似度集[文章路径1] = {}
    for (let j = 0; j < 语料库.length; j++) {
      const 文章路径2 = 文章库[j].path;
      相似度集[文章路径1][文章路径2] = 余弦相似度(数据集[文章路径1]["词频向量"], 数据集[文章路径2]["词频向量"]);
    }
    for (let j = 0; j < 语料库.length; j++) {
      推荐集[文章路径1] = Object.keys(相似度集[文章路径1]).sort(function (a, b) {
        return 相似度集[文章路径1][b] - 相似度集[文章路径1][a];   // 降序
      })
    }
    const index = 推荐集[文章路径1].indexOf(文章路径1);
    if (index > -1) {
      推荐集[文章路径1].splice(index, 1);
    }
    推荐集[文章路径1] = 推荐集[文章路径1].slice(0, cfg.max_count);
    for (let j = 0; j < 推荐集[文章路径1].length; j++) {
      const e = 推荐集[文章路径1][j];
      推荐集[文章路径1][j] = 文章库.filter(w => w.path == e)[0]
    }
  }
  hexo.locals.set('推荐集', function () {
    return 推荐集
  });
  // console.log(hexo.locals.get('推荐集'));
}

hexo.extend.helper.register('文章推荐生成器', function (post) {
  if (!post) return '';
  const cfg = hexo.theme.config.article.body.footer_widget.recommended_article;
  if (!cfg.enable) {
    return "";
  }
  for (const dir of cfg.skip_dirs) {
    if (new RegExp("^" + dir, "g").test(post.path)) {
      return "";
    }
  }
  const 推荐集 = hexo.locals.get('推荐集');
  const 推荐文章 = 推荐集[post.path];
  // console.log(post.path);
  // console.log(推荐文章);
  return 用户界面(推荐文章, cfg);
});

function 用户界面(推荐文章, cfg) {
  let html = ""
  for (const item of 推荐文章) {
    html += Item界面(item)
  }
  return `<div class="recommended-article">
  <div class="recommended-article-header">
    <i class="${cfg.icon} fa-fw" aria-hidden="true"></i><span>${cfg.title}</span>
  </div>
  <div class="recommended-article-group">${html}</div>
</div>`
}

function Item界面(item) {
  return `<a class="recommended-article-item" href="${hexo.config.root + item.path}" title="${item.title}" rel="bookmark">
  <img src="${item.headimg}" alt="${item.title}">
  <span class="title">${item.title}</span>
</a>`
}