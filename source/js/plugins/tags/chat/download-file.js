// 传入一个字符串，返回对应的文件格式类型
function extToMimes(ext) {
    let type = undefined;
    switch (ext) {
      // 对应图片格式jpg
      case 'jpg':
        type = 'image/jpeg'
        break;
      // 对应图片格式png
      case 'png':
        type = 'image/png'
        break;
      // 对应图片格式jpeg
      case 'jpeg':
        type = 'image/jpeg'
        break;
       // 对应图片格式gif
      case 'gif':
        type ='image/gif'
        break;
      // 对应图片格式bmp
      case 'bmp':
        type = 'image/bmp'
        break;
      // 对应文本格式txt
      case 'txt':
        type = 'text/plain'
        break;
      // 对应表格格式xls
      case 'xls':
        type = 'application/vnd.ms-excel'
        break;
      // 对应word文档doc格式
      case 'doc':
        type = 'application/msword'
        break;
      // 对应文档格式pdf
      case 'pdf':
        type = 'application/pdf'
        break;
      // 对应表格格式xlsx
      case 'xlsx':
        type = 'application/vnd.ms-excel'
        break;
      // 对应表格格式csv
      case 'csv':
        type = 'text/csv'
        break;
      // 对应的视频格式一般是MPEG-4或者H.264编码的MP4格式
      case 'mp4':
        type = 'video/mp4'
        break;
      // 对应的视频格式一般是AVI格式
      case 'avi':
        type = 'video/x-msvideo'
        break;
      // 对应的视频格式一般是Windows Media Video格式
      case 'WindowsMediaVideo':
        type = 'video/x-ms-wmv'
        break;
      // 对应的视频格式一般是MOV格式，由苹果公司开发的
      case 'mov':
        type = 'video/quicktime'
        break;
      // 对应的视频格式一般是Flash视频格式，由Adobe公司开发的
      case 'flash':
        type = 'video/x-flv'
        break;
      // 对应的视频格式一般是MKV格式，开源免费的多媒体容器格式
      case 'mkv':
        type = 'video/x-matroska'
        break;
      // 对应音频格式mp3
      case 'mp3':
        type = 'audio/mpeg'
        break;
      // 对应音频格式wav
      case 'wav':
        type = 'audio/wav'
        break;
      // 对应音频格式flac
      case 'flac':
        type = 'audio/flac'
        break;
      // 对应音频格式aac
      case 'aac':
        type = 'audio/aac'
        break;
      // 对应音频格式WMA
      case 'wma':
        type = 'audio/x-ms-wma'
        break;
      default:
        type = 'text/plain'
        break;
    }
    return type;
  }
  
  /**
   * 根据字节数获取文件大小，并转换成 KB、MB、GB、TB 等形式
   * @param {number} bytes - 文件的字节数
   * @returns {string} - 文件大小的字符串表示形式
   */
  function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = bytes;
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
  
    // 保留两位小数，四舍五入
    size = Math.round(size * 100) / 100;
  
    return `${size}${units[unitIndex]}`;
  }
  
  var file_contents = {};
  
  function cacheDatas(url, data) {
    let content = data.file;
    let fileName = url.split("/").at(-1);
    let fileType = fileName.split(".")[1];
    let fileMimeType = extToMimes(fileType);
    // 拿到二进制字符串 content
    // 再利用 Buffer 转为对象
    const length = content ? content.data.length : 0;
    let buf = new ArrayBuffer(length)
    let view = new Uint8Array(buf)
    for (let i = 0; i < length; ++i) {
      view[i] = content.data[i]
    }
    // 再输入到 Blob 生成文件
    let blob = new Blob([buf], {type: fileMimeType});
    let fileSize = formatFileSize(blob.size);
  
    let file_content = {};
    file_content.name = fileName;
    file_content.size = fileSize;
    file_content.blob = blob;
  
    file_contents[url] = file_content;
  }
  
  function renderFileDom(el, url) {
    let fileSizeSpan = el.querySelector('.file-size');
    let fileSize = file_contents[url].size;
    if (fileSizeSpan && fileSize) {
      fileSizeSpan.innerHTML = fileSize;
    }
  }
  
  function downloadFile(url) {
    let file = file_contents[url];
    let a = document.createElement('a')
    // 指定生成的文件名
    a.download = file.name;
    a.href = URL.createObjectURL(file.blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  
  function downloadFileEvent(fileDoms) {
    for (let i = 0; i < fileDoms.length; ++i) {
      let fileDom = fileDoms[i];
      const api = volantis.GLOBAL_CONFIG.tag_plugins.chat.api + '?type=file&url=';
      const obverser = new IntersectionObserver((entries, observer) => {
        volantis.requestAnimationFrame(()=>{
          entries.filter((entry)=>{return entry.isIntersecting}).sort((a,b)=>a.intersectionRect.y !== b.intersectionRect.y ? a.intersectionRect.y - b.intersectionRect.y : a.intersectionRect.x - b.intersectionRect.x).forEach((entry, index) => {
            observer.unobserve(entry.target);
            setTimeout(() => {
              let url = entry.target.getAttribute('url');
              fetch(api + url).then(function(response) {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Network response was not ok.');
              }).then(function(data) {
                cacheDatas(url, data);
                renderFileDom(fileDom, url);
              }).catch(function(error) {
                console.log(error);
              });
              fileDom.addEventListener('click', ()=>{
                  downloadFile(url);
              });
            }, Math.max(100, 16)*(index+1));
          });
        });
      });
      obverser.observe(fileDom);
    }
  }
  
