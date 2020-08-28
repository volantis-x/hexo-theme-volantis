/**
 * table.js | https://github.com/volantis-x/hexo-theme-volantis
 */

'use strict';

// {% table title %}
// table markdown
// {% endtable %}

function postTable(args, content) {
  let ret = '';
  ret += '<div class="table">';
  ret += hexo.render.renderSync({text: content, engine: 'markdown'});
  ret += '</div>';
  return ret;
};

hexo.extend.tag.register('table', postTable, {ends: true});
