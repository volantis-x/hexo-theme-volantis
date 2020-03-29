'use strict';

function postVideo(args) {
  let src = args[0].trim()
  return `<video controls preload width='100%' height='100%'><source src='${src}' type='video/mp4'>Your browser does not support the video tag.</video>`;
}

hexo.extend.tag.register('video', postVideo);
