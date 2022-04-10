/**
 * utils.js v1 | https://github.com/xaoxuu/hexo-theme-stellar/
 */

// stellar 标签插件 命令解析器


'use strict';

module.exports = hexo => {
  hexo.args = {
    map: (args, keys, others) => {
      if (Array.isArray(args) == false) {
        return args;
      }
      var map = {others: Array()};
      args.forEach((arg, i) => {
        let kv = arg.trim();
        if (kv.includes('://') && kv.split(':').length == 2) {
          // 纯 url
          map.others.push(kv);
        } else {
          kv = kv.split(':');
          if (kv.length > 1) {
            if (keys.includes(kv[0]) == true) {
              map[kv.shift()] = kv.join(':');
            } else {
              map.others.push(kv.join(':'));
            }
          } else if (kv.length == 1) {
            map.others.push(kv[0]);
          }
        }
      });
      // 解析不带 key 的参数
      if (others && others.length > 0 && map.others.length > 0) {
        if (Array.isArray(others) == false) {
          others = [others];
        }
        others.forEach((arg, i) => {
          map[arg] = map.others.shift();
        });
        // 最后一段合并到最后一个参数中
        if (map.others.length > 0) {
          map[others[others.length-1]] += ' ' + map.others.join(' ');
          map.others = [];
        }
      }
      return map;
    },
    joinTags: (args, keys) => {
      if (Array.isArray(keys) == false) {
        keys = [keys];
      }
      var ret = [];
      keys.forEach((key, i) => {
        if (args[key] && args[key].length > 0) {
          ret.push(key + '="' + args[key] + '"');
        }
      });
      return ret;
    },
    joinURLParams: (args, keys) => {
      if (Array.isArray(keys) == false) {
        keys = [keys];
      }
      var ret = [];
      keys.forEach((key, i) => {
        if (args[key] && args[key].length > 0) {
          ret.push(key + '=' + args[key]);
        }
      });
      return ret.join('&');
    }
  };
};
