const IssuesAPI = {
  requestIssuesAPI(url, callback, timeout) {
    let retryTimes = 10;
    function request() {
      return new Promise((resolve, reject) => {
        let status = 0; // 0 等待 1 完成 2 超时
        let timer = setTimeout(() => {
          if (status === 0) {
            status = 2;
            timer = null;
            reject("请求超时");
            if (retryTimes == 0) {
              timeout();
            }
          }
        }, 5000);
        fetch(url).then(function(response) {
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
          retryTimes = 0;
          callback(data);
        }).catch(function(error) {
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
  parseIssueStrToJson(str) {
    let jsonStr = str.match(/```json[\s|\S]*```/);
    if (jsonStr && jsonStr.length > 0) {
      jsonStr = jsonStr[0];
    }
    if (jsonStr) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0];
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
    }
    return undefined;
  },
  groupIssuesData(cfg, data) {
    var groups = new Object();
    if (data.length > 0) {
      if (cfg.group != undefined) {
        let arr = cfg.group.split(':');
        if (arr.length > 1) {
          let groupKey = arr[0];
          let groupList = arr[1];
          if (groupKey && groupList) {
            groupList = groupList.split(',');
          }
          cfg.group = groupList;
          for (i = 0; i < data.length; i++) {
            let obj = this.parseIssueStrToJson(data[i].body);
            if (obj && (groupKey in obj)) {
              let tmp = obj[groupKey];
              tmp = tmp.replace(', ', ',').split(',');
              for (var j = 0; j < tmp.length; j++) {
                if (groupList.includes(tmp[j])) {
                  let arr = groups[tmp[j]];
                  if (arr == undefined) {
                    arr = new Array();
                  }
                  arr.push(obj);
                  groups[tmp[j]] = arr;
                }
              }
            }
          }
        }
      } else {
        cfg.group = [''];
        for (i = 0; i < data.length; i++) {
          let obj = this.parseIssueStrToJson(data[i].body);
          if (obj) {
            let arr = groups[''];
            if (arr == undefined) {
              arr = new Array();
            }
            arr.push(obj);
            groups[''] = arr;
          }
        }
      }
    }
    return groups;
  },
  getIssuesAPIForSites(cfg) {
    let el = $(cfg.el)[0];
    $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');
    this.requestIssuesAPI(cfg.api, function(data){
      $(el).find('.loading').remove();
      let dt = IssuesAPI.groupIssuesData(cfg, data);
      let groupTitles = Object.keys(dt);
      cfg.group.forEach((groupTitle, i) => {
        let issues = dt[groupTitle];
        if (issues && issues.length > 0) {
          if (groupTitle.length > 0) {
            $(el).append('<h2>' + groupTitle + '</h2>');
          } else if (name == '' && groupTitles.length > 1) {
            $(el).append('<h2>' + '未分组' + '</h2>');
          }
          $(el).append('<div class="site-card-group ' + i + '"></div>');
          // layout items
          for (j = 0; j < issues.length; j++) {
            let issue = issues[j];
            let imgTag = '';
            if (issue.screenshot && issue.screenshot.length > 0) {
              imgTag = '<div class="img"><img src="' + issue.screenshot + '" onerror="javascript:this.src=\'https://image.thum.io/get/width/1024/crop/768/' + issue.url + '\';"/></div>';
            } else {
              imgTag = '<div class="img"></div>';
            }
            let infoTag = '<div class="info">';
            if (issue.avatar && issue.avatar.length > 0) {
              infoTag += '<img src="' + issue.avatar + '" onerror="javascript:this.src=\'https://image.thum.io/get/width/1024/crop/768/' + issue.url + '\';"/>';
            }
            infoTag += '<span class="title">' + issue.title + '</span><span class="desc">' + issue.description + '</span></div>';
            let cardTag = "<a class='site-card' target='_blank' href='" + issue.url + "'>" + imgTag + infoTag + "</a>";
            $(el).find('.site-card-group.' + i).append(cardTag);
          }
        }
      });
    }, function() {
      $(el).find('.loading i').remove();
      $(el).find('.loading p').text('加载失败，请稍后重试。');
    });
  },
  getIssuesAPIForTimeline(cfg) {
    let el = $(cfg.el)[0];
    $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');
    this.requestIssuesAPI(cfg.api, function(data){
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
    }, function() {
      $(el).find('.loading i').remove();
      $(el).find('.loading p').text('加载失败，请稍后重试。');
    });
  },
  request() {
    let els = document.getElementsByClassName('issues-api');
    for (var i = 0; i < els.length; i++) {
      let el = els[i];
      let api = el.getAttribute('api');
      let group = el.getAttribute('group');
      var cfg = new Object();
      cfg.class = el.getAttribute('class');
      cfg.el = el;
      cfg.api = api;
      cfg.group = group;
      if (cfg.class.split(' ').includes('sites')) {
        this.getIssuesAPIForSites(cfg);
      } else if (cfg.class.split(' ').includes('timeline')) {
        this.getIssuesAPIForTimeline(cfg);
      }
    }
  }
};
IssuesAPI.request();
document.addEventListener('pjax:complete', function () {
  IssuesAPI.request();
});
