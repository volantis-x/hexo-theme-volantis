'use strict';

function postAudio(args) {
  const src = args[0].trim();
  return `<div class="audio"><audio controls preload><source src='${src}' type='audio/mp3'>Your browser does not support the audio tag.</audio></div>`;
}

function postVideo(args) {
  const src = args[0].trim();
  // m3u8 https://github.com/volantis-x/hexo-theme-volantis/issues/606
  // 文件扩展名为 .m3u8
  if (hexo.getType(src) === "m3u8") {
    let video_id = `video-${hexo.createUuid()}`
    return `<div clsss="video"><video id="${video_id}" controls loop="false" width="100%"></video></div>
        <script>
          volantis.js("https://cdn.jsdelivr.net/npm/hls.js@latest").then(()=>{
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
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
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

hexo.extend.tag.register('audio', postAudio);
hexo.extend.tag.register('video', postVideo);
hexo.extend.tag.register('videos', postVideos, {ends: true});
