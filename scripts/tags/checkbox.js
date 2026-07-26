/**
 * 上次修改更新：5.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/*
{% checkbox 样式参数（可选）::文本（支持简单md） %}

{% checkbox 纯文本测试 %}
{% checkbox checked::支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% checkbox red::支持自定义颜色 %}
{% checkbox green checked::绿色 + 默认选中 %}
{% checkbox yellow checked::黄色 + 默认选中 %}
{% checkbox cyan checked::青色 + 默认选中 %}
{% checkbox blue checked::蓝色 + 默认选中 %}
{% checkbox plus green checked::增加 %}
{% checkbox minus yellow checked::减少 %}
{% checkbox times red checked::叉 %}

{% radio 样式参数（可选）::文本（支持简单md） %}
{% radio 纯文本测试 %}
{% radio checked::支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% radio red::支持自定义颜色 %}
{% radio green::绿色 %}
{% radio yellow::黄色 %}
{% radio cyan::青色 %}
{% radio blue::蓝色 %}

*/

'use strict';

function postCheckbox(args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  var cls = '';
  var text = '';
  var checked = false;
  if (args.length > 1) {
    cls = (args[0] || '').trim();
    if (cls.length > 0) {
      cls = ' ' + cls;
    }
    if (cls.indexOf('checked') > -1) {
      checked = true;
    }
    text = (args[1] || '').trim();
  } else if (args.length > 0) {
    text = (args[0] || '').trim();
  }
  if (text.length > 0) {
    return `<div class='checkbox${cls}'><input type="checkbox" ${checked ? 'checked="checked"' : ''}/>
            ${hexo.render.renderSync({ text: text, engine: 'markdown' }).split('\n').join('')}
            </div>`;
  }
}
function postRadio(args) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  var cls = '';
  var text = '';
  var checked = false;
  if (args.length > 1) {
    cls = (args[0] || '').trim();
    if (cls.length > 0) {
      cls = ' ' + cls;
    }
    if (cls.indexOf('checked') > -1) {
      checked = true;
    }
    text = (args[1] || '').trim();
  } else if (args.length > 0) {
    text = (args[0] || '').trim();
  }
  if (text.length > 0) {
    return `<div class='checkbox${cls}'><input type="radio" ${checked ? 'checked="checked"' : ''}/>
            ${hexo.render.renderSync({ text: text, engine: 'markdown' }).split('\n').join('')}
            </div>`;
  }
}
// {% checkbox text %}
// {% checkbox checked, text %}
// {% checkbox color checked, text %}
hexo.extend.tag.register('checkbox', postCheckbox);
hexo.extend.tag.register('radio', postRadio);
