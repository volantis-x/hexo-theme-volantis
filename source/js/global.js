// global.js 此文件硬编码到head中
/************这个文件存放不需要重载的全局变量和全局函数*********/
/**
 * Volantis 主题全局变量
 * 定义 window.volantis 全局对象和基础工具函数，需在所有其他脚本之前同步加载。
 *
 * 模块结构：
 *   volantis.dom          - DOM 选择与封装
 *   volantis.EventListener - 事件监听器管理（Pjax 清理）
 *   volantis.pjax         - Pjax 生命周期回调
 *   volantis.dark         - 暗色模式切换
 *   volantis.js/css       - 动态脚本/样式加载（按需加载用）
 *   volantis.scroll       - 滚动事件引擎
 *   volantis.layoutHelper - 布局注入辅助
 *   volantis.requestAnimationFrame - rAF 兼容封装
 */
// 全局变量和函数
// window.volantis = {}; // volantis 全局变量
/**
 * 内存安全的全局 volantis 对象实现
 * 特性：
 * 1. 支持 window.volantis.xxx = yyy 直观赋值语法
 * 2. 基于 WeakMap 存储数据，自动回收内存
 * 3. 支持属性枚举（如 Object.keys(window.volantis)）
 * 4. 支持删除属性（delete window.volantis.xxx）
 */
(function initializeVolantis() {
  // 1. 初始化 WeakMap 存储实际数据（键：volantisProxy 实例，值：属性键值对）
  const volantisDataStore = new WeakMap();

  // 2. 创建 Proxy 代理处理属性访问
  const volantisProxy = new Proxy({}, {
    /**
     * 拦截属性读取（如 window.volantis.dom）
     * @param {Object} target - 代理目标对象（仅作为占位符，不存储数据）
     * @param {string} prop - 访问的属性名
     * @returns {any} 属性值或 undefined
     */
    get(target, prop) {
      const data = volantisDataStore.get(volantisProxy);
      return data?.[prop]; // 使用可选链避免数据未初始化时的错误
    },

    /**
     * 拦截属性赋值（如 window.volantis.dom = "a"）
     * @param {Object} target - 代理目标对象
     * @param {string} prop - 赋值的属性名
     * @param {any} value - 赋值的属性值
     * @returns {boolean} 赋值是否成功
     */
    set(target, prop, value) {
      // 初始化数据容器（若不存在）
      if (!volantisDataStore.has(volantisProxy)) {
        volantisDataStore.set(volantisProxy, Object.create(null)); // 使用无原型对象避免原型污染
      }
      // 存储属性值
      const data = volantisDataStore.get(volantisProxy);
      data[prop] = value;
      return true; // 符合 Proxy 规范，返回成功标志
    },

    /**
     * 拦截属性删除（如 delete window.volantis.dom）
     * @param {Object} target - 代理目标对象
     * @param {string} prop - 要删除的属性名
     * @returns {boolean} 删除是否成功
     */
    deleteProperty(target, prop) {
      const data = volantisDataStore.get(volantisProxy);
      if (!data || !Object.prototype.hasOwnProperty.call(data, prop)) {
        return false; // 属性不存在，删除失败
      }
      delete data[prop];
      // 若数据为空，清理 WeakMap 条目（优化内存回收）
      if (Object.keys(data).length === 0) {
        volantisDataStore.delete(volantisProxy);
      }
      return true;
    },

    /**
     * 拦截属性枚举（如 Object.keys(window.volantis)）
     * @param {Object} target - 代理目标对象
     * @returns {string[]} 可枚举的属性名数组
     */
    ownKeys(target) {
      const data = volantisDataStore.get(volantisProxy);
      return data ? Object.keys(data) : [];
    },

    /**
     * 拦截属性描述符查询（如 Object.getOwnPropertyDescriptor）
     * @param {Object} target - 代理目标对象
     * @param {string} prop - 属性名
     * @returns {PropertyDescriptor|undefined} 属性描述符
     */
    getOwnPropertyDescriptor(target, prop) {
      const data = volantisDataStore.get(volantisProxy);
      if (!data || !Object.prototype.hasOwnProperty.call(data, prop)) {
        return undefined;
      }
      return {
        value: data[prop],
        writable: true,
        enumerable: true,
        configurable: true
      };
    }
  });

  // 3. 挂载到 window 对象，暴露全局访问入口
  Object.defineProperty(window, 'volantis', {
    value: volantisProxy,
    writable: true, // 允许后续手动设置为 null 触发清理
    configurable: true,
    enumerable: true
  });

})();
// 页面DOM操作模块
volantis.dom = {}; // 页面Dom see: /source/js/app.js etc.
/******************** volantis.getFunctionHash ********************************/
// 简易文本哈希
volantis.simpleTextHash= (str) => {
  // 初始哈希值：选择质数5381（DJB2算法推荐的起始值）
  let hash = 5381;
  // 遍历每个字符，更新哈希值
  for (let i = 0; i < str.length; i++) {
    // 等价于 hash = hash * 33 + charCode（位移运算更高效）
    hash = (hash << 5) + hash + str.charCodeAt(i);
    // 避免数值过大溢出（可选：取模2^32，模拟32位无符号整数）
    hash = hash & hash; // 或 hash >>> 0（转换为无符号）
  }
  // 转换为十六进制字符串，确保至少8位（补前导零）
  return hash.toString(16).padStart(8, '0');
}

