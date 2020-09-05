function parseIssuesData(cfg, data) {
  let groups = new Object();
  if (data.length > 0) {
    if (cfg.group == undefined) {
      for (i = 0; i < data.length; i++) {
        let obj = groups['x'];
        if (obj == undefined) {
          obj = new Object();
          obj.name = 'x';
          obj.items = [data[i]];
          groups['x'] = obj;
        } else {
          obj.items.push(data[i]);
          groups['x'] = obj;
        }
      }
    } else {
      for (i = 0; i < data.length; i++) {
        let issue = data[i];
        let lbs = issue.labels;
        if (lbs.length > 0) {
          for (j = 0; j < lbs.length; j++) {
            let lb = lbs[j].name;
            if (cfg.group.includes(lb)) {
              let obj = groups[lb];
              if (obj == undefined) {
                obj = new Object();
                obj.name = lbs[j].description;
                obj.items = [issue];
                groups[lb] = obj;
              } else {
                obj.items.push(issue);
                groups[lb] = obj;
              }
            }
          }
        }
      }
    }

  }
  return groups;
}

function getIssuesAPIForSites(cfg) {
  let el = $(cfg.el)[0];
  $(el).append('<div class="loading"><i class="fa fa-cog fa-2x fa-spin"></i><p>正在加载</p></div>');

  $.get(cfg.api, function(data, status) {
    $(el).find('.loading').remove();
    let dt = parseIssuesData(cfg, data);
    for (i = 0; i < cfg.group.length; i++) {
      let lb = cfg.group[i];
      let groupData = dt[lb];
      if (groupData == undefined) {
        continue;
      }
      if (groupData.name) {
        $(el).append('<h2>' + groupData.name + '</h2>');
      }
      $(el).append('<div class="site-card-group ' + lb + '"></div>');
      // layout items
      for (j = 0; j < groupData.items.length; j++) {
        let issue = groupData.items[j];
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
        infoTag += '<span class="title">' + title + '</span><span class="desc">' + desc + '</span></div>';
        let cardTag = "<a class='site-card' target='_blank' href='" + issue.title + "'>" + imgTag + infoTag + "</a>";
        $(el).find('.site-card-group.' + lb).append(cardTag);
      }
    }
  });
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
