/*页面载入完成后，创建复制按钮*/
!function (e, t, a) {
  /* code */
  var initCopyCode = function(){
    var copyHtml = '';
    copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
    copyHtml += '  <i class="fa fa-copy"></i><span>Copy</span>';
    copyHtml += '</button>';
    $(".highlight .code pre").before(copyHtml);
    var clipboard = new ClipboardJS('.btn-copy', {
      target: function(trigger) {
        return trigger.nextElementSibling;
      }
    });

    clipboard.on('success', function(e) {
      //您可以加入成功提示
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
      success_prompt("复制成功");
      e.clearSelection();
    });
    clipboard.on('error', function(e) {
      //您可以加入失败提示
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
      fail_prompt("复制失败");
    });
  }
  initCopyCode();

}(window, document);

/**
 * 弹出式提示框，默认1.2秒自动消失
 * @param message 提示信息
 * @param style 提示样式，有alert-success、alert-danger、alert-warning、alert-info
 * @param time 消失时间
 */
var prompt = function (message, style, time)
{
    style = (style === undefined) ? 'alert-success' : style;
    time = (time === undefined) ? 1200 : time*1000;
    $('<div>')
        .appendTo('body')
        .addClass('alert ' + style)
        .html(message)
        .show()
        .delay(time)
        .fadeOut();
};

// 成功提示
var success_prompt = function(message, time)
{
    prompt(message, 'alert-success', time);
};

// 失败提示
var fail_prompt = function(message, time)
{
    prompt(message, 'alert-danger', time);
};

// 提醒
var warning_prompt = function(message, time)
{
    prompt(message, 'alert-warning', time);
};

// 信息提示
var info_prompt = function(message, time)
{
    prompt(message, 'alert-info', time);
};
