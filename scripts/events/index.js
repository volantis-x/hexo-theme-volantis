/* global hexo */

'use strict';

hexo.on('generateBefore', () => {
  // Merge config.
  require('./lib/config')(hexo);
  require('./lib/stellar-tag-utils')(hexo);
  require('./lib/render-stylus')(hexo);
  if (hexo.theme.config.debug === "env") {
    require('./lib/check-environment')(hexo);
  }
});

hexo.on('ready', () => {
  const { version } = require('../../package.json');
  hexo.log.info(`
============================================================
  Forked from Volantis ${version}
  Forked by JustPureH2O
  Docs: https://volantis.js.org/
  OriginalRepo: https://github.com/volantis-x/hexo-theme-volantis/
  ForkedRepo: https://github.com/JustPureH2O/hexo-theme-volantis/
============================================================`);
});
