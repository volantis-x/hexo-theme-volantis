'use strict';

function renderImg(content) {
  return `${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}`;
}

function buidAlt(alt) {
  if (!!alt && alt !== 'image') {
    return `<span class='image-caption'>${alt}</span>`
  }
}

function buidImgFancybox(content, group) {
  let html = renderImg(content).trim();
  let imgList = html.match(/<img.*?>/g) || [];
  imgList.forEach(item => {
    const url = (item.match(/\ssrc=['"](.*?)['"]/) || [])[1];
    const alt = (item.match(/\salt=['"](.*?)['"]/) || [])[1];
    const result = `
      <div class='fancybox'>
        <a class='fancybox' pjax-fancybox href='${url}' data-fancybox='${group}' data-caption='${alt}'>${item}</a>
        ${buidAlt(alt)}
      </div>
    `;
    html = html.replace(item, result.trim());
  })
  return html;
}

function postFancybox(args, content) {
  args = args.join(' ').split(',');
  const cls = args[0];
  const col = Number(args[1]) || 0;
  const group = (args[2] || 'default').trim();

  if (col > 0) {
    return `<div class="gallery ${cls}" col='${col}' data-group='${group}'>${buidImgFancybox(content, group)}</div>`;
  }
  return `<div class="gallery ${cls}" data-group='${group}'>${buidImgFancybox(content, group)}</div>`;
}



hexo.extend.tag.register('gallery', postFancybox, {ends: true});
