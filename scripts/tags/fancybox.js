'use strict';

function renderImg(content) {
  return `${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}`;
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
  if(html.startsWith('<p>') &&  html.endsWith('</p>')) {  // 去除无用的 p 标签包裹
    html=html.substring(0, html.length-4).substring(3);
  }
  
  let imageTags = html.includes('image-caption') ? 'image' : undefined;
  let imgList = html.match(/<img.*?>/g) || [];
  imgList.forEach(item => {
    const url = (item.match(/\ssrc=['"](.*?)['"]/) || [])[1];
    const alt = (item.match(/\salt=['"](.*?)['"]/) || [])[1];
    const newItem = item.replace('img', 'img fancybox itemprop="contentUrl"');  // 避免出现重复替换，打个标
    const result = `<div class='fancybox'><a class='fancybox' pjax-fancybox itemscope itemtype="http://schema.org/ImageObject" itemprop="url" href='${url}' data-fancybox='${group}' data-caption='${alt}'>${newItem}</a>${buidAlt(imageTags || alt)}</div>`;
    html = html.replace(item, result.trim());
  })
  return html;
}

function postFancybox(args, content) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
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



hexo.extend.tag.register('gallery', postFancybox, {ends: true});
