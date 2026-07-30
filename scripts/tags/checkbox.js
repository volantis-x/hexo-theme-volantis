/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * checkbox.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * radio.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Checkbox [checked:false] [color:cyan] [symbol:plus/minus/times] text %}
 * {% Radio [checked:false] [color:cyan] text %}
 */

'use strict'

function Checkbox(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'checked', 'symbol'], ['text'])
  var el = ''
  // div
  el += '<div class="tag-plugin colorful checkbox"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'symbol']).join(' ')
  el += '>'
  // input
  el += '<input type="' + 'checkbox' + '"'
  if (args.checked == 'true') {
    el += ' checked="true"'
  }
  el += '/>'
  // text
  el += '<span>' + args.text + '</span>'
  // div
  el += '</div>'
  return el
}
function Radio(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['color', 'checked', 'symbol'], ['text'])
  var el = ''
  // div
  el += '<div class="tag-plugin colorful checkbox"'
  el += ' ' + ctx.args.joinTags(args, ['color', 'symbol']).join(' ')
  el += '>'
  // input
  el += '<input type="' + 'radio' + '"'
  if (args.checked == 'true') {
    el += ' checked="true"'
  }
  el += '/>'
  // text
  el += '<span>' + args.text + '</span>'
  // div
  el += '</div>'
  return el
}
hexo.extend.tag.register('Checkbox', Checkbox)
hexo.extend.tag.register('Radio', Radio)



// v5
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
