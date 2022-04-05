/* global hexo */

'use strict';

const crypto = require('crypto');
const hash = (s) => crypto.createHash("sha256").update(s).digest('base64');

// script White list [scripts in event handlers (eg onclick)]. 包含压缩的 inline js
let unsafe_script_list = [
  "this.media='all';this.onload=null",
  'this.media="all",this.onload=null',
  "errorImgAvatar(this)",
  "errorImgCover(this)",
  "return false;",
  "return!1",
  "history.back()",
  "history.forward()",
  "window.location.reload()",
]
// script hash White list
let unsafe_script_hash = ["'sha256-MXV1jvkHrZruEyFEOrQRjKs9WlPZC1V/3RLoKrkoDFQ='"]

function getRandStr(len) {
  var str = '';
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return str;
}
let unsafe_script_list_get = 1
const nonce = getRandStr(15);

hexo.extend.filter.register('after_render:html', function(data) {
  if (!hexo.theme.config.csp.hexo_fliter_sha256) return data;
  let arg = process.argv[2];
  if (arg != "g" && arg != "generate") {
    return data;
  }
  data = data.replace(/<script.*?>/g, function (match) {
    if (/src/g.test(match)) {
      return match;
    }
    if (/type=\"application\/ld\+json\"/g.test(match)) {
      return match;
    }
    return match.replace(/>/g, ` nonce='${nonce}'>`);
  });
  data.replace(/<script.*?>([\s\S]+?)<\/script>/gi, function (match, script) {
    if (/type=\"application\/ld\+json\"/g.test(match)) {
      return match;
    }
    unsafe_script_list.push(script)
    return match;
  });
  return data;
},9999999999999);

hexo.extend.filter.register('after_render:html', function(data) {
  if (!hexo.theme.config.csp.hexo_fliter_sha256) return data;
  let arg = process.argv[2];
  if (arg != "g" && arg != "generate") {
    return data;
  }else{
    if (unsafe_script_list_get) {
      unsafe_script_list=Array.from(new Set(unsafe_script_list))
      unsafe_script_list.forEach(e => {
        unsafe_script_hash.push("'sha256-" + hash(e) + "'")
      });
      unsafe_script_list_get = 0;
    }
    data = data.replace(/script-src 'self' https: 'unsafe-inline'/g, `script-src 'self' https: 'nonce-${nonce}' 'unsafe-hashes' ` + unsafe_script_hash.join(" "));
    return data;
  }
},99999999999999999);
