/* global hexo */

'use strict';

const configLib = require('./lib/config');
const TagUtilsLib = require('./lib/tag-utils');
const renderStylusLib = require('./lib/render-stylus');
const checkEnvironmentLib = require('./lib/check-environment');
const { version } = require('../../package.json');

hexo.on('generateBefore', () => {
  // Merge config.
  require('./lib/config')(hexo);
  require('./lib/tree-doc')(hexo);
  require('./lib/tree-topic')(hexo);
  require('./lib/tree-notebooks')(hexo);
  require('./lib/tag-utils')(hexo);
  require('./lib/render-stylus')(hexo);
  configLib(hexo);
  TagUtilsLib(hexo);
  renderStylusLib(hexo);
  if (hexo.theme.config.debug === "env") {
    checkEnvironmentLib(hexo);
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
