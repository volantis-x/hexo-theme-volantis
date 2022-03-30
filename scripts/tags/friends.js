/**
 * friends.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% friends [only:group1] [not:group2] %}
 */

'use strict';

hexo.extend.tag.register('friends', function(args) {
  args = hexo.args.map(args, ['only', 'not', 'repo', 'api']);
  if (args.only) {
    if(/::/g.test(args.only)){
      args.only = args.only.split('::');
    }else{
      args.only = args.only.split(',');
    }
  }
  if (args.not) {
    if(/::/g.test(args.not)){
      args.not = args.not.split('::');
    }else{
      args.not = args.not.split(',');
    }
  }
  var friends = hexo.locals.get('data').friends;
  if (friends == undefined) {
    friends = {};
  }
  if (args.repo) {
    friends = {
      group: {
        api: args.api,
        repo: args.repo
      }
    }
  }
  var el = '<div class="tag-plugin users-wrap">';
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
  function cell(friend) {
    if (friend.url && friend.title) {
      var cell = '<div class="user-card">';
      cell += '<a class="card-link" target="_blank" rel="external noopener noreferrer" href="' + friend.url + '">';
      cell += '<img src="' + (friend.avatar || hexo.theme.config.default.avatar) + '" onerror="errorImgAvatar(this)"/>';
      cell += '<div class="name"><span>' + friend.title + '</span></div>';
      cell += '</a></div>'
      return cell;
    } else {
      return '';
    }
  }
  for (let groupId of Object.keys(friends)) {
    function f() {
      if (args.not && args.not.includes(groupId)) {
        return;
      }
      if (groupId in friends) {
        let group = friends[groupId];
        if (group.title || group.description) {
          el += groupHeader(group);
        }
        if (group.repo) {
          el += '<div class="friendsjs-wrap"';
          el += ' id="friends-api"';
          el += ' api="' + (group.api || 'https://issues-api.vercel.app') + '/v1/' + group.repo + '"';
          el += '>';
          el += '<div class="loading-wrap"><svg class="loading" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2709"><path d="M832 512c0-176-144-320-320-320V128c211.2 0 384 172.8 384 384h-64zM192 512c0 176 144 320 320 320v64C300.8 896 128 723.2 128 512h64z" p-id="2710"></path></svg><p></p></div>';
          el += '<div class="group-body"></div>';
          el += '</div>';
        } else if (group.items) {
          el += '<div class="group-body">';
          group.items.forEach((friend, i) => {
            el += cell(friend);
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
