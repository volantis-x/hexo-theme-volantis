# Changelog

## [7.0.0-alpha.0](https://github.com/volantis-x/hexo-theme-volantis/compare/6.0.0-alpha.0...v7.0.0-alpha.0) (2025-11-14)


### ⚠ BREAKING CHANGES

* remove pjax

### Features

* **fcircle:** 支持初始文章数量设置、本地缓存时间设置 ([e8538d1](https://github.com/volantis-x/hexo-theme-volantis/commit/e8538d1d6ff5c16102cd3ea0cfa46805724db37f))
* **friend_card color:** 友链块颜色添加 ([#938](https://github.com/volantis-x/hexo-theme-volantis/issues/938)) ([0df39f6](https://github.com/volantis-x/hexo-theme-volantis/commit/0df39f6f534f0b79705bc583f4dcf05c13dd3cf3))
* **TianliGPT:** 新增 AI 摘要 ([#885](https://github.com/volantis-x/hexo-theme-volantis/issues/885)) ([72c51a0](https://github.com/volantis-x/hexo-theme-volantis/commit/72c51a0f4f7489b3b79337be44a8087c1778ed20))
* Update Artalk Version to 2.5.1 ([e9cd1e2](https://github.com/volantis-x/hexo-theme-volantis/commit/e9cd1e24ced4110dd5b8118c08fc006b22b2ea01))
* 增加轻量朋友圈 ([#940](https://github.com/volantis-x/hexo-theme-volantis/issues/940)) ([600d465](https://github.com/volantis-x/hexo-theme-volantis/commit/600d46538a2c7cf7dec7899d321b0e6798038f64))


### Bug Fixes

* 862 ([7099d82](https://github.com/volantis-x/hexo-theme-volantis/commit/7099d82fafea76828b852499b6ab705ba04a97d7))
* Aplayer显示问题 ([#939](https://github.com/volantis-x/hexo-theme-volantis/issues/939)) ([e433cf7](https://github.com/volantis-x/hexo-theme-volantis/commit/e433cf7055b966d1bea8f959ce84d42d93700eed))
* aplayer显示问题（2） ([#942](https://github.com/volantis-x/hexo-theme-volantis/issues/942)) ([b18900c](https://github.com/volantis-x/hexo-theme-volantis/commit/b18900c61e3d596b586b9402742f5dbd30d10a41))
* **artalk:** darkmode ([8d2394a](https://github.com/volantis-x/hexo-theme-volantis/commit/8d2394aa3e8a665702f26a686e85adcf59cd114d))
* **artalk:** update version to 2.7.3 ([fa776c3](https://github.com/volantis-x/hexo-theme-volantis/commit/fa776c3ecae38d1c760794c6784dc050ee1cb0d7))
* **artalk:** 无法设置不使用后端配置 ([a0d91de](https://github.com/volantis-x/hexo-theme-volantis/commit/a0d91de6286e2571e8d2ff11b0108f0a6a2bb423))
* **highlight:** hljs [#888](https://github.com/volantis-x/hexo-theme-volantis/issues/888) ([5dc32b4](https://github.com/volantis-x/hexo-theme-volantis/commit/5dc32b4cfcba580b8592d229c090c6c298c62e38))
* import app for site root ([9678bbb](https://github.com/volantis-x/hexo-theme-volantis/commit/9678bbb5503cbe854f8b837397027ea101ddb997))
* **tianligpt:** bug ([e800e6b](https://github.com/volantis-x/hexo-theme-volantis/commit/e800e6b549ef64052d8e2507b410d43c9bb8d841))
* wrong behavior when there's no img provided for qrcode ([#840](https://github.com/volantis-x/hexo-theme-volantis/issues/840)) ([d19ad96](https://github.com/volantis-x/hexo-theme-volantis/commit/d19ad9612fe22d2925e1a5efe25deb0f7e96b931))
* 修复waline v3的引入问题 ([#926](https://github.com/volantis-x/hexo-theme-volantis/issues/926)) ([c4535bb](https://github.com/volantis-x/hexo-theme-volantis/commit/c4535bbd2ea799eba911785c743ad351d0c6671f))
* 修复waline v3的黑暗模式 ([#927](https://github.com/volantis-x/hexo-theme-volantis/issues/927)) ([3f44402](https://github.com/volantis-x/hexo-theme-volantis/commit/3f44402e62e2859b5ef732c6da350379864e68ff))
* 修复图片alt为空时Fancybox caption输出undefined的问题 ([#925](https://github.com/volantis-x/hexo-theme-volantis/issues/925)) ([faae66b](https://github.com/volantis-x/hexo-theme-volantis/commit/faae66b9662e83bf3c53bf21678c3f5ffc70a553))
* 对友链块一些语法修正 ([#945](https://github.com/volantis-x/hexo-theme-volantis/issues/945)) ([f66b6cc](https://github.com/volantis-x/hexo-theme-volantis/commit/f66b6ccc997a41ab54e9ddd6a9b8f33edf2dee30))
* 阅读模式打开再关闭之后，导航栏消失的问题 ([#928](https://github.com/volantis-x/hexo-theme-volantis/issues/928)) ([54c9c59](https://github.com/volantis-x/hexo-theme-volantis/commit/54c9c590fc8012af39a109c09b97b0a689f82569))


### Miscellaneous Chores

* remove pjax ([bafb07c](https://github.com/volantis-x/hexo-theme-volantis/commit/bafb07c0120aae2602f2241a52dc16002941206d))

## [5.7.6](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.5...v5.7.6) (2022-09-05)


### Performance Improvements

* **debug:** env pjax rightMenus ([7b569cc](https://github.com/volantis-x/hexo-theme-volantis/commit/7b569cce425c0b630f00e378449c4d8809e471fe))
* **side:** 如果 sidebar 为空，隐藏 sidebar ([a264a8c](https://github.com/volantis-x/hexo-theme-volantis/commit/a264a8c6f7cb8fd2537af227bd0297fcb17d720c))

## [5.7.5](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.4...v5.7.5) (2022-08-25)


### Bug Fixes

* **pandown:** Uncaught TypeError: pandown is not a function ([371b1ec](https://github.com/volantis-x/hexo-theme-volantis/commit/371b1ece729a719f102854d3175ce440f90b4a14))
* search ([7f11915](https://github.com/volantis-x/hexo-theme-volantis/commit/7f11915c4c672f427a6044e2614ed85e7e052587))

## [5.7.4](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.3...v5.7.4) (2022-08-15)


### Bug Fixes

* **#793:** 修复空值 ([302c98f](https://github.com/volantis-x/hexo-theme-volantis/commit/302c98fc5b0c725fb77c6bb33d7537f8f1f2062f))

## [5.7.3](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.2...v5.7.3) (2022-08-15)


### Bug Fixes

* **#781:** content_visibility: false ([0c719be](https://github.com/volantis-x/hexo-theme-volantis/commit/0c719be17e8affb28dd42c9c8bfb52e3e21d9790))
* **#793:** cdn_version: false ([cf60678](https://github.com/volantis-x/hexo-theme-volantis/commit/cf6067860312fbd6afd4ba6c14867d9ef86832fd))
* **#793:** 移除默认配置 ([4d82dff](https://github.com/volantis-x/hexo-theme-volantis/commit/4d82dff4d41c513cfa0124cbed7e42b60236d9de))
* **#798:** footer version link 404 ([a2a2d90](https://github.com/volantis-x/hexo-theme-volantis/commit/a2a2d90dc96fd00bb14cd742e0f05d253ef4ebed))

## [5.7.2](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.1...v5.7.2) (2022-08-01)


### Bug Fixes

* fix Chinese urlencode displaying problem in permalink ([#794](https://github.com/volantis-x/hexo-theme-volantis/issues/794)) ([677b820](https://github.com/volantis-x/hexo-theme-volantis/commit/677b8207f7e0863470ffcb8fd9f287ca7ec1e9cf))
* 加引号处理herf属性中空格导致的地址错误 ([#796](https://github.com/volantis-x/hexo-theme-volantis/issues/796)) ([2bb4043](https://github.com/volantis-x/hexo-theme-volantis/commit/2bb4043bbf58eb6080e3e5743817ad4420409937))

## [5.7.1](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.0...v5.7.1) (2022-07-26)


### Bug Fixes

* drop node 14 ([694046b](https://github.com/volantis-x/hexo-theme-volantis/commit/694046b934be663001226fedd4fb6b2535ec9d59))

## [5.7.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.6.0...v5.7.0) (2022-07-15)


### Features

* add LingQue.Monitor ([f6f166e](https://github.com/volantis-x/hexo-theme-volantis/commit/f6f166e0e2834bc3c765383b4c21643df9bf7dc6))
* **tag:** add pandown ([#785](https://github.com/volantis-x/hexo-theme-volantis/issues/785)) ([efc1966](https://github.com/volantis-x/hexo-theme-volantis/commit/efc1966f1b976a0c59ef5b08da41838bda0e7a83))


### Bug Fixes

* **artalk:** imageUploader ([#782](https://github.com/volantis-x/hexo-theme-volantis/issues/782)) ([c573d0c](https://github.com/volantis-x/hexo-theme-volantis/commit/c573d0c59b3dda882d88475ce44635647c64e4eb))

## [5.6.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.5.0...v5.6.0) (2022-06-30)


### ⚠ BREAKING CHANGES

* **artalk:** imgUploader -> imageUploader

### Bug Fixes

* **comment:** disqus ([6656237](https://github.com/volantis-x/hexo-theme-volantis/commit/665623793b7610f2d9be8c1338c23e82f1b98159))
* **highlightjs:** cdn npm ([2caa1fb](https://github.com/volantis-x/hexo-theme-volantis/commit/2caa1fb1e630381ed9ea019038a4d8580d17703c))
* **meta:** counter ([7470b7a](https://github.com/volantis-x/hexo-theme-volantis/commit/7470b7abcfbc545e5552363c85b9562e42e75541))
* **rightmenu:** [#779](https://github.com/volantis-x/hexo-theme-volantis/issues/779) ([9023ce5](https://github.com/volantis-x/hexo-theme-volantis/commit/9023ce573d8ad0595990dafb13553817d749fee8))


### Code Refactoring

* **artalk:** imgUploader -> imageUploader ([8cde195](https://github.com/volantis-x/hexo-theme-volantis/commit/8cde195b30c2111338ac2bcec45bcaf145867ccf))


### Miscellaneous Chores

* release 5.6.0 ([cd60196](https://github.com/volantis-x/hexo-theme-volantis/commit/cd60196d4dc730d9d8d238ad1958f868b103ebfb))

## [5.5.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.4.0...v5.5.0) (2022-06-18)


### Features

* **copyright:** 精确到文章的版权声明 ([1621fbb](https://github.com/volantis-x/hexo-theme-volantis/commit/1621fbb211057b037bb28328a364fbe4fc32df5a))
* **scrollreveal&style.css:** slow network ([c31f54a](https://github.com/volantis-x/hexo-theme-volantis/commit/c31f54a01537bd68b83ed289a406b154499d8f21))
* **widget:** 允许侧边栏卡片的粘性定位 ([5d5c9d5](https://github.com/volantis-x/hexo-theme-volantis/commit/5d5c9d5e7e288eb654922c4659dfdc5a1442ceda))


### Bug Fixes

* **artalk:** 深色模式主动切换修复 ([e4a7e2d](https://github.com/volantis-x/hexo-theme-volantis/commit/e4a7e2d247a8ab63365b1c0c6fc04e8f9bdb5656))
* **background:** [#776](https://github.com/volantis-x/hexo-theme-volantis/issues/776) bing ([26dc230](https://github.com/volantis-x/hexo-theme-volantis/commit/26dc230ab6377356edb86a21e7c7267433110ac1))
* **comment:** 指定地址的评论计数统计 ([482601a](https://github.com/volantis-x/hexo-theme-volantis/commit/482601ae02ce686bce1aff6b961dd6ead28a6985))
* **rightmenu:** aplayer disable ([1c89b63](https://github.com/volantis-x/hexo-theme-volantis/commit/1c89b631371c89975f9977550d8a5c2f586b5fd5))
* **walinecount:** 移除重复代码 ([2e2e05d](https://github.com/volantis-x/hexo-theme-volantis/commit/2e2e05d7ca19e94f6036c48b3448c58d0401e10b))
* **widget:** z-index ([c9c823c](https://github.com/volantis-x/hexo-theme-volantis/commit/c9c823cf772f5c26f54ddc82064e5bba79c76331))


### Performance Improvements

* **GLOBAL_CONFIG:** 减少不必要的配置输出 ([2aa234f](https://github.com/volantis-x/hexo-theme-volantis/commit/2aa234f47be05c711f4af526d0e293f5dd8e7926))

## [5.4.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.3.2...v5.4.0) (2022-06-09)


### Features

* **VolantisRequest:** Fetch, POST, Get ([ea98dbc](https://github.com/volantis-x/hexo-theme-volantis/commit/ea98dbcc4c3a9bfc0bf6de452e0da826276ff29c))


### Bug Fixes

* **fcircle:** CDN ([#765](https://github.com/volantis-x/hexo-theme-volantis/issues/765)) ([35a2e97](https://github.com/volantis-x/hexo-theme-volantis/commit/35a2e971da07eb30e4cb9a0fdeaafe74580cbcd0))

### [5.3.2](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.3.1...v5.3.2) (2022-05-24)


### Bug Fixes

* **check:** Check environment first ([f5692dd](https://github.com/volantis-x/hexo-theme-volantis/commit/f5692dd862cb0790a656866853e41908b2967de6))
* **revisioned:** calcFileHash ([1402b9e](https://github.com/volantis-x/hexo-theme-volantis/commit/1402b9ea7747bdcf60e6190b243970567c033528))

### [5.3.1](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.3.0...v5.3.1) (2022-05-23)


### Bug Fixes

* **bbtalk:** js config ([4bb7a12](https://github.com/volantis-x/hexo-theme-volantis/commit/4bb7a12a8d1ab384a223b946e7da1f3ecf60c9ac))

## [5.3.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.2.0...v5.3.0) (2022-05-22)


### Features

* **meta:** add artalk comment count ([75c5eeb](https://github.com/volantis-x/hexo-theme-volantis/commit/75c5eeb688d52289f466d8e26b84352d7dae74b9))


### Bug Fixes

* **artalk:** fancybox/darkmode ([c03684d](https://github.com/volantis-x/hexo-theme-volantis/commit/c03684dd6d7feced55969bddc4c357a65ec0333c))
* **meta_library:** counter ([7d42316](https://github.com/volantis-x/hexo-theme-volantis/commit/7d42316a80909125938774b9685b4962486ecc65))

## [5.2.0](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.1.1...v5.2.0) (2022-05-21)


### Features

* **artalk:** Add support for using custom imgUploader ([b69c502](https://github.com/volantis-x/hexo-theme-volantis/commit/b69c502565d8b4d6d1ad1a58fdc3fc00ac200cef))

### [5.1.1](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.1.0...v5.1.1) (2022-05-19)


### Bug Fixes

* **#761:** overflow ([74e0d04](https://github.com/volantis-x/hexo-theme-volantis/commit/74e0d04a47d17c513f0d29ecaceb49b51d63ee18))

## [5.1.0](https://github.com/volantis-x/hexo-theme-volantis/compare/5.0.0...v5.1.0) (2022-05-19)


### Features

* release-please ([97efd35](https://github.com/volantis-x/hexo-theme-volantis/commit/97efd352d3f44d7f12a813db89c07ab0ba56e188))


### Bug Fixes

* 703 ([034d684](https://github.com/volantis-x/hexo-theme-volantis/commit/034d6847050472d7fe89335d65f371112c7449e8))
* 706 移动端菜单栏异常 ([e1f63b3](https://github.com/volantis-x/hexo-theme-volantis/commit/e1f63b33d47a992c278eb51471e5e2816ebc138f))
* 713 ([e1233de](https://github.com/volantis-x/hexo-theme-volantis/commit/e1233de457648ea46597a5ec4875efc5011e58b5))
* 740 ([a845788](https://github.com/volantis-x/hexo-theme-volantis/commit/a845788c9dbc1c251e93ca6e8b557d6e1bfb849e))
* Discuss 评论系统适配深色模式 ([#752](https://github.com/volantis-x/hexo-theme-volantis/issues/752)) ([86002b6](https://github.com/volantis-x/hexo-theme-volantis/commit/86002b67af0060e21e9ac2514aeee64377e01e69))
* error friendly ([3bffeab](https://github.com/volantis-x/hexo-theme-volantis/commit/3bffeabc2399cd3dda5816c13b1b56be25d7f95f))
* no-title ([48c70f8](https://github.com/volantis-x/hexo-theme-volantis/commit/48c70f8c13dd4d6dc7fa1bb5226c5987fde7971f))
* **twikoo:** 所有页面都说同一个path的bug ([14de40b](https://github.com/volantis-x/hexo-theme-volantis/commit/14de40bbe12e1e1679a60a58e0d501625d0e7ff2))
* 为 Discuss 添加最低高度 ([#742](https://github.com/volantis-x/hexo-theme-volantis/issues/742)) ([9bf70de](https://github.com/volantis-x/hexo-theme-volantis/commit/9bf70debfb8a38da89a7bf5f7bd7634d504aa457))
* 修复Discuss评论区表情包在深色模式下，css权重低的bug ([#753](https://github.com/volantis-x/hexo-theme-volantis/issues/753)) ([872baf7](https://github.com/volantis-x/hexo-theme-volantis/commit/872baf7481b1bb6e47381638c5c346fb232a398a))
