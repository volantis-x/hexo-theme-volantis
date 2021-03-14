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
            reject('请求超时');
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
          if (response.ok) {
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
        const arr = cfg.group.split(':');
        if (arr.length > 1) {
          const groupKey = arr[0];
          let groupList = arr[1];
          if (groupKey && groupList) {
            groupList = groupList.split(',');
          }
          cfg.group = groupList;
          for (i = 0; i < data.length; i++) {
            const obj = this.parseIssueStrToJson(data[i].body);
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
          const obj = this.parseIssueStrToJson(data[i].body);
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
    const el = $(cfg.el)[0];
    $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');
    this.requestIssuesAPI(cfg.api, function(data) {
      $(el).find('.loading').remove();
      const dt = IssuesAPI.groupIssuesData(cfg, data);
      const groupTitles = Object.keys(dt);
      const isuuleSitesTemp =
        '{{each groups groupTitle}}' +
        ' {{set issues = dt[groupTitle]}}' +
        ' {{if issues && issues.length > 0}}' +
        '   {{if groupTitle.length > 0}}' +
        '     <h2>{{groupTitle}}</h2>' +
        '   {{else if groupTitles.length > 1}}' +
        '     <h2>未分组</h2>' +
        '   {{/if}}' +
        '   <div class="site-card-group">' +
        '     {{each issues issue}}' +
        '       {{set screenshot = "https://image.thum.io/get/width/1024/crop/768/" + issue.url }}' +
        '       <a class="site-card" target="_blank" href="{{issue.url}}">' +
        '         <div class="img">' +
        '           <img src="{{issue.screenshot || screenshot}}" />' +
        '         </div>' +
        '         <div class="info">' +
        '           <img src="{{issue.avatar || screenshot}}" />' +
        '           <span class="title">{{issue.title}}</span><span class="desc">{{issue.description}}</span>' +
        '         </div>' +
        '       </a>' +
        '     {{/each}}' +
        '   </div>' +
        ' {{/if}}' +
        '{{/each}}';
      $(el).append(template.render(isuuleSitesTemp, {groups: cfg.group, dt: dt, groupTitles: groupTitles}));
    }, function() {
      $(el).find('.loading i').remove();
      $(el).find('.loading p').text('加载失败，请稍后重试。');
    });
  },
  getIssuesAPIForTimeline(cfg) {
    const el = $(cfg.el)[0];
    $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');
    this.requestIssuesAPI(cfg.api, function(data) {
      $(el).find('.loading').remove();
      const timelineTemp =
          '{{if data.length > 0}}' +
          ' {{each data item}}' +
          '   <div class="timenode">' +
          '     <div class="meta">' +
          '       <p></p><p>{{item.title}}&nbsp;&nbsp;' +
          '         <a class="comments" target="_blank" href="{{item.html_url}}">' +
          '           <i class="fa fa-comment-dots fa-fw"></i>{{item.comments}}' +
          '         </a>' +
          '       </p><p></p>' +
          '     </div>' +
          '     <div class="body"><p>{{item.body}}</p>></div>' +
          '   </div>' +
          ' {{/each}}' +
          '{{/if}}';
      $(el).append(template.render(timelineTemp, data));
    }, function() {
      $(el).find('.loading i').remove();
      $(el).find('.loading p').text('加载失败，请稍后重试。');
    });
  },
  request() {
    const els = document.getElementsByClassName('issues-api');
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const cfg = {
        el: el,
        api: el.getAttribute('api'),
        group: el.getAttribute('group'),
        classList: el.getAttribute('class')
      }
      if (cfg.classList.split(' ').includes('sites')) {
        this.getIssuesAPIForSites(cfg);
      } else if (cfg.classList.split(' ').includes('timeline')) {
        this.getIssuesAPIForTimeline(cfg);
      }
    }
  }
};
IssuesAPI.request();
document.addEventListener('pjax:complete', function() {
  IssuesAPI.request();
});