// 获取函数内容的哈希
volantis.getFunctionHash= (func) => {
    // 提取函数源码字符串
    const funcStr = func.toString();
    // 计算哈希值
    return volantis.simpleTextHash(funcStr);
}

// 测试示例
//function sampleFunc(a, b) {
//    return a * b + 10;
//}
//console.log(volantis.getFunctionHash(sampleFunc)); // 输出函数源码的哈希
/******************** volantis.EventListener ********************************/
// 事件监听器 see: /source/js/app.js
// 事件监听器模块
volantis.EventListener = {
  list: [],

  // 移除所有需要清理的事件监听器
  remove() {
    this.list.forEach(listener => {
      listener.ele.removeEventListener(listener.type, listener.f, false);
    });
    this.list = [];
  }
};

// 事件监听器构造函数
class VolantisEventListener {
  constructor(type, handler, element) {
    this.type = type;
    this.f = handler;
    this.ele = element;
  }
}
/******************** volantis.dom.$ ********************************/
// 注：这里没有选择器，也没有forEach一次只处理一个dom，这里重新封装主题常用的dom方法，返回的是dom对象，对象包含了以下方法，同时保留dom的原生API
// DOM 操作封装
class VolantisDom {
  constructor(ele) {
    this._ele = ele || document.createElement('div');
    return new Proxy(this, {
      get(target, prop) {
        if (target[prop] !== undefined) {
          return target[prop];
        }
        if (target._ele[prop] !== undefined) {
          if (typeof target._ele[prop] === 'function') {
            return target._ele[prop].bind(target._ele);
          }
          return target._ele[prop];
        }
        return undefined;
      },
      set(target, prop, value) {
        if (target._ele[prop] !== undefined) {
          target._ele[prop] = value;
          return true;
        }
        target[prop] = value;
        return true;
      }
    });
  }

  // 自定义方法
  find(selector) {
    const found = this._ele.querySelector(selector);
    return found ? new VolantisDom(found) : null;
  }

  hasClass(className) {
    return this._ele.classList.contains(className);
  }

  addClass(classNames) {
    if (typeof classNames !== 'string') return this;
    classNames.split(' ').forEach(className => {
      className && this._ele.classList.add(className);
    });
    return this;
  }

  removeClass(classNames) {
    if (typeof classNames !== 'string') return this;
    classNames.split(' ').forEach(className => {
      className && this._ele.classList.remove(className);
    });
    return this;
  }

  toggleClass(classNames) {
    if (typeof classNames !== 'string') return this;
    classNames.split(' ').forEach(className => {
      className && this._ele.classList.toggle(className);
    });
    return this;
  }

  on(event, handler, removeOnPjax = true) {
    if (typeof handler !== 'function') return this;
    this._ele.addEventListener(event, handler, false);
    if (removeOnPjax) {
      volantis.EventListener.list.push(
        new VolantisEventListener(event, handler, this._ele)
      );
    }
    return this;
  }

  click(handler, removeOnPjax) {
    return this.on('click', handler, removeOnPjax);
  }

