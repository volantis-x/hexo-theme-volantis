// Twikoo 跨平台同步脚本
// 确保不同域名的相同文章使用相同的评论标识符

(function() {
  // 标准化路径函数
  function normalizePath(path) {
    // 移除可能的前缀
    path = path.replace(/^\/blog\//, '/');
    path = path.replace(/^\/hexo\//, '/');
    
    // 确保以 / 开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // 移除末尾的 index.html
    path = path.replace(/\/index\.html$/, '/');
    
    // 移除末尾的 .html
    path = path.replace(/\.html$/, '');
    
    return path;
  }
  
  // 重写 Twikoo 初始化
  if (typeof window.twikooInit === 'undefined') {
    window.twikooInit = function(config) {
      // 标准化路径
      if (!config.path || config.path === window.location.pathname) {
        config.path = normalizePath(window.location.pathname);
      }
      
      // 添加调试信息
      console.log('Twikoo 同步路径:', config.path);
      
      return window.twikoo.init(config);
    };
  }
})();