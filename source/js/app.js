$(function () {
  VolantisApp.init();
  VolantisApp.subscribe();
  volantisFancyBox.loadFancyBox();

  volantis.pjax.push(() => {
    $(function () {
      VolantisApp.pjaxReload();
      sessionStorage.setItem("domTitle", document.title);
    });
  }, 'app.js');

  volantis.pjax.push(volantisFancyBox.pjaxReload);
  volantis.pjax.send(() => {
    if (typeof $.fancybox != "undefined") {
      $.fancybox.close(); // 关闭弹窗
    }
  }, 'fancybox');
});

/*锚点定位*/
if (window.location.hash) {
  let checkExist = setInterval(function () {
    let locationID = decodeURI(window.location.hash.split('#')[1]).replace(/\ /g, '-');
    if ($('#' + locationID).length) {
      $('html, body').animate({
        scrollTop: $('#' + locationID).offset().top - 40
      }, 500);
      clearInterval(checkExist);
    }
  }, 100);
}

// 函数防抖 (只执行最后一次点击)
const Debounce = (fn, t) => {
  const delay = t || 50;
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      },
      delay);
  };
};

const VolantisApp = (() => {
  const fn = {};
  let scrollCorrection = 80;

  fn.init = () => {
    volantis.$.bodyAnchor = $('#safearea'); // 页面主体
    volantis.$.topBtn = $('#s-top'); // 向上
    volantis.$.wrapper = $('#wrapper'); // 整个导航栏
    volantis.$.coverAnchor = $('#l_cover .cover-wrapper');
    volantis.$.switcher = $('#l_header .switcher .s-search'); // 搜索按钮   移动端
    volantis.$.header = $('#l_header'); // 移动端导航栏
    volantis.$.search = $('#l_header .m_search'); // 搜索框 桌面端
    volantis.$.mPhoneList = $('#l_header .m-phone .list-v'); //  手机端 子菜单
    if (volantis.$.header[0]) {
      scrollCorrection = volantis.$.header[0].clientHeight + 16;
    }

    window.onresize = () => {
      if (document.documentElement.clientWidth < 500) {
        volantis.isMobile = 1;
      } else {
        volantis.isMobile = 0;
      }
      if (volantis.isMobile != volantis.isMobileOld) {
        fn.setGlobalHeaderMenuEvent();
        fn.setHeader();
        fn.setHeaderSearch();
      }
    }
  }

  fn.event = () => {
    $('#scroll-down').off('click').on('click', function () {
      fn.scrolltoElement(volantis.$.bodyAnchor);
    });
  }

  fn.restData = () => {
    scrollCorrection = volantis.$.header[0] ? volantis.$.header[0].clientHeight + 16 : 80;
  }

  fn.setIsMobile = () => {
    if (document.documentElement.clientWidth < 500) {
      volantis.isMobile = 1;
      volantis.isMobileOld = 1;
    } else {
      volantis.isMobile = 0;
      volantis.isMobileOld = 0;
    }
  }

  // 校正页面定位（被导航栏挡住的区域）
  fn.scrolltoElement = (elem, correction = scrollCorrection) => {
    const $elem = elem.href ? $(decodeURI(elem.getAttribute('href'))) : $(elem);
    window.scrollTo({
      top: $elem.offset().top - correction,
      behavior: 'smooth'
    });
  }

  // 设置滚动锚点
  fn.setScrollAnchor = () => {
    // click topBtn 滚动至bodyAnchor 【移动端 PC】
    if (volantis.$.topBtn.length && volantis.$.bodyAnchor) {
      volantis.$.topBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        fn.scrolltoElement(volantis.$.bodyAnchor);
        e.stopImmediatePropagation();
      });
    }

    // 滚动监听 显示/隐藏 Header导航 topBtn 【移动端 PC】
    let pos = document.body.scrollTop;
    $(document, window).scroll(Debounce(() => {
      const showHeaderPoint = volantis.$.bodyAnchor.offset().top - scrollCorrection;
      const scrollTop = $(window).scrollTop(); // 滚动条距离顶部的距离
      const del = scrollTop - pos;
      pos = scrollTop;
      // topBtn
      if (scrollTop > volantis.$.bodyAnchor.offset().top) {
        volantis.$.topBtn.addClass('show');
        // 向上滚动高亮 topBtn
        if (del > 0) {
          volantis.$.topBtn.removeClass('hl');
        } else {
          volantis.$.topBtn.addClass('hl');
        }
      } else {
        volantis.$.topBtn.removeClass('show').removeClass('hl');
      }
      // Header导航
      if (scrollTop - showHeaderPoint > -1) {
        volantis.$.header.addClass('show');
      } else {
        volantis.$.header.removeClass('show');
      }
    }));
  }

  // 设置导航栏
  fn.setHeader = () => {
    // !!! 此处的jQuery对象需要重载 !!!
    if (!pdata.ispage) return;

    // 填充二级导航文章标题 【移动端 PC】
    volantis.$.wrapper.find('.nav-sub .title').html(pdata.postTitle);

    // 决定一二级导航栏的切换 【向上滚动50px切换为一级导航栏；向下滚动50px切换为二级导航栏】  【移动端 PC】
    let pos = document.body.scrollTop;
    $(document, window).scroll(Debounce(() => {
      const scrollTop = $(window).scrollTop();
      const del = scrollTop - pos;
      if (del >= 50 && scrollTop > 100) { // 向下滚动50px
        pos = scrollTop;
        volantis.$.wrapper.addClass('sub'); // <---- 二级导航显示
      } else if (del <= -50) { // 向上滚动50px
        pos = scrollTop;
        volantis.$.wrapper.removeClass('sub'); // <---- 取消二级导航显示 一级导航显示
      }
    }));

    // ====== bind events to every btn =========
    // 评论按钮 【移动端 PC】
    volantis.$.comment = $('#s-comment'); // 评论按钮  桌面端 移动端
    volantis.$.commentTarget = $('#l_main article#comments'); // 评论区域
    if (volantis.$.commentTarget.length) {
      volantis.$.comment.click(e => { // 评论按钮点击后 跳转到评论区域
        e.preventDefault();
        e.stopPropagation();
        scrolltoElement(volantis.$.commentTarget);
        e.stopImmediatePropagation();
      });
    } else volantis.$.comment.remove(); // 关闭了评论，则隐藏评论按钮

    // 移动端toc目录按钮 【移动端】
    if (volantis.isMobile) {
      volantis.$.toc = $('#s-toc'); // 目录按钮  仅移动端
      volantis.$.tocTarget = $('#l_side .toc-wrapper'); // 侧边栏的目录列表
      if (volantis.$.tocTarget.length && volantis.$.tocTarget.children().length) {
        // 点击移动端目录按钮 激活目录按钮 显示侧边栏的目录列表
        volantis.$.toc.click((e) => {
          e.stopPropagation();
          volantis.$.tocTarget.toggleClass('active');
          volantis.$.toc.toggleClass('active');
        });
        // 点击空白 隐藏
        $(document).click(function (e) {
          e.stopPropagation();
          volantis.$.tocTarget.removeClass('active');
          volantis.$.toc.removeClass('active');
        });
        // 页面滚动  隐藏
        $(document, window).scroll(Debounce(() => {
            volantis.$.tocTarget.removeClass('active');
            volantis.$.toc.removeClass('active');
          },
          100));
      } else volantis.$.toc.remove(); // 隐藏toc目录按钮
    }
  }

  // 设置导航栏菜单选中状态  【移动端 PC】
  fn.setHeaderMenuSelection = () => {
    // !!! 此处的jQuery对象需要重载 !!!
    volantis.$.headerMenu = $('.navigation', '#l_header,#l_cover,#l_side'); // 导航列表

    // 先把已经激活的取消激活
    volantis.$.headerMenu.find('li a.active').removeClass('active');
    volantis.$.headerMenu.find('div a.active').removeClass('active');

    function setUnderline($item) {
      if ($item && $item.length) {
        $item.addClass('active').siblings().removeClass('active');
      }
    }
    //set current active nav
    var $active_link = null;
    // replace '%' '/' '.'
    var idname = location.pathname.replace(/\/|%|\./g, '');
    if (idname.length == 0) {
      idname = 'home';
    }
    var page = idname.match(/page\d{0,}$/g);
    if (page) {
      page = page[0];
      idname = idname.split(page)[0];
    }
    var index = idname.match(/index.html/);
    if (index) {
      index = index[0];
      idname = idname.split(index)[0];
    }
    // 转义字符如 [, ], ~, #, @
    idname = idname.replace(/(\[|\]|~|#|@)/g, '\\$1');
    if (idname && volantis.$.headerMenu) {
      $active_link = $('#' + idname, volantis.$.headerMenu);
      setUnderline($active_link);
    }
  }

  // 设置全局事件
  fn.setGlobalHeaderMenuEvent = () => {
    if (volantis.isMobile) {
      // 【移动端】 点击展开子菜单
      $('#l_header .m-phone li:has(.list-v)').click(function (e) {
        e.stopPropagation();
        $($(e.currentTarget).children('ul')).show();
      });
    } else {
      // 【PC端】 hover时展开子菜单，点击时隐藏子菜单
      $('#wrapper .m-pc li > a[href]').parent().click(function (e) {
        e.stopPropagation();
        if (e.target.origin == e.target.baseURI) {
          $('#wrapper .m-pc .list-v').hide();
        }
      });
    }
    fn.setPageHeaderMenuEvent();
  }

  // 【移动端】隐藏子菜单
  fn.setPageHeaderMenuEvent = () => {
    if (!volantis.isMobile) return
    // 【移动端】 点击空白处隐藏子菜单
    $(document).click(function (e) {
      volantis.$.mPhoneList.hide();
    });
    // 【移动端】 滚动时隐藏子菜单
    $(window).scroll(Debounce(() => {
      volantis.$.mPhoneList.hide();
    }));
  }

  // 设置导航栏搜索框 【移动端】
  fn.setHeaderSearch = () => {
    if (!volantis.isMobile) return;
    if (volantis.$.switcher.length === 0) return;
    // 点击移动端搜索按钮
    volantis.$.switcher.click(function (e) {
      e.stopPropagation();
      volantis.$.header.toggleClass('z_search-open'); // 激活移动端搜索框
      volantis.$.switcher.toggleClass('active'); // 移动端搜索按钮
      volantis.$.search.find('input').focus();
    });
    // 点击空白取消激活
    $(document).click(function (e) {
      volantis.$.header.removeClass('z_search-open');
      volantis.$.switcher.removeClass('active');
    });
    // 移动端点击搜索框 停止事件传播
    volantis.$.search.click(function (e) {
      e.stopPropagation();
    });
  }

  // 设置 tabs 标签  【移动端 PC】
  fn.setTabs = () => {
    if (!$('#l_main .tabs .nav-tabs').length) return
    $('#l_main .tabs .nav-tabs').on('click', 'a', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const $tab = $(e.target.parentElement.parentElement.parentElement);
      $tab.find('.nav-tabs .active').removeClass('active');
      $tab.find(e.target.parentElement).addClass('active');
      $tab.find('.tab-content .active').removeClass('active');
      $tab.find($(e.target).attr('class')).addClass('active');
      return false;
    });
  }

  return {
    init: () => {
      fn.init();
      fn.event();
    },
    subscribe: () => {
      fn.setIsMobile();
      fn.setHeader();
      fn.setHeaderMenuSelection();
      fn.setGlobalHeaderMenuEvent();
      fn.setHeaderSearch();
      fn.setScrollAnchor();
      fn.setTabs();
    },
    pjaxReload: () => {
      fn.event();
      fn.restData();
      fn.setHeader();
      fn.setHeaderMenuSelection();
      fn.setPageHeaderMenuEvent();
      fn.setScrollAnchor();
      fn.setTabs();

      $('#l_header .nav-main').find('.list-v').not('.menu-phone').removeAttr("style", ""); // 移除小尾巴的移除
      $('#l_header .menu-phone.list-v').removeAttr("style", ""); // 移除小尾巴的移除
      // 处理点击事件 setHeaderSearch 没有重载，需要重新绑定单个事件  【移动端】
      if (volantis.$.switcher.length !== 0) {
        $(document).click(function (e) {
          volantis.$.header.removeClass('z_search-open');
          volantis.$.switcher.removeClass('active');
        });
      }
    }
  }
})()
Object.freeze(VolantisApp);

const volantisFancyBox = (() => {
  const fn = {};

  fn.initFB = () => {
    const group = new Set();
    group.add('default');

    $(".md .gallery").each(function (index, ele) {
      if ($(ele).has('img').length) {
        group.add($(ele).attr('data-group') || 'default');
      }
    })

    for (const iterator of group) {
      if (!!iterator) $('[data-fancybox="' + iterator + '"]').fancybox({
        hash: false,
        loop: true,
        closeClick: true,
        helpers: {
          overlay: {
            closeClick: true
          }
        },
        buttons: [
          "zoom",
          "slideShow",
          "fullScreen",
          "download",
          "thumbs",
          "close"
        ]
      });
    }
  }

  fn.loadFancyBox = () => {
    if ($(".md .gallery").find("img").length == 0) return;
    volantis.css("https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css");
    volantis.js('https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js', () => {
      fn.initFB();
    });
  }

  return {
    loadFancyBox: () => {
      fn.loadFancyBox()
    },
    pjaxReload: () => {
      if (typeof $.fancybox == "undefined") {
        fn.loadFancyBox();
      } else {
        fn.initFB();
      }
    }
  }
})()
Object.freeze(volantisFancyBox);