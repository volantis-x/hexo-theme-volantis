/* global hexo */

'use strict';

const configLib = require('./lib/config');
const stellarTagUtilsLib = require('./lib/stellar-tag-utils');
const renderStylusLib = require('./lib/render-stylus');
const checkEnvironmentLib = require('./lib/check-environment');
const { version } = require('../../package.json');

hexo.on('generateBefore', () => {
  // Merge config.
  configLib(hexo);
  stellarTagUtilsLib(hexo);
  renderStylusLib(hexo);
  if (hexo.theme.config.debug === "env") {
    checkEnvironmentLib(hexo);
  }
});

hexo.on('ready', () => {
  hexo.log.info(`
============================================================
  Volantis ${version}
  Docs: https://volantis.js.org/
  Repo: https://github.com/volantis-x/hexo-theme-volantis/
============================================================`);
});