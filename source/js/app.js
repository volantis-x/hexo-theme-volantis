// 函数防抖 (只执行最后一次点击)
var Debounce = (fn, t) => {
  const delay = t || 25;
  let timer;
  return function() {
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

(function($) {
  // 将jQuery对象缓存起来 永远不要让相同的选择器在你的代码里出现多次
  // 在jQuery中最快的选择器是ID选择器,尽量使用ID代替Class 时间上大约相差100倍
  // 在class前使用tag(标签名)
  // 给选择器一个上下文
  volantis.$bodyAnchor = $('#safearea'); // 页面主体
  volantis.$topBtn = $('#s-top'); // 向上
  volantis.$wrapper = $('#wrapper'); // 整个导航栏
  volantis.$postsBtn = $('.menu .active'); // 一级导航上的当前激活的按钮
  volantis.$titleBtn = $('h1.title', '#header-meta'); // 文章内标题
  volantis.$coverAnchor = $('#l_cover .cover-wrapper');
  volantis.$switcher = $('#l_header .switcher .s-search'); // 搜索按钮   移动端
  volantis.$header = $('#l_header'); // 移动端导航栏
  volantis.$headerMenu = $('body .navigation'); // 导航列表
  volantis.$search = $('#l_header .m_search'); // 搜索框 桌面端
  volantis.$mPhoneList = $('#l_header .m-phone .list-v'); //  手机端 子菜单
  const isMobile = /mobile/i.test(window.navigator.userAgent);

  // 校正页面定位（被导航栏挡住的区域）
  var scrollCorrection = 80; // (header height = 64px) + (gap = 16px)
  if (volantis.$header[0]) {
    scrollCorrection = volantis.$header[0].clientHeight + 16;
  }

  // 尝试： 重设数据值
  function restData() {
    scrollCorrection = 80;
    if (volantis.$header[0]) {
      scrollCorrection = volantis.$header[0].clientHeight + 16;
    }
    volantis.$headerMenu = $('body .navigation');
  }

  // 校正页面定位（被导航栏挡住的区域）
  function scrolltoElement(elem, correction = scrollCorrection) {
    const $elem = elem.href ? $(decodeURI(elem.getAttribute('href'))) : $(elem);
    window.scrollTo({
      top     : $elem.offset().top - correction,
      behavior: 'smooth'
    });
  }

  // 设置滚动锚点
  function setScrollAnchor() {
    if (volantis.$postsBtn.length && volantis.$bodyAnchor) {
      volantis.$postsBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        if (volantis.$postsBtn.attr('href') != '/') // TODO: fix it
        { scrolltoElement(volantis.$bodyAnchor); }
        e.stopImmediatePropagation();
        volantis.$postsBtn.unbind('click');
      });
    }
    if (volantis.$titleBtn.length && volantis.$bodyAnchor) {
      volantis.$titleBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        scrolltoElement(volantis.$bodyAnchor);
        e.stopImmediatePropagation();
        volantis.$titleBtn.unbind('click');
      });
    }
    if (volantis.$topBtn.length && volantis.$bodyAnchor) {
      volantis.$topBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        scrolltoElement(volantis.$bodyAnchor);
        e.stopImmediatePropagation();
      });
    }

    //==========================================
    var showHeaderPoint = volantis.$bodyAnchor.offset().top - scrollCorrection;
    var pos = document.body.scrollTop;
    $(document, window).scroll(Debounce(() => {
      const scrollTop = $(window).scrollTop(); // 滚动条距离顶部的距离
      const del = scrollTop - pos;
      pos = scrollTop;
      if (scrollTop > volantis.$bodyAnchor.offset().top) {
        volantis.$topBtn.addClass('show');
        if (del > 0) {
          volantis.$topBtn.removeClass('hl');
        } else {
          volantis.$topBtn.addClass('hl');
        }
      } else {
        volantis.$topBtn.removeClass('show').removeClass('hl');
      }
      if (scrollTop - showHeaderPoint > -1) {
        volantis.$header.addClass('show');
      } else {
        volantis.$header.removeClass('show');
      }
    }));
    //==========================================
  }

  // 设置导航栏
  function setHeader() {
    if (pdata.ispage) {
      window.subData = {
        title: pdata.postTitle,
        tools: true
      };
    }
    if (!window.subData) return;
    volantis.$comment = $('#s-comment'); // 评论按钮  桌面端 移动端
    volantis.$toc = $('#s-toc'); // 目录按钮  仅移动端
    volantis.$commentTarget = $('#l_body article#comments'); // 评论区域
    volantis.$wrapper.find('.nav-sub .title').text(window.subData.title); // 二级导航文章标题
    // 决定一二级导航栏的切换
    let pos = document.body.scrollTop;
    $(document, window).scroll(Debounce(() => {
      const scrollTop = $(window).scrollTop();
      const del = scrollTop - pos;
      if (del >= 50 && scrollTop > 100) {
        pos = scrollTop;
        volantis.$wrapper.addClass('sub');
      } else if (del <= -50) {
        pos = scrollTop;
        volantis.$wrapper.removeClass('sub'); // <---- 取消二级导航显示
      }
    }));

    // bind events to every btn
    if (volantis.$commentTarget.length) {
      volantis.$comment.click(e => { // 评论按钮点击后 跳转到评论区域
        e.preventDefault();
        e.stopPropagation();
        scrolltoElement(volantis.$commentTarget);
        e.stopImmediatePropagation();
      });
    } else volantis.$comment.remove(); // 关闭了评论，则隐藏
    volantis.$tocTarget = $('#l_body .toc-wrapper'); // 侧边栏的目录列表  PC
    if (volantis.$tocTarget.length && volantis.$tocTarget.children().length) {
      volantis.$toc.click((e) => {
        e.stopPropagation();
        volantis.$tocTarget.toggleClass('active');
        volantis.$toc.toggleClass('active');
      });
      $(document).click(function(e) {
        e.stopPropagation();
        volantis.$tocTarget.removeClass('active');
        volantis.$toc.removeClass('active');
      });
      $(document, window).scroll(Debounce(() => {
        volantis.$tocTarget.removeClass('active');
        volantis.$toc.removeClass('active');
      },
      100));
    } else volantis.$toc.remove();
  }

  // 设置导航栏菜单选中状态
  function setHeaderMenuSelection() {
    // 先把已经激活的取消激活
    volantis.$headerMenu.find('li a.active').removeClass('active');
    volantis.$headerMenu.find('div a.active').removeClass('active');
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
    if (idname && volantis.$headerMenu) {
      $active_link = $('#' + idname, volantis.$headerMenu);
      setUnderline($active_link);
    }
  }

  // 设置全局事件
  function setGlobalHeaderMenuEvent() {
    if (isMobile) {
      // 手机端 点击展开子菜单
      $('#l_header .m-phone li').click(function(e) {
        e.stopPropagation();
        $($(e.currentTarget).children('ul')).show();
      });
    } else {
      // PC端 hover时展开子菜单，点击时隐藏子菜单
      $('#wrapper .m-pc li > a[href]').parent().click(function(e) {
        e.stopPropagation();
        if (e.target.origin == e.target.baseURI) {
          $('#wrapper .m-pc .list-v').hide();
        }
      });
    }
    setPageHeaderMenuEvent();
  }

  function setPageHeaderMenuEvent() {
    if (!isMobile) return;
    // 手机端 点击空白处隐藏子菜单
    $(document).click(function(e) {
      volantis.$mPhoneList.hide();
    });
    // 手机端 滚动时隐藏子菜单
    $(window).scroll(Debounce(() => {
      volantis.$mPhoneList.hide();
    }));
  }
  // 设置导航栏搜索框   fix √
  function setHeaderSearch() {
    if (volantis.$switcher.length === 0) return;
    volantis.$switcher.click(function(e) {
      e.stopPropagation();
      volantis.$header.toggleClass('z_search-open'); // 激活移动端搜索框
      volantis.$switcher.toggleClass('active'); // 搜索按钮
      volantis.$search.find('input').focus();
    });
    $(document).click(function(e) {
      volantis.$header.removeClass('z_search-open');
      volantis.$switcher.removeClass('active');
    });

    volantis.$search.click(function(e) {
      e.stopPropagation();
    });
    volantis.$header.ready(function() {
      volantis.$header.bind('keydown',
        function(event) {
          if (event.keyCode == 9) {
            return false;
          }
          var isie = !!document.all;
          var key,ev;
          if (isie) { //IE浏览器
            key = window.event.keyCode;
            ev = window.event;
          } else { //火狐浏览器
            key = event.which;
            ev = event;
          }
          if (key == 9) { //IE浏览器
            if (isie) {
              ev.keyCode = 0;
              ev.returnValue = false;
            } else { //火狐浏览器
              ev.which = 0;
              ev.preventDefault();
            }
          }

        });
    });
  }

  // 设置 tabs 标签
  function setTabs() {
    $('.tabs .nav-tabs').on('click', 'a', (e) => {
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

  $(function() {
    setHeader();
    setHeaderMenuSelection();
    setGlobalHeaderMenuEvent();
    setHeaderSearch();
    setScrollAnchor();
    setTabs();

    // 全屏封面底部箭头
    $('#scroll-down').on('click', function() {
      scrolltoElement(volantis.$bodyAnchor);
    });

    try {
      // addEventListener是先绑定先执行，此处的绑定后执行
      document.addEventListener('pjax:complete',
        function() {
          $(function() {
            restData();
            setHeader();
            setHeaderMenuSelection();
            setPageHeaderMenuEvent();
            setScrollAnchor();
            setTabs();
            // 全屏封面底部箭头
            $('#scroll-down').on('click', function() {
              scrolltoElement(volantis.$bodyAnchor);
            });
            // 处理点击事件 setHeaderSearch 没有重载，需要重新绑定单个事件
            if (volantis.$switcher.length !== 0) {
              $(document).click(function(e) {
                volantis.$header.removeClass('z_search-open');
                volantis.$switcher.removeClass('active');
              });
            }
          });

        }, {passive: true});
    } catch (error) {
      // console.log(error);
    }

  });

  /*锚点定位*/
  if (window.location.hash) {
    var checkExist = setInterval(function() {
      if ($('#' + decodeURI(window.location.hash.split('#')[1]).replace(/\ /g, '-')).length) {
        $('html, body').animate({
          scrollTop: $('#' + decodeURI(window.location.hash.split('#')[1]).replace(/\ /g, '-')).offset().top - 40
        },
        500);
        clearInterval(checkExist);
      }
    },
    100);
  }
})(jQuery);
