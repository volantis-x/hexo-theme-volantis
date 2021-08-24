/* global hexo */

'use strict';

hexo.on('generateBefore', () => {
  // Merge config.
  require('./lib/config')(hexo);
  require('./lib/utils')(hexo);
  require('./lib/renderStylus')(hexo);
});

hexo.on('ready', () => {
  const { version } = require('../../package.json');
  hexo.log.info(`
============================================================
  Volantis ${version}
  Docs: https://volantis.js.org/
  Repo: https://github.com/volantis-x/hexo-theme-volantis/
============================================================`);
});
