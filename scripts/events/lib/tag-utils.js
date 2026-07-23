// volantis v6 标签插件 命令解析器
// 同时兼容 volantis v5、 stellar v1 的插件参数写法
// volantis v4 的参数写法无法兼容 注意文本区有英文逗号的情况

'use strict';

module.exports = hexo => {
  hexo.args = {
    // volantis v5
    map_volantis_v5: (args) => {
      const args = args.join(' ').split('::');
      return args;
    },
    // volantis v4
    map_volantis_v4: (args) => {
      const args = args.join(' ').split(',');
      return args;
    },
    // stellar v1
    // 将命令行参数数组解析为键值对映射（map），并根据预定义的键名列表（keys）和位置参数列表（others）进行归类、重组。
    // 将类似 ["name:Alice", "age:30", "https://example.com", "extra"] 且已知 keys=["name", "age"]、others=["url", "desc"] 的输入，解析为 { name: "Alice", age: "30", url: "https://example.com", desc: "extra" }。纯 URL 和多余参数会被智能分配到指定位置参数上。
    map_stellar_v1: (args, keys, others) => {
      // 若 args 不是数组，直接返回原值。
      if (Array.isArray(args) == false) {
        return args;
      }
      let map = { others: Array() };
      // 遍历每个参数
      args.forEach((arg, i) => {
        let kv = arg.trim();
        // 如果是纯 URL（包含 :// 且冒号只出现一次，即 protocol://host 形式），直接放入 map.others。
        if (kv.includes('://') && kv.split(':').length == 2) {
          // 纯 url
          map.others.push(kv);
        } else {
          // 否则用冒号 : 分割
          kv = kv.split(':');
          if (kv.length > 1) {
            // 若分割后有多段，且第一段（键）在 keys 白名单中，则将该键及其余部分作为值存入 map（例如 name:Alice → map.name = "Alice"）。
            if (keys.includes(kv[0]) == true) {
              map[kv.shift()] = kv.join(':');
            } else {
              // 若键不在白名单中，或只有一段（无冒号），则整体放入 map.others。
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
        // 将 map.others 中的值按顺序赋给 others 指定的键名。
        others.forEach((arg, i) => {
          map[arg] = map.others.shift();
        });
        // 最后一段合并到最后一个参数中
        // 若 map.others 仍有剩余，则将所有剩余值用空格拼接后，追加到 others 最后一个键对应的值中（实现“最后一段合并”）。
        if (map.others.length > 0) {
          map[others[others.length - 1]] += ' ' + map.others.join(' ');
          map.others = [];
        }
      }
      return map;
    },
    // 将 map 对象中的指定键值对，拼接成 HTML 标签属性的字符串数组。
    // 从 { class: "btn", id: "submit" } 生成 ['class="btn"', 'id="submit"']，最终可以组合成 <div class="btn" id="submit">。
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
    // 将 map 对象中的指定键值对，拼接成 URL 查询参数字符串。
    // 从 { name: "Alice", age: "30" } 生成 "name=Alice&age=30"，可直接附加到 URL 后面。
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
  hexo.utils = {
    icon: (key, args) => {
      const { icons } = hexo.theme.config
      var result = ''
      if (icons[key]) {
        result = icons[key]
      } else {
        result = key
      }
      if (result.startsWith('/') || result.startsWith('https://') || result.startsWith('http://')) {
        return `<img ${args?.length > 0 ? args : ''} src="${result}" />`
      } else {
        return result
      }
    }
  };
  // volantis v6
  hexo.args.map = (args, keys, others) => {
      if (/::/g.test(args)) {
        return [hexo.args.map_volantis_v5(args), "v5"];
      } else {
        return [hexo.args.map_stellar_v1(args, keys, others), "v6"];
      }
       
    };
};
