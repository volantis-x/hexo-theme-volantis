function parseIssuesData(cfg, data) {
  let groups = new Object();
  if (data.length > 0) {
    for (i = 0; i < data.length; i++) {
      // get categories
      let group = data[i].body.match(/group:[^\n]*\n/);
      if (group && group.length > 0) {
        group = group[0].replace(/(group:[\s]*|[\r\n]*)/g,'').split(', ');
      }
      if (group) {
        for (var j = 0; j < group.length; j++) {
          let tmp = group[j];
          if (tmp in groups) {
            groups[tmp].push(data[i]);
          } else {
            let arr = new Array();
            arr.push(data[i]);
            groups[tmp] = arr;
          }
        }
      } else {
        let arr = groups[''];
        if (arr == undefined) {
          arr = new Array();
        }
        arr.push(data[i]);
        groups[''] = arr;
      }
    }
  }
  return groups;
}

function getIssuesAPIForSites(cfg) {
  let el = $(cfg.el)[0];
  $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');

  let retryTimes = 10;
  function request() {
    return new Promise((resolve, reject) => {
      let status = 0; // 0 等待 1 完成 2 超时
      let timer = setTimeout(() => {
        if (status === 0) {
          status = 2;
          timer = null;
          reject("超时");
          if (retryTimes == 0) {
            $(el).find('.loading i').remove();
            $(el).find('.loading p').text('加载失败，请稍后重试。');
          }
        }
      }, 5000);
      fetch(cfg.api).then(function(response) {
        if (status !== 2) {
          clearTimeout(timer);
          resolve(response);
          timer = null;
          status = 1;
        }
        if(response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      }).then(function(data) {
        $(el).find('.loading').remove();
        let dt = parseIssuesData(cfg, data);
        if (cfg.group == undefined) {
          cfg.group = Object.keys(dt);
        }
        for (i = 0; i < cfg.group.length; i++) {
          let name = cfg.group[i];
          if (name.length > 0) {
            if (dt[name] == undefined) {
              continue;
            }
          }
          let issues = dt[name];
          if (name.length > 0) {
            $(el).append('<h2>' + name + '</h2>');
          } else if (name == '' && cfg.group.length > 1) {
            $(el).append('<h2>' + '未分组' + '</h2>');
          }
          $(el).append('<div class="site-card-group ' + i + '"></div>');
          // layout items
          for (j = 0; j < issues.length; j++) {
            let issue = issues[j];
            // get title
            let title = issue.body.match(/title:[^\n]*\n/);
            if (title && title.length > 0) {
              title = title[0].replace(/(title:[\s]*|[\r\n]*)/g,'');
            }
            // get screenshot
            let screenshot = issue.body.match(/screenshot:[^\n]*\n/);
            if (screenshot && screenshot.length > 0) {
              screenshot = screenshot[0].replace(/(screenshot:[\s]*|[\r\n]*)/g,'');
            }
            // get avatar
            let avatar = issue.body.match(/avatar:[^\n]*\n/);
            if (avatar && avatar.length > 0) {
              avatar = avatar[0].replace(/(avatar:[\s]*|[\r\n]*)/g,'');
            }
            // get desc
            let desc = issue.body.match(/description:[^\n]*\n/);
            if (desc && desc.length > 0) {
              desc = desc[0].replace(/(description:[\s]*|[\r\n]*)/g,'');
            }
            // get url
            let url = issue.body.match(/url:[^\n]*\n/);
            if (url && url.length > 0) {
              url = url[0].replace(/(url:[\s]*|[\r\n]*)/g,'');
            }
            // get keywords
            let keywords = issue.body.match(/keywords:[^\n]*\n/);
            if (keywords && keywords.length > 0) {
              keywords = keywords[0].replace(/(keywords:[\s]*|[\r\n]*)/g,'');
              keywords = keywords.replace('[','').replace(']','').split(', ');
            }

            let imgTag = '';
            if (screenshot && screenshot.length > 0) {
              imgTag = '<div class="img"><img src="' + screenshot + '" onerror="javascript:this.src=\'https://cdn.jsdelivr.net/gh/volantis-x/cdn-wallpaper-minimalist/2020/052.jpg\';"/></div>';
            } else {
              imgTag = '<div class="img"></div>';
            }
            let infoTag = '<div class="info">';
            if (avatar && avatar.length > 0) {
              infoTag += '<img src="' + avatar + '" onerror="javascript:this.src=\'https://cdn.jsdelivr.net/gh/volantis-x/cdn-wallpaper-minimalist/2020/052.jpg\';"/>';
            }
            infoTag += '<span class="title">' + title + '</span><span class="desc">' + (desc || keywords && keywords.join('、')) + '</span></div>';
            let cardTag = "<a class='site-card' target='_blank' href='" + url + "'>" + imgTag + infoTag + "</a>";
            $(el).find('.site-card-group.' + i).append(cardTag);
          }
        }
      }).catch(function(error) {
        if (retryTimes > 0) {
          retryTimes -= 1;
          $(el).find('.loading p').text('加载失败，正在重试...');
          setTimeout(() => {
            request();
          }, 5000);
        } else {
          $(el).find('.loading i').remove();
          $(el).find('.loading p').text('加载失败，请稍后重试。');
        }
      });
    });
  }
  request();
}

function getIssuesAPIForTimeline(cfg) {
  let el = $(cfg.el)[0];
  $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');
  $.get(cfg.api, function(data, status) {
    $(el).find('.loading').remove();
    if (data.length > 0) {
      for (i = 0; i < data.length; i++) {
        let a = '&nbsp;&nbsp;<a class="comments" target="_blank" href="' + data[i].html_url + '"><i class="fa fa-comment-dots fa-fw"></i>' + data[i].comments + '</a>';
        let meta = '<div class="meta"><p></p><p>' + data[i].title + a + '</p><p></p></div>';
        let body = '<div class="body"><p>' + data[i].body + '</p></div>';
        let tag = '<div class="timenode">' + meta + body + '</div>';
        $(el).append(tag);
      }
    }
  });
}

function checkIssues() {
  let els = document.getElementsByClassName('issues-api');
  for (var i = 0; i < els.length; i++) {
    let el = els[i];
    let api = el.getAttribute('api');
    let group = el.getAttribute('group');
    var cfg = new Object();
    cfg.class = el.getAttribute('class');
    cfg.el = el;
    cfg.api = api;
    cfg.group = group ? group.replace(/(,[\s]*)/g,',').split(',') : undefined;
    if (cfg.class.split(' ').includes('sites')) {
      getIssuesAPIForSites(cfg);
    } else if (cfg.class.split(' ').includes('timeline')) {
      getIssuesAPIForTimeline(cfg);
    }

  }
}
document.addEventListener('DOMContentLoaded', function () {
  checkIssues();
});
document.addEventListener('pjax:complete', function () {
  checkIssues();
});
