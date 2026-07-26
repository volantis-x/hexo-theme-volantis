/* global hexo */

'use strict';

const { version } = require('../../package.json');

hexo.on('generateBefore', () => {
  // Merge config.
  require('./lib/config')(hexo);
  require('./lib/cdn')(hexo);
  require('./lib/tree-doc')(hexo);
  require('./lib/tree-topic')(hexo);
  require('./lib/tree-notebooks')(hexo);
  require('./lib/tag-utils')(hexo);
  require('./lib/render-stylus')(hexo);
  if (hexo.theme.config.debug === "env") {
    require('./lib/check-environment')(hexo);
  }
});

hexo.on('generateAfter', () => {
  require('./lib/tree-merge-posts')(hexo);
});


hexo.on('ready', () => {
  hexo.log.info(`
============================================================
  Volantis ${version}
  Docs: https://volantis.js.org/
  Repo: https://github.com/volantis-x/hexo-theme-volantis/
============================================================`);
});
