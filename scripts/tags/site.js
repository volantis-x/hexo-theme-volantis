/**
 * sites.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% sites [only:group1] [not:group2] %}
 */

'use strict';

hexo.extend.tag.register('sites', function(args) {
  args = hexo.args.map(args, ['only', 'not', 'repo', 'api']);
  if (args.only) {
    args.only = args.only.split(',');
  }
  if (args.not) {
    args.not = args.not.split(',');
  }
  var sites = hexo.locals.get('data').sites;
  if (sites == undefined) {
    sites = {};
  }
  if (args.repo) {
    sites = {
      group: {
        api: args.api,
        repo: args.repo
      }
    }
  }
  var el = '<div class="tag-plugin sites-wrap">';
  function groupHeader(group) {
    var header = '<div class="group-header">';
    if (group.title) {
      header += hexo.render.renderSync({text: group.title, engine: 'markdown'}).split('\n').join('');
    }
    if (group.description) {
      header += hexo.render.renderSync({text: group.description, engine: 'markdown'}).split('\n').join('');
    }
    header += '</div>';
    return header;
  }
  function cell(site) {
    if (site.url && site.title) {
      var cell = '<div class="site-card">';
      cell += '<a class="card-link" target="_blank" rel="external noopener noreferrer" href="' + site.url + '">';
      cell += '<img src="' + (site.screenshot || ('https://image.thum.io/get/width/1024/crop/768/' + site.url)) + '" onerror="this.onerror=null;this.classList.add(&quot;loaded&quot;);this.srcset=this.src=&quot;' + hexo.theme.config.default.cover + '&quot;;"/>';
      cell += '<div class="info">';
      cell += '<img src="' + (site.avatar || hexo.theme.config.default.link) + '" onerror="this.onerror=null;this.classList.add(&quot;loaded&quot;);this.srcset=this.src=&quot;' + hexo.theme.config.default.link + '&quot;;"/>';
      cell += '<span class="title">' + site.title + '</span>';
      cell += '<span class="desc">' + (site.description || site.url) + '</span>';
      cell += '</div>';
      cell += '</a></div>'
      return cell;
    } else {
      return '';
    }
  }
  for (let groupId of Object.keys(sites)) {
    function f() {
      if (args.not && args.not.includes(groupId)) {
        return;
      }
      if (groupId in sites) {
        let group = sites[groupId];
        if (group.title || group.description) {
          el += groupHeader(group);
        }
        if (group.repo) {
          el += '<div class="sitesjs-wrap"';
          el += ' id="sites-api"';
          el += ' api="' + (group.api || 'https://issues-api.vercel.app') + '/v1/' + group.repo + '"';
          el += '>';
          el += '<div class="loading-wrap"><svg class="loading" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2709"><path d="M832 512c0-176-144-320-320-320V128c211.2 0 384 172.8 384 384h-64zM192 512c0 176 144 320 320 320v64C300.8 896 128 723.2 128 512h64z" p-id="2710"></path></svg><p></p></div>';
          el += '<div class="group-body"></div>';
          el += '</div>';
        } else if (group.items) {
          el += '<div class="group-body">';
          group.items.forEach((site, i) => {
            el += cell(site);
          });
          el += '</div>';
        }
      }
    }
    if (args.only) {
      if (args.only.includes(groupId)) {
        f();
      }
    } else {
      f();
    }
  }
  el += '</div>';
  return el;
});
