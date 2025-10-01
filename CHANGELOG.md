# Changelog

## [5.8.1](https://github.com/volantis-x/hexo-theme-volantis/compare/5.8.0...5.8.1) (2025-08-10)


### Bug Fixes

* 修改artalk的ejs文件适配2.9.1新版本 ([#943](https://github.com/volantis-x/hexo-theme-volantis/issues/943)) ([2447977](https://github.com/volantis-x/hexo-theme-volantis/commit/2447977efad1a17177686cf4ed68d23c49809bce))

## [5.8.0](https://github.com/volantis-x/hexo-theme-volantis/compare/5.7.10...5.8.0) (2023-05-06)


### Features

* **head and body template:** 支持在front-matter中动态插入css和js，支持引入多个 ([#883](https://github.com/volantis-x/hexo-theme-volantis/issues/883)) ([3146360](https://github.com/volantis-x/hexo-theme-volantis/commit/3146360ecf3955314768fde46226632bf86b4e45))

## [5.7.10](https://github.com/volantis-x/hexo-theme-volantis/compare/5.7.9...5.7.10) (2023-04-28)


### Bug Fixes

* 修复移动端菜单栏按钮点击没有收起二级子菜单的问题 ([#880](https://github.com/volantis-x/hexo-theme-volantis/issues/880)) ([bb7738b](https://github.com/volantis-x/hexo-theme-volantis/commit/bb7738b9dcfa375e263ee4ca648d437703b15182))

## [5.7.9](https://github.com/volantis-x/hexo-theme-volantis/compare/5.7.8...5.7.9) (2023-04-26)


### Bug Fixes

* 修复移动端web菜单栏无法收缩；特性：浏览器滚动条复杂样式从配置文件传入 ([#877](https://github.com/volantis-x/hexo-theme-volantis/issues/877)) ([91288f9](https://github.com/volantis-x/hexo-theme-volantis/commit/91288f916dee43baadac9750a39de6d3933a6737))

## [5.7.8](https://github.com/volantis-x/hexo-theme-volantis/compare/5.7.7...5.7.8) (2023-04-01)


### Bug Fixes

* **LeancloudCounter:** 修复 leancloud 配置特定 appId 值导致 custom_api_server 不生效问题 ([#861](https://github.com/volantis-x/hexo-theme-volantis/issues/861)) ([90e470d](https://github.com/volantis-x/hexo-theme-volantis/commit/90e470d8e2e0125f468acc81820ef7addc91f723))

## [5.7.7](https://github.com/volantis-x/hexo-theme-volantis/compare/v5.7.6...5.7.7) (2022-11-24)


### Bug Fixes

* **#824:** 边界条件 ([13f4e0e](https://github.com/volantis-x/hexo-theme-volantis/commit/13f4e0e6be464519a1ea3e020b5da1b1396c1254))
* yml string to list ([11ab545](https://github.com/volantis-x/hexo-theme-volantis/commit/11ab545b52967e639938be00f78cc6bdefa885d4))


### Performance Improvements

* **debug:** description 的配置检查改为warn警告并使用默认值 [#801](https://github.com/volantis-x/hexo-theme-volantis/issues/801) ([f82f547](https://github.com/volantis-x/hexo-theme-volantis/commit/f82f54718b081439ea40e5a105ba81be15c60de0))
* **readmore:** readmore:false 优先级高于 auto_excerpt:true ([302bf4e](https://github.com/volantis-x/hexo-theme-volantis/commit/302bf4e101689c0df9e0b8cbb1778dd18a8d5567))

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
