const SitesJS = {
  requestAPI: (url, callback, timeout) => {
    let retryTimes = 5;

    function request() {
      return new Promise((resolve, reject) => {
        let status = 0; // 0 等待 1 完成 2 超时
        let timer = setTimeout(() => {
          if (status === 0) {
            status = 2;
            timer = null;
            reject('请求超时');
            if (retryTimes == 0) {
              timeout();
            }
          }
        }, 5000);
        fetch(url).then(function (response) {
          if (status !== 2) {
            clearTimeout(timer);
            resolve(response);
            timer = null;
            status = 1;
          }
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        }).then(function (data) {
          retryTimes = 0;
          callback(data);
        }).catch(function (error) {
          if (retryTimes > 0) {
            retryTimes -= 1;
            setTimeout(() => {
              request();
            }, 5000);
          } else {
            timeout();
          }
        });
      });
    }
    request();
  },
  layout: (cfg) => {
    const el = cfg.el;
    SitesJS.requestAPI(cfg.api, function (data) {
      el.querySelector('.loading-wrap').remove();
      const arr = data.content;
      var cellALL = "";
      arr.forEach((item, i) => {
        var cell = '<div class="site-card">';
        cell += '<a class="card-link" target="_blank" rel="external noopener noreferrer" href="' + item.url + '">';
        cell += '<img alt="' + item.title + '" src="' + (item.screenshot || ('https://image.thum.io/get/width/1024/crop/768/' + item.url)) + '" onerror="javascript:this.onerror=null;this.src=\'' + cfg.screenshot + '\';"/>';
        cell += '<div class="info">';
        cell += '<img alt="' + item.title + '" src="' + (item.avatar || cfg.avatar) + '" onerror="javascript:this.onerror=null;this.src=\'' + cfg.avatar + '\';"/>';
        cell += '<span class="title">' + item.title + '</span>';
        cell += '<span class="desc">' + (item.description || item.url) + '</span>';
        cell += '</div>';
        cell += '</a>';
        cell += '</div>';
        cellALL += cell;
      });
      el.querySelector('.group-body').innerHTML = cellALL;
    }, function () {
      try {
        el.querySelector('.loading-wrap svg').remove();
        el.querySelector('.loading-wrap p').innerText('加载失败，请稍后重试。');
      } catch (e) { }
    });
  },
  start: (cfg) => {
    const els = document.getElementsByClassName('sitesjs-wrap');
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const api = el.getAttribute('api');
      if (api == null) {
        continue;
      }
      var cfg = new Object();
      cfg.class = el.getAttribute('class');
      cfg.el = el;
      cfg.api = api;
      cfg.avatar = 'https://cdn.jsdelivr.net/gh/cdn-x/placeholder@1.0.1/link/8f277b4ee0ecd.svg';
      cfg.screenshot = 'https://cdn.jsdelivr.net/gh/cdn-x/placeholder@1.0.1/cover/76b86c0226ffd.svg';
      SitesJS.layout(cfg);
    }
  }
}


SitesJS.start();
document.addEventListener('pjax:complete', function () {
  SitesJS.start();
});