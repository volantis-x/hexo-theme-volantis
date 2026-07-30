/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * video.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% Video src %}
 *
 */

'use strict';

function Video(args) {
  const ctx = hexo;
  args = ctx.args.map(args, ['type', 'bilibili', 'youtube', 'ratio', 'width', 'autoplay'], ['src'])
  if (args.width == null) {
    args.width = '100%'
  }
  if (args.bilibili) {
    return `<div class="tag-plugin video-player" style="aspect-ratio:${args.ratio || 16 / 9};max-width:${args.width};">
    <iframe src="https://player.bilibili.com/player.html?bvid=${args.bilibili}&autoplay=${args.autoplay || 'false'}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true">
    </iframe>
    </div>
    `
  }
  if (args.youtube) {
    if(args.autoplay == 'true' || args.autoplay == '1') { 
      args.autoplay = '1&mute=1'
    } else {
      args.autoplay = '0'
    }
    return `<div class="tag-plugin video-player" style="aspect-ratio:${args.ratio || 16 / 9};max-width:${args.width};">
    <iframe style="border:none" src="https://www.youtube.com/embed/${args.youtube}?rel=0&disablekb=1&playsinline=1&autoplay=${args.autoplay}" picture-in-picture="true" allowfullscreen="true" >
    </iframe>
    </div>
    `
  }
  return `<div class="tag-plugin video-player" style="max-width:${args.width};">
  <video controls preload playsinline webkit-playsinline>
  <source src="${args.src}" type="${args.type || 'video/mp4'}">Your browser does not support the video tag.
  </video>
  </div>
  `
}
hexo.extend.tag.register('Video', Video)



// v5
function postVideo(args) {
  const { config } = hexo;
  const src = args[0].trim();
  // m3u8 https://github.com/volantis-x/hexo-theme-volantis/issues/606
  // 文件扩展名为 .m3u8
  if (hexo.getType(src) === "m3u8") {
    let video_id = `video-${hexo.createUuid()}`
    return `<div clsss="video"><video id="${video_id}" controls loop="false" width="100%"></video></div>
        <script>
          volantis.js("${hexo.theme.config.cdn.hlsjs}").then(()=>{
            var video = document.getElementById('${video_id}');
            if(Hls.isSupported()) {
              var hls = new Hls();
              hls.loadSource('${src}');
              hls.attachMedia(video);
            }else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              video.src = '${src}';
            }
          })
        </script>`;
  }
  return `<div class="video"><video controls preload><source src='${src}' type='video/mp4'>Your browser does not support the video tag.</video></div>`;
}

function postVideos(args, content) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  var cls = args[0];
  if (cls.length > 0) {
    cls = ' ' + cls;
  }
  var col = Number(args[1]) || 0;
  if (col > 0) {
    return `<div class="videos${cls}" col='${col}'>${content}</div>`;
  }
  return `<div class="videos${cls}">${content}</div>`;

}

hexo.extend.tag.register('video', postVideo);
hexo.extend.tag.register('videos', postVideos, { ends: true });