  scroll(handler, removeOnPjax) {
    return this.on('scroll', handler, removeOnPjax);
  }

  html(content) {
    if (content === undefined) {
      return this._ele.innerHTML;
    }
    this._ele.innerHTML = content;
    return this;
  }

  hide() {
    this._ele.classList.remove('show');
    this._ele.style.removeProperty('display');
    return this;
  }

  show() {
    this._ele.classList.add('show');
    this._ele.style.removeProperty('display');
    return this;
  }
}
// DOM 选择工厂函数
volantis.dom.$ = (ele) => {
  if (!ele) return null;
  if (ele instanceof VolantisDom) {
    return ele;
  }
  if (ele instanceof NodeList || ele instanceof HTMLCollection) {
    return Array.from(ele).map(item => new VolantisDom(item));
  }
  if (ele instanceof Node) {
    return new VolantisDom(ele);
  }
  return null;
};
/******************** RunItem ********************************/
// 任务执行管理器
class RunItem {
  constructor() {
    this.list = [];
  }

  start() {
    this.list.forEach(item => item.run());
  }

  // name 存在时同名替换，否则追加
  push(fn, name, useRequestAnimationFrame = true) {
    if (typeof fn !== 'function') return;

    let taskFn = fn;
    if (useRequestAnimationFrame) {
      taskFn = () => {
        volantis.requestAnimationFrame(fn);
      };
    }

    name = name || volantis.getFunctionHash(fn)
    const idx = this.list.findIndex(item => item.name === name);
    if (idx !== -1) {
      this.list[idx] = new TaskItem(taskFn, name);
      return;
    }
    this.list.push(new TaskItem(taskFn, name));
  }

  remove(name) {
    if (typeof name !== 'string') return;
    this.list = this.list.filter(item => item.name !== name);
  }
}

class TaskItem {
  constructor(fn, name) {
    this.name = name || volantis.getFunctionHash(fn);
    this.fn = fn;
  }

  run() {
    try {
      this.fn();
    } catch (error) {
      console.error(`Error executing task ${this.name}:`, error);
    }
  }
}
/******************** Pjax ********************************/
// /layout/_plugins/pjax/index.ejs
// volantis.pjax.send(callBack[,"callBackName"]) 传入pjax:send回调函数
// volantis.pjax.push(callBack[,"callBackName"]) 传入pjax:complete回调函数
// volantis.pjax.error(callBack[,"callBackName"]) 传入pjax:error回调函数
volantis.pjax = {};
volantis.pjax.method = {
  complete: new RunItem(),
  error: new RunItem(),
  send: new RunItem()
};
volantis.pjax = Object.assign(volantis.pjax, {
  push: volantis.pjax.method.complete.push.bind(volantis.pjax.method.complete),
  error: volantis.pjax.method.error.push.bind(volantis.pjax.method.error),
  send: volantis.pjax.method.send.push.bind(volantis.pjax.method.send)
});
/******************** RightMenu ********************************/
  // volantis.rightmenu.handle(callBack[,"callBackName"]) 外部菜单项控制
  // 可在 volantis.mouseEvent 处获取右键事件
  volantis.rightmenu = {};
  volantis.rightmenu.method = {
    handle: new RunItem(),
  }
  volantis.rightmenu = Object.assign(volantis.rightmenu, {
    handle: volantis.rightmenu.method.handle.push.bind(volantis.rightmenu.method.handle),
  });
/********************  Dark Mode  ********************************/
  // /layout/_partial/scripts/darkmode.ejs
  // volantis.dark.mode 当前模式 dark or light
  // volantis.dark.toggle() 暗黑模式触发器
  // volantis.dark.push(callBack[,"callBackName"]) 传入触发器回调函数
volantis.dark = {};
volantis.dark.method = {
  toggle: new RunItem()
};
volantis.dark = Object.assign(volantis.dark, {
  push: volantis.dark.method.toggle.push.bind(volantis.dark.method.toggle)
});
  /********************  Message  ********************************/
  // VolantisApp.message
  /********************  isMobile  ********************************/
  // /source/js/app.js
  // volantis.isMobile
  // volantis.isMobileOld
  /********************脚本动态加载函数********************************/
  // volantis.js(src, cb)  cb 可以传入onload回调函数 或者 JSON对象 例如: volantis.js("src", ()=>{}) 或 volantis.js("src", {defer:true,onload:()=>{}})
  // volantis.css(src)

  // 返回Promise对象，如下方法同步加载资源，这利于处理文件资源之间的依赖关系，例如：APlayer 需要在 MetingJS 之前加载
  // (async () => {
  //     await volantis.js("...theme.plugins.aplayer.js.aplayer...")
  //     await volantis.js("...theme.plugins.aplayer.js.meting...")
  // })();

// 脚本动态加载（按需加载用）
// volantis.js(src, cb)  cb: onload 回调或属性对象 {defer:true, onload:()=>{}}
// volantis.css(src)
volantis.js = (src, cb) => {
  const escapeSelector = str => str.replace(/[#".'()[\]]/g, '\\$&');
  return new Promise((resolve, reject) => {
    setTimeout(function () {
    const existingScript = document.querySelector(`script[src="${escapeSelector(src)}"]`);
    if (existingScript) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;

    const handleLoad = () => {
      if (typeof cb === 'function') cb();
      resolve();
    };

    script.onload = handleLoad;
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    if (cb && typeof cb === 'object' && !Array.isArray(cb)) {
      for (const p in cb) {
        if (!cb.hasOwnProperty(p)) continue;
        if (p === 'onload') {
          script.onload = () => {
            cb[p]();
            resolve();
          };
        } else if (p === 'pjax') {
          script.setAttribute('pjax', '');
          script.setAttribute('data-pjax', '');
        } else if (cb[p] === true) {
          script.setAttribute(p, '');
        } else {
          script.setAttribute(p, cb[p]);
        }
      }
    }

    (document.head || document.documentElement).appendChild(script);
    });
  });
};

volantis.css = (src) => {
  const escapeSelector = str => str.replace(/[#".'()[\]]/g, '\\$&');
  return new Promise((resolve, reject) => {
   setTimeout(function () {
    const existingLink = document.querySelector(`link[href="${escapeSelector(src)}"]`);
    if (existingLink) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    Object.assign(link, {
      rel: 'stylesheet',
      href: src,
      onload: () => resolve(),
      onerror: () => reject(new Error(`Failed to load CSS: ${src}`))
    });
    document.head.appendChild(link);
    });
  });
};


  /********************按需加载的插件********************************/
  // volantis.import.jQuery().then(()=>{})
  volantis.import = {
    jQuery: () => {
      if (typeof jQuery == "undefined") {
        return volantis.js(volantis.GLOBAL_CONFIG.cdn.jquery)
      } else {
        return new Promise(resolve => {
          resolve()
        });
      }
    }
  }
  /********************** 节流和防抖 ********************************/
  // 节流函数：确保指定时间内仅执行一次 时间戳版本的节流实现
  volantis.throttle = (func, delay = 200) => {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        func.apply(this, args);
        lastTime = now;
      }
    };
  };
  // 防抖函数 setTimeout实现
  volantis.debounce = (func, wait = 200) => {
    let timer = null;
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, arguments)
        timer = null
      }, wait)
    };
  };
  /********************** requestAnimationFrame ********************************/
  // 1、requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。
  // 2、在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。
  volantis.requestAnimationFrame = (fn) => {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    }
    return window.requestAnimationFrame(fn);
  };
  // 3. 基于 requestAnimationFrame 的节流函数
  volantis.rafThrottle = (fn) => {
      let rafId = null
      return (...args) => {
        if (rafId) return
        rafId = volantis.requestAnimationFrame(() => {
          fn(...args)
          rafId = null
        })
      }
  };
