/**
 * 上次修改更新：6.3.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * swiper.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% swiper %}
 * ![img](src)
 * {% endswiper %}
 */
/*
swiper 轮播容器

默认一张图片是 50% 宽度，通过设置 `width:min` 设置为 25% 宽度，`width:max` 设置为 100% 宽度。

{% swiper effect:cards %}
![](https://images.unsplash.com/photo-1625171515821-1870deb2743b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)
![](https://images.unsplash.com/photo-1528283648649-33347faa5d9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)
![](https://images.unsplash.com/photo-1542272201-b1ca555f8505?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)
![](https://images.unsplash.com/photo-1524797905120-92940d3a18d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)
{% endswiper %}


宽度 

{% swiper width:min/max %}
...
{% endswiper %}


切换效果

{% swiper effect:cards/coverflow %}
...
{% endswiper %}


注意 一个页面只能设置一次，第一个 `swiper` 容器的效果全局生效。

*/

'use strict';

hexo.extend.tag.register('swiper', function (args, content) {
  args = hexo.args.map(args, ['width', 'effect']);
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
    el += ' ' + hexo.args.joinTags(args, ['width', 'effect']).join(' ')
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
