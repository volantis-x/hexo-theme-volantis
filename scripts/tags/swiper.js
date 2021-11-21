/**
 * swiper.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% swiper %}
 * ![img](src)
 * {% endswiper %}
 */

'use strict';

hexo.extend.tag.register('swiper', function (args, content) {
  args = hexo.args.map(args, ['width']);
  var el = '';
  function slide() {
    let imgs = hexo.render.renderSync({ text: content, engine: 'markdown' });
    imgs = imgs.match(/<img(.*?)src="(.*?)"(.*?)>/gi);
    if (imgs && imgs.length > 0) {
      imgs.forEach((img, i) => {
        img = img.replace('<img src', '<img no-lazy src');
        el += '<div class="swiper-slide">' + img + '</div>';
      });
    }
  }
  el += '<div class="tag-plugin swiper-container"';
  if (args.width && args.width.length > 0) {
    el += ' ' + hexo.args.joinTags(args, 'width').join(' ');
  }
  el += '>';
  el += '<div class="swiper-wrapper">';
  slide();
  el += '</div>';
  el += '<div class="swiper-pagination"></div>';
  el += '<div class="swiper-button-prev blur"></div>';
  el += '<div class="swiper-button-next blur"></div>';
  el += '</div>';
  return el;
}, { ends: true });