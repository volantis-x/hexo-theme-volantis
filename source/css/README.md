# 样式文件说明

## 样式拆分说明

方案是对 https://blog.skk.moe/post/improve-fcp-for-my-blog/ 的开源实现

### first.styl

首屏样式, 内含 首屏基础样式、 cover、 navbar、 首屏search、首屏暗黑模式、首屏字体 等样式, 首屏样式采用硬编码的方式写在HTML中.

内联硬编码自动化方案 see：scripts/helpers/first-style/index.js

### style.styl

异步加载样式, 除首屏样式外的其他样式, 最终生成 /css/style.css 异步加载.

## 暗黑模式样式说明

暗黑模式样式被拆分为首屏暗黑模式样式和异步暗黑模式样式，其中在 source/css/ 文件夹下：

_first/dark_first.styl ： 包含 首屏暗黑模式样式 的 暗黑模式 CSS 变量 和 强制覆盖样式

_style/_plugins/_dark ： 异步暗黑模式样式文件夹

_style/_plugins/_dark/dark_async.styl ： 包含 异步暗黑模式样式 的 暗黑模式 CSS 变量

_style/_plugins/_dark/dark_plugins.styl ： 包含 异步暗黑模式样式 的 强制覆盖样式

