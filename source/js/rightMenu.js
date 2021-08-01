$(function () {
  RightMenu.init();

  volantis.pjax.send(() => {
    RightMenu.hideMenu();
  })
});


const RightMenu = (() => {
  const fn = {},
        $printHtml = $('#printHtml'),
        $menuDarkBtn = $('#menuDarkBtn'),
        $menuLoad = $('.menuLoad-Content'),
        _rightMenuWrapper = $('#rightmenu-wrapper')[0],
        _rightMenuContent = $('#rightmenu-content')[0];

  const $copyText = $('.menu-Option[data-fn-type="copyText"]'),
        $copyPaste = $('.menu-Option[data-fn-type="copyPaste"]'),
        $copySelect = $('.menu-Option[data-fn-type="copySelect"]'),
        $copyCut = $('.menu-Option[data-fn-type="copyCut"]'),
        $copyHref = $('.menu-Option[data-fn-type="copyHref"]'),
        $copySrc = $('.menu-Option[data-fn-type="copySrc"]'),
        $copyImg = $('.menu-Option[data-fn-type="copyImg"]'),
        $openTab = $('.menu-Option[data-fn-type="openTab"]');

  const darkmodeDark = '<%= theme.rightmenu.darkmode.dark %>' || 'fa fa-moon',
        darkmodeWhite = '<%= theme.rightmenu.darkmode.white %>' || 'fa fa-sun',
        urlRegx = /^((https|http)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;

  fn.init = () => {
    $('.menu-Option').hide();
  }

  fn.initEvent = () => {
    window.document.oncontextmenu = (event) => {
      if (event.ctrlKey || $(window).width() <= 500) {
        fn.hideMenu();
        return true;
      }
      return fn.popMenu(event);
    }

    _rightMenuWrapper.oncontextmenu = (event) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }

    $(window).off('click.rightMenu').on('click.rightMenu', () => {
      fn.hideMenu();
    })

    $(window).off('blur.rightMenu').on('blur.rightMenu', () => {
      fn.hideMenu();
    })

    $(_rightMenuWrapper).off('blur.rightMenu').on('blur.rightMenu', () => {
      fn.hideMenu();
    })
  }

  // 菜单位置设定 
  fn.popMenu = (event) => {
    let mouseClientX = event.clientX;
    let mouseClientY = event.clientY;
    let screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

    try {
      fn.setMenuItem(event);
      $(_rightMenuWrapper).focus();
      _rightMenuWrapper.style.display = 'block';
      _rightMenuWrapper.style.zIndex = '-2147483648';
      let menuWidth = _rightMenuContent.offsetWidth;
      let menuHeight = _rightMenuContent.offsetHeight;
      let showLeft = mouseClientX + menuWidth > screenWidth ? mouseClientX - menuWidth + 10 : mouseClientX;
      let showTop = mouseClientY + menuHeight > screenHeight ? mouseClientY - menuHeight + 10 : mouseClientY;
      showTop = mouseClientY + menuHeight > screenHeight && showTop < menuHeight && mouseClientY < menuHeight ?
        showTop + (screenHeight - menuHeight - showTop - 10) : showTop;
      _rightMenuWrapper.style.left = showLeft + "px";
      _rightMenuWrapper.style.top = showTop + "px";
      _rightMenuWrapper.style.zIndex = '2147483648';
    } catch (error) {
      $(_rightMenuWrapper).blur();
      console.error(error);
      return true;
    }

    return false;
  }

  // 菜单项设置 
  fn.setMenuItem = (event) => {
    let optionFlag = false;
    const eventTarget = event.target;
    const selectText = window.getSelection().toString();
    $openTab.hide(); // 隐藏新标签页打开 

    // 对应更改图标 
    if ($menuDarkBtn) {
      $menuDarkBtn.off('click.rightMenu').one('click.rightMenu', (event) => {
        $menuDarkBtn.children().toggleClass(darkmodeDark);
        $menuDarkBtn.children().toggleClass(darkmodeWhite);
      })
    }

    // 判断是否是输入框 
    if ($(eventTarget).is('input') || $(eventTarget).is('textarea')) {
      const inputStr = $(eventTarget).val();

      // 全选 
      if (inputStr.length > 0) {
        $copySelect.show();
        $copySelect.off("click.rightMenu").one("click.rightMenu", () => {
          $(eventTarget).select();
        })
      } else {
        $copySelect.hide();
      }

      // 剪切 
      if (selectText) {
        $copyCut.show();
        $copyCut.off("click.rightMenu").one("click.rightMenu", () => {
          const statrPos = eventTarget.selectionStart;
          const endPos = eventTarget.selectionEnd;
          fn.copyString(selectText);
          $(eventTarget).val(inputStr.substring(0, statrPos) + inputStr.substring(endPos, inputStr.length));
          eventTarget.selectionStart = statrPos;
          eventTarget.selectionEnd = statrPos;
          $(eventTarget).focus();
        })
      } else {
        $copyCut.hide();
      }

      // 粘贴 
      fn.readClipboard().then(text => {
        // 如果剪切板存在内容 
        if (!!text) {
          $copyPaste.show();
          $copyPaste.off("click.rightMenu").one("click.rightMenu", () => {
            fn.insertAtCaret($(eventTarget), text);
          })
        } else {
          $copyPaste.hide();
        }
      }).catch((err) => {
        console.error(err);
        $copyPaste.hide();
      });
    } else {
      $copySelect.hide();
      $copyPaste.hide();
      $copyCut.hide();
    }

    // 新标签打开链接 
    const eventHref = eventTarget.href;
    if (!!eventHref && urlRegx.test(eventHref)) {
      optionFlag = true;
      $copyHref.show();
      $openTab.show();
      $copyHref.off("click.rightMenu").one("click.rightMenu", () => {
        fn.copyString(eventHref);
      });
      $openTab.off("click.rightMenu").one("click.rightMenu", () => {
        window.open(eventHref);
      });
    } else {
      $copyHref.hide();
    }

    // 新标签打开图片 & 复制图片链接 
    const eventSrc = eventTarget.currentSrc;
    if (!!eventSrc && urlRegx.test(eventSrc)) {
      optionFlag = true;
      $copySrc.show();
      $openTab.show();

      $copySrc.off("click.rightMenu").one("click.rightMenu", () => {
        fn.copyString(eventSrc);
      });

      $openTab.off("click.rightMenu").one("click.rightMenu", () => {
        window.open(eventSrc);
      });
    } else {
      $copySrc.hide();
    }

    // 复制图片 
    if (!!eventSrc && urlRegx.test(eventSrc) && eventSrc.trimEnd().endsWith('.png')) {
      optionFlag = true;
      $copyImg.show();

      $copyImg.off("click.rightMenu").one("click.rightMenu", () => {
        fn.writeClipImg(event, () => {
          volantis.message('系统提示', '图片复制成功！', 'fas fa-images');
        }, (error) => {
          volantis.message('系统提示', '复制失败：' + error, 'fas fa-exclamation-square');
        })
      });
    } else {
      $copyImg.hide();
    }

    // 复制文本 
    if (selectText) {
      optionFlag = true;
      $copyText.show();
      $copyText.off("click.rightMenu").one("click.rightMenu", () => {
        fn.copyString(selectText);
      })
    } else {
      $copyText.hide();
    }

    // 打印 
    const _printArticle = $('#post.article').html() || null;
    const pathName = window.location.pathname;
    if (!!_printArticle) {
      $printHtml.show();
      $printHtml.off("click.rightMenu").one('click.rightMenu', (event) => {
        if (window.location.pathname === pathName) {
          fn.printHtml();
        } else {
          fn.hideMenu();
        }
      })
    } else {
      $printHtml.hide();
    }

    if (optionFlag) {
      $menuLoad.hide();
    } else {
      $menuLoad.show();
    }

    if (volantis.rightMenu.music == true) {
      if (volantis.APlayerController.APlayerLoaded) {
        MainAPlayer.checkAPlayer();
      }
    }
  }

  // 隐藏菜单 
  fn.hideMenu = () => {
    _rightMenuWrapper.style.display = 'none';
  }

  // 复制字符串 
  fn.copyString = (str) => {
    fn.writeClipText(str)
      .then(() => {
        volantis.message('复制成功', str.length > 120 ? str.substring(0, 120) + '...' : str, 'fas fa-copy');
      }).catch(e => {
        volantis.message('系统提示', e, 'fas fa-exclamation-square');
      })
  }

  // 写入文本到剪切板 
  fn.writeClipText = (str) => {
    try {
      return navigator.clipboard
        .writeText(str)
        .then(() => {
          return Promise.resolve()
        })
        .catch(err => {
          return Promise.reject(err)
        })
    } catch (e) {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      document.body.appendChild(input);
      input.setAttribute('value', str);
      input.select();
      try {
        let result = document.execCommand('copy')
        document.body.removeChild(input);
        if (!result || result === 'unsuccessful') {
          return Promise.reject('复制文本失败!')
        } else {
          return Promise.resolve()
        }
      } catch (e) {
        document.body.removeChild(input);
        return Promise.reject(
          '当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作!'
        )
      }
    }
  }

  // 写入图片到剪切板 
  fn.writeClipImg = async function (event, success, error) {
    const eventSrc = event.target.currentSrc;
    const parentElement = event.target.parentElement;
    try {
      const data = await fetch(eventSrc);
      const blob = await data.blob();
      await navigator.clipboard
        .write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]).then(() => {
          success();
        }, (e) => {
          console.error('图片复制失败：', e);
          error(e);
        });
    } catch (e) {
      const dom = document;
      try {
        if (dom.body.createTextRange) {
          const textRange = document.body.createTextRange();
          textRange.moveToElementText(parentElement);
          textRange.select();
        } else if (window.getSelection) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(parentElement);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        success();
      } catch (e) {
        console.error(e);
        error('不支持复制当前图片！');
      }
    }
  }

  // 请求读取剪切板 
  fn.readClipboard = async () => {
    const result = await navigator.permissions.query({
      name: 'clipboard-read'
    });
    if (result.state === 'granted' || result.state === 'prompt') {
      // 修改为 .read()  可以获取剪切板中的文字/图片 
      // 返回的是 ClipboardItem 
      return navigator.clipboard
        .readText()
        .then(text => text)
        .catch(err => Promise.reject(err));
    }
    return Promise.reject(result);
  }

  // 粘贴文本 
  fn.insertAtCaret = ($elemt, value) => {
    const elemt = $elemt[0];
    const startPos = elemt.selectionStart,
      endPos = elemt.selectionEnd;
    if (document.selection) {
      $elemt.focus();
      var sel = document.selection.createRange();
      sel.text = value;
      $elemt.focus();
    } else {
      if (startPos || startPos == '0') {
        var scrollTop = elemt.scrollTop;
        elemt.value = elemt.value.substring(0, startPos) + value + elemt.value.substring(endPos, elemt.value.length);
        $elemt.focus();
        elemt.selectionStart = startPos + value.length;
        elemt.selectionEnd = startPos + value.length;
        elemt.scrollTop = scrollTop;
      } else {
        $elemt.value += value;
        $elemt.focus();
      }
    }
  }

  // 执行打印页面 
  fn.printHtml = () => {
    if (volantis.isReadModel) fn.readingModel();
    if (volantis.rightMenu.defaultStyles === true) {
      $('body').css({
        'backgroundColor': 'unset'
      });
      $('#l_header').hide();
      $('#l_cover').hide();
      $('#l_side').hide();
      $('#l_main').css({
        'width': '100%'
      });
      $('#post').css({
        'box-shadow': 'none',
        'background': 'none',
        'padding': '0'
      });
      $('h1').css({
        'text-align': 'center',
        'font-weight': '600',
        'font-size': '2rem',
        'margin-bottom': '20px'
      });
      $('.prev-next').hide();
      $('#bottom').children().append('<div class="new-meta-item"><a class="tag" href="' + window.location.href + '" rel="nofollow" data-pjax-state=""><i class="fad fa-external-link fa-fw" aria-hidden="true"></i><p>本文地址：' + window.location.href + '</p></a></div>');
      $('#comments').hide();
      $('#s-top').hide();
      $('footer').hide();
      $('#rightmenu-wrapper').hide();
      $('details').attr('open', 'true');
      $('.tab-pane').css({
        'display': 'block'
      });
      $('.tab-content').css({
        'border-top': 'none'
      });
      $('.highlight>table pre').css({
        'white-space': 'pre-wrap',
        'word-break': 'break-all'
      });
      $('.nav-tabs').hide();
      $('.backstretch').hide();
      $('.fancybox img').css({
        'height': 'auto',
        'weight': 'auto'
      });
      $('#common_bkg').hide();
      $('img').removeAttr('srcset data-srcset').removeClass('img lazyload loaded');
    }

    if (volantis.rightMenu.printJs === true) {
      volantis.rightMenu.printJsFun();
    }

    $(document).click();
    setTimeout(() => {
      window.print();
      document.body.innerHTML = '';
      window.location.reload();
    }, 50);
  }

  return {
    init: (notice = false) => {
      fn.init();
      fn.initEvent();
      if (notice) volantis.message('系统提示', '自定义右键注册成功。');
    },
    destroy: (notice = false) => {
      fn.hideMenu();
      $(window).off('click.rightMenu');
      $(window).off('blur.rightMenu');
      $(_rightMenuWrapper).off('blur.rightMenu');
      window.document.oncontextmenu = () => {
        return true
      };
      if (notice) volantis.message('系统提示', '自定义右键注销成功。');
    },
    hideMenu: () => {
      fn.hideMenu();
    }
  }
})()

Object.freeze(RightMenu);
