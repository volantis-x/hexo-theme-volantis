/**
 * issues.js | https://github.com/volantis-x/hexo-theme-volantis
 * 
 * 备注: issues 标签在5.0版本移除 被 sites标签 friends标签 contributors标签 替代 https://github.com/volantis-x/hexo-theme-volantis/commit/abfd5eef38288f40b6a349772f84623da0b474f3
 * 已移除的样式: https://github.com/volantis-x/hexo-theme-volantis/blob/fe81586d60053973322bd9117e2022dc119b5283/source/css/_tag-plugins/site-card.styl
 * 已移除的脚本: https://github.com/volantis-x/hexo-theme-volantis/blob/fe81586d60053973322bd9117e2022dc119b5283/source/js/issues.js
 */

'use strict';

// 从 issues 加载动态数据
// {% issues sites/timeline/friends | api=xxx | group=key:a,b,c %}
// 例如：
// {% issues sites | api=https://api.github.com/repos/volantis-x/examples/issues?sort=updated&state=open&page=1&per_page=100 | group=version:latest,v6,v5,v4,v3,v2,v1,v0 %}
hexo.extend.tag.register('issues', function(args) {
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(' | ');
  }
  // 所有支持的参数
  let type = args[0].trim();
  let api = '';
  let group = '';
  // 解析
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      const tmp = args[i].trim();
      if (tmp.includes('type=')) {
        type = tmp.substring(5, tmp.length);
      } else if (tmp.includes('api=')) {
        api = tmp.substring(4, tmp.length);
      } else if (tmp.includes('group=')) {
        group = tmp.substring(6, tmp.length);
      }
    }
  }
  if (type.length == 0 || api.length == 0) {
    return;
  }
  // 布局
  let ret = '<div class="issues-api ' + type + '"';
  ret += 'api="' + api + '"';
  if (group.length > 0) {
    ret += 'group="' + group + '"';
  }
  ret += '></div>';
  return ret;
});
