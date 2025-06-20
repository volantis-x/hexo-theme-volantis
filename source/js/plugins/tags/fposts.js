const FpostsJS = {
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
    const default_avatar = cfg.avatar;
    
    FpostsJS.requestAPI(cfg.api, function (data) {
      el.querySelector('.loading-wrap').remove();
      const arr = data.content;
      var cellALL = "";
      arr.forEach((item, i) => {
        var cell = `<div class="grid-cell user-post-card">`;
        cell += `<div class="avatar-box">`;
        cell += `<a class="card-link" target="_blank" rel="external nofollow noopener noreferrer" href="${item.html_url || item.url}">`;;
        cell += `<img src="${item.avatar_url || item.avatar || item.icon || default_avatar}" onerror="javascript:this.removeAttribute(\'data-src\');this.src=\'${default_avatar}\';"/>`;
        cell += `<span class="title">${item.title || item.login}</span>`;
        cell += `</a>`;
        cell += `<div class="labels">`;
        for (let label of item.labels) {
          if (label.lightness > 75) {
            cell += `<div class="label" style="background:#${label.color};color:hsla(${label.hue}, ${label.saturation}%, 20%, 1);">${label.name}</div>`;
          } else if (label.saturation > 90 && label.lightness > 40) {
            cell += `<div class="label" style="background:#${label.color};color:hsla(${label.hue}, 50%, 20%, 1);">${label.name}</div>`;
          } else {
            cell += `<div class="label" style="background:#${label.color};color:white">${label.name}</div>`;
          }
        }
        cell += `</div>`;
        cell += `</div>`;
        cell += `<div class="previews">`;
        if (item.description) {
          cell += `<div class="desc">${item.description || item.issue_number || ''}</div>`;
        } else {
          cell += `<div class="desc">#${item.issue_number}</div>`;
        }
        cell += `<div class="posts">`;
        
        if (item.posts?.length > 0) {
          for (let post of item.posts) {
            cell += `<a class="post-link" target="_blank" rel="external nofollow noopener noreferrer" href="${post.link}">`;
            cell += `<span class="title">${post.title}</span>`;
            cell += `<span class="date">${post.published}</span>`;
            cell += `</a>`;
          }
        } else {
          cell += `<span class="no-post">${item.feed?.length > 0 ? 'RSS 解析失败' : '未设置 RSS 链接'}</span>`;
        }
        cell += `</div>`;
        cell += `</div>`;
        cell += `</div>`;
        cellALL += cell;
      });
      
      el.querySelector('.grid-box').innerHTML = cellALL;
    }, function () {
      try {
        el.querySelector('.loading-wrap svg').remove();
        el.querySelector('.loading-wrap p').innerText('加载失败，请稍后重试。');
      } catch (e) { }
    });
  },
  start: () => {
    const els = document.getElementsByClassName('users-posts-wrap');
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const api = el.getAttribute('api');
      if (api == null) {
        continue;
      }
      var cfg = new Object();
      cfg.el = el;
      cfg.api = api;
      cfg.class = el.getAttribute('class');
      cfg.avatar = volantis.GLOBAL_CONFIG.default.avatar;
      FpostsJS.layout(cfg);
    }
  }
}



FpostsJS.start();