/************************ layoutHelper *****************************************/
// Layout Helper
volantis.layoutHelper = (helper, html, opt = {}) => {
  const { clean = false, pjax = true } = { ...opt };
  const handleLayout = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const layoutHelper = document.querySelector(`#layoutHelper-${helper}`);
    if (layoutHelper) {
      if (clean) layoutHelper.innerHTML = '';
      layoutHelper.append(tempDiv);
    }
  };

  handleLayout();
  if (pjax) {
    volantis.pjax.push(handleLayout, `layoutHelper-${helper}`);
  }
};
/****************************** 滚动事件处理 ****************************************/
// 滚动事件处理
volantis.scroll = {
    engine: new RunItem(),
    unengine: new RunItem(),
  };
  volantis.scroll = Object.assign(volantis.scroll, {
    push: volantis.scroll.engine.push.bind(volantis.scroll.engine),
  });
  // 滚动条距离顶部的距离
  volantis.scroll.getScrollTop = () => {
    let scrollPos;
    if (window.pageYOffset) {
      scrollPos = window.pageYOffset;
    } else if (document.compatMode && document.compatMode != 'BackCompat') {
      scrollPos = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollPos = document.body.scrollTop;
    }
    return scrollPos;
  }
  volantis.scroll.scrollHeight = function () {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    )
  }
  volantis.scroll.offsetHeight = function () {
    return Math.min(
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    )
  }
  volantis.scroll.progress = function () {
    return volantis.scroll.getScrollTop() / (volantis.scroll.scrollHeight() - volantis.scroll.offsetHeight())
  }
  // 使用 requestAnimationFrame 处理滚动事件
  // `volantis.scroll.del` 中存储了一个数值, 该数值检测一定时间间隔内滚动条滚动的位移, 数值的检测频率是浏览器的刷新频率. 数值为正数时, 表示向下滚动. 数值为负数时, 表示向上滚动.
  volantis.scroll.handleScrollEvents = () => {
    volantis.scroll.lastScrollTop = volantis.scroll.getScrollTop()
    function loop() {
      const scrollTop = volantis.scroll.getScrollTop();
      if (volantis.scroll.lastScrollTop !== scrollTop) {
        volantis.scroll.del = scrollTop - volantis.scroll.lastScrollTop;
        volantis.scroll.lastScrollTop = scrollTop;
        // if (volantis.scroll.del > 0) {
        //   console.log("向下滚动");
        // } else {
        //   console.log("向上滚动");
        // }
        // 注销过期的unengine未滚动事件
        volantis.scroll.unengine.list = []
        volantis.scroll.engine.start();
      } else {
        volantis.scroll.unengine.start();
      }
      volantis.requestAnimationFrame(loop)
    }
    volantis.requestAnimationFrame(loop)
  }
  volantis.scroll.handleScrollEvents()
  volantis.scroll.ele = null;
  // 触发页面滚动至目标元素位置
  volantis.scroll.to = (ele, option = {}) => {
    if (!ele) return;
    volantis.scroll.ele = ele;
    // 默认配置
    opt = {
      top: ele.getBoundingClientRect().top + document.documentElement.scrollTop,
      behavior: volantis.GLOBAL_CONFIG.scroll_behavior
    }
    // 定义配置
    if ("top" in option) {
      opt.top = option.top
    }
    if ("behavior" in option) {
      opt.behavior = option.behavior
    }
    if ("addTop" in option) {
      opt.top += option.addTop
    }
    if (!("observerDic" in option)) {
      option.observerDic = 100
    }
    // 滚动
    window.scrollTo(opt);
    // 监视器
    // 监视并矫正元素滚动到指定位置
    // 用于处理 lazyload 引起的 cls 导致的定位失败问题
    // option.observer = false
    if (option.observer) {
      setTimeout(() => {
        if (volantis.scroll.ele != ele) {
          return
        }
        volantis.scroll.unengine.push(() => {
          let me = ele.getBoundingClientRect().top
          if (!(me >= -option.observerDic && me <= option.observerDic)) {
            volantis.scroll.to(ele, option)
          }
          volantis.scroll.unengine.remove("unengineObserver")
        }, "unengineObserver")
      }, 1000)
    }
  }
  /********************** Content Visibility ********************************/
  // 见 source/css/first.styl 如果遇到任何问题 删除 .post-story 即可
  // 一个元素被声明 content-visibility 属性后 如果元素不在 viewport 中 浏览器不会计算其后代元素样式和属性 从而节省 Style & Layout 耗时
  // content-visibility 的副作用: 锚点失效 等等(实验初期 暂不明确), 使用此方法清除样式
  volantis.cleanContentVisibility = () => {
    if (document.querySelector(".post-story")) {
      console.log("cleanContentVisibility");
      document.querySelectorAll(".post-story").forEach(e => {
        e.classList.remove("post-story")
      })
    }
  }
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
//图像加载出错时的处理
// 图片错误降级
function errorImgAvatar(img) {
  img.src = volantis.GLOBAL_CONFIG.default.avatar;
  img.srcset = volantis.GLOBAL_CONFIG.default.avatar;
  img.onerror = null;
}

