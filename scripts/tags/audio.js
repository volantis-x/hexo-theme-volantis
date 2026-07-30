/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * audio.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Audio src %}
 *
 */

'use strict';

function Audio(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['type', 'netease', 'autoplay'], ['src'])
  if (args.netease) {
    return `
    <div class="tag-plugin audio">
    <iframe src="//music.163.com/outchain/player?type=${args.type || '2'}&id=${args.netease}&auto=${args.autoplay == 'true' ? '1' : '0'}&height=32" frameborder="no" border="0" marginwidth="0" marginheight="0" width=288px height=52>
    </iframe>
    </div>
    `
  }
  return `
  <div class="tag-plugin audio">
  <audio controls preload>
  <source src="${args.src}" type="${args.type || 'audio/mp3'}">Your browser does not support the audio tag.
  </audio>
  </div>
  `
}

hexo.extend.tag.register('Audio', Audio)

