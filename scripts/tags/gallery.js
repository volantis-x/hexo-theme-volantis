/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
// v6
/**
 * gallery.js v2.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Gallery [layout:grid/flow] [size:mix/s/m/l/xl] [ratio:origin/square] %}
 * ![title](/xxx.png)
 * ![title](/xxx.png)
 * ![title](/xxx.png)
 * ![title](/xxx.png)
 * {% endGallery %}
 * 
 * layout:grid 网格布局，支持通过 size/ratio 设置尺寸和长宽比
 * layout:flow 瀑布流布局，竖排，适合图片量大的时候使用（体验不佳请慎用）
 */

'use strict'

var index = 0

function img(src, alt, loading) {
  let img = ''
  img += `<img class="lazy" data-fancybox="gallery-${index}" data-src="${src}"`
  if (alt?.length > 0) {
    img += ` alt="${alt}"`
  }
  img += `/>`
  img += `<div class="lazy-icon" style="background-image:url(${loading});"></div>`
  // cap
  img += `<div class="image-meta">`
  if (alt?.length > 0) {
    img += `<span class="image-caption">${alt}</span>`
  }
  img += `</div>`
  return img
}

function Gallery(args, content) {
  const ctx = hexo;
  args = ctx.args.map(args, ['layout', 'size', 'ratio'])
  if (args.size == null) {
    args.size = ctx.theme.config.tag_plugins.Gallery.size
  }
  if (args.ratio == null) {
    args.ratio = ctx.theme.config.tag_plugins.Gallery.ratio
  }
  var el = ''
  var layoutType = 'grid'
  if (args.layout == 'flow') {
    layoutType = 'flow'
  }
  index += 1
  el += `<div class="tag-plugin gallery ${layoutType}-box" ${ctx.args.joinTags(args, ['size', 'ratio']).join(' ')}>`
  const img_mds = content.split('\n').filter(item => item.trim().length > 0)
  for (let md of img_mds) {
    const matches = md.match(/\!\[(.*?)\]\((.*?)\)/i)
    if (matches?.length > 2) {
      let alt = matches[1]
      let src = matches[2]
      el += `<div class="${layoutType}-cell lazy-box">${img(src, alt, ctx.theme.config.default.loading)}</div>`
    }
  }
  el += `</div>`
  return el
}

hexo.extend.tag.register('Gallery', Gallery, { ends: true });


// v5
/*
{% gallery 参数::列数::分组 %}
![图片描述](https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B18FCBB3-67FD-48CC-B4F3-457BA145F17A.jpeg)
![](https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg)
{% endgallery %}

可以支持的参数

对齐方向

left::center::right

缩放

stretch

列数

::后面直接写列数，支持 2 ～ 8 列。设定列数之后就是「多行多图」布局，此时图片默认左对齐。为了避免图片大小不一，建议搭配 stretch 来时图片放大填充。

测试中 设定列数之后 不会产生 累积布局偏移; 没有设定列数 产生了累积布局偏移

分组

相同内容的会被归档在一个分组中。
*/
function renderImg(content) {
  return `${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}`;
}

function buidAlt(alt) {
  if (!!alt && alt !== 'image') {
    return `<span class='image-caption'>${alt}</span>`
  } else {
    return '<span></span>';
  }
}

function buidImgFancybox(content, group) {
  let html = renderImg(content).trim();
  if (html.startsWith('<p>') && html.endsWith('</p>')) {  // 去除无用的 p 标签包裹
    html = html.substring(0, html.length - 4).substring(3);
  }

  let imageTags = html.includes('image-caption') ? 'image' : undefined;
  let imgList = html.match(/<img.*?>/g) || [];
  imgList.forEach(item => {
    const url = (item.match(/\ssrc=['"](.*?)['"]/) || [])[1];
    const alt = (item.match(/\salt=['"](.*?)['"]/) || [])[1] || '';
    const newItem = item.replace('img', 'img fancybox itemprop="contentUrl"');  // 避免出现重复替换，打个标
    const result = `<div class='fancybox'><a class='fancybox' pjax-fancybox itemscope itemtype="http://schema.org/ImageObject" itemprop="url" href='${url}' data-fancybox='${group}' data-caption='${alt}'>${newItem}</a>${buidAlt(imageTags || alt)}</div>`;
    html = html.replace(item, result.trim());
  })
  return html;
}

function postFancybox(args, content) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  const cls = args[0];
  const col = Number(args[1]) || 0;
  const group = (args[2] || 'default').trim();

  if (col > 0) {
    return `<div galleryFlag itemscope itemtype="http://schema.org/ImageGallery" class="gallery ${cls}" col='${col}' data-group='${group}'>${buidImgFancybox(content, group)}</div>`;
  }
  return `<div galleryFlag itemscope itemtype="http://schema.org/ImageGallery" class="gallery ${cls}" data-group='${group}'>${buidImgFancybox(content, group)}</div>`;
}



hexo.extend.tag.register('gallery', postFancybox, { ends: true });