function errorImgCover(img) {
  img.src = volantis.GLOBAL_CONFIG.default.cover;
  img.srcset = volantis.GLOBAL_CONFIG.default.cover;
  img.onerror = null;
}
/******************************************************************************/
// Hack Interval
// 保存原生定时器方法
const nativeSetTimeout = window.setTimeout;
const nativeSetInterval = window.setInterval;
const nativeClearTimeout = window.clearTimeout;
const nativeClearInterval = window.clearInterval;

// 存储活动定时器ID的数组
volantis.activeTimeout = [];
volantis.activeInterval = [];

// 重写setTimeout：执行后自动移除ID
window.setTimeout = function(callback, delay, ...args) {
  // 包装回调函数，执行后从列表移除ID
  const wrappedCallback = function(...innerArgs) {
    try {
      // 执行原始回调（保持this指向和参数传递）
      return callback.apply(this, innerArgs);
    } finally {
      // 无论回调是否报错，均移除ID
      const index = volantis.activeTimeout.indexOf(timerId);
      if (index !== -1) volantis.activeTimeout.splice(index, 1);
    }
  };
  
  // 调用原生setTimeout获取ID
  const timerId = nativeSetTimeout(wrappedCallback, delay, ...args);
  // 添加到活动列表
  volantis.activeTimeout.push(timerId);
  return timerId;
};

// 重写setInterval：需显式清除才移除ID
window.setInterval = function(callback, delay, ...args) {
  const timerId = nativeSetInterval(callback, delay, ...args);
  volantis.activeInterval.push(timerId);
  return timerId;
};

// 重写清除方法：同步移除ID列表记录
window.clearTimeout = function(timerId) {
  nativeClearTimeout(timerId);
  const index = volantis.activeTimeout.indexOf(timerId);
  if (index !== -1) volantis.activeTimeout.splice(index, 1);
};

window.clearInterval = function(timerId) {
  nativeClearInterval(timerId);
  const index = volantis.activeInterval.indexOf(timerId);
  if (index !== -1) volantis.activeInterval.splice(index, 1);
};
volantis.getActiveInterval = function () {
  return [...volantis.activeInterval];
}
volantis.getActiveTimeout = function () {
  return [...volantis.activeTimeout];
}
volantis.clearAllTimers = function (){
  volantis.getActiveInterval().forEach(function(i) {
    clearInterval(i);
  });
  volantis.getActiveTimeout().forEach(function(i) {
    clearTimeout(i);
  });
}
volantis.pjax.send(volantis.clearAllTimers,"clearAllTimers");
/******************************************************************************/
// DOMContentLoaded：缓存 DOM 引用
document.addEventListener('DOMContentLoaded', function () {
  /******************** volantis.dom ********************************/
  // 页面选择器 将dom对象缓存起来 see: /source/js/app.js etc.
  volantis.dom.bodyAnchor = volantis.dom.$(document.getElementById("safearea")); // 页面主体
  volantis.dom.topBtn = volantis.dom.$(document.getElementById('s-top')); // 向上
  volantis.dom.wrapper = volantis.dom.$(document.getElementById('wrapper')); // 整个导航栏
  volantis.dom.coverAnchor = volantis.dom.$(document.querySelector('#l_cover .cover-wrapper')); // 1个
  volantis.dom.switcher = volantis.dom.$(document.querySelector('#l_header .switcher .s-search')); // 搜索按钮   移动端 1个
  volantis.dom.header = volantis.dom.$(document.getElementById('l_header')); // 移动端导航栏
  volantis.dom.search = volantis.dom.$(document.querySelector('#l_header .m_search')); // 搜索框 桌面端 移动端 1个
  volantis.dom.mPhoneList = volantis.dom.$(document.querySelectorAll('#l_header .m-phone .list-v')); //  手机端 子菜单 多个
});
/******************************************************************************/
