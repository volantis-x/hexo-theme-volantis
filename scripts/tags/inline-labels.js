/**
 * 上次修改更新：6.6.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * 修饰文本标签
 *
 * example:
 * {% psw 这是密码 %}
 */
/*
- 这是 {% blur 高斯模糊 %} 标签
- 这是 {% psw 密码 %} 标签
- 这是 {% u 下划线 %} 标签
- 这是 {% emp 着重号 %} 标签
- 这是 {% wavy 波浪线 %} 标签
- 这是 {% del 删除线 %} 标签
- 这是 {% sup 上角标 color:red %} 标签
- 这是 {% sub 下角标 %} 标签
- 这是 {% kbd 键盘样式 %} 标签，试一试：{% kbd ⌘ %} + {% kbd D %}
*/
'use strict';

function createTag(tagName) {
  return function(args) {
    return `<${tagName}>${args.join(' ')}</${tagName}>`;
  };
}

hexo.extend.tag.register('u', createTag('u'));
hexo.extend.tag.register('emp', createTag('emp'));
hexo.extend.tag.register('wavy', createTag('wavy'));
hexo.extend.tag.register('del', createTag('del'));
hexo.extend.tag.register('kbd', createTag('kbd'));
hexo.extend.tag.register('psw', createTag('psw'));
hexo.extend.tag.register('blur', createTag('blur'))
hexo.extend.tag.register('sup', function(args) {
  args = hexo.args.map(args, ['color'], ['text'])
  var el = ''
  el += '<sup class="tag-plugin colorful sup"' + ' ' + hexo.args.joinTags(args, ['color']).join(' ') + '>'
  el += args.text
  el += '</sup>'
  return el
})
hexo.extend.tag.register('sub', function(args) {
  args = hexo.args.map(args, ['color'], ['text'])
  var el = ''
  el += '<sub class="tag-plugin colorful sub"' + ' ' + hexo.args.joinTags(args, ['color']).join(' ') + '>'
  el += args.text
  el += '</sub>'
  return el
})
