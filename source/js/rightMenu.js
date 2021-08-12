const RightMenu = (() => {
  const fn = {},
    _rightMenuWrapper = document.getElementById('rightmenu-wrapper'),
    _rightMenuContent = document.getElementById('rightmenu-content'),
    _menuDarkBtn = document.getElementById('menuDarkBtn'),
    _printHtml = document.getElementById('printHtml'),
    _menuMusic = document.getElementById('menuMusic');

  const
    _menuLoad = document.querySelectorAll('.menuLoad-Content'),
    _menuOption = document.querySelector('.menu-Option'),
    _copyText = document.querySelector('.menu-Option[data-fn-type="copyText"]'),
    _copyPaste = document.querySelector('.menu-Option[data-fn-type="copyPaste"]'),
    _copySelect = document.querySelector('.menu-Option[data-fn-type="copySelect"]'),
    _copyCut = document.querySelector('.menu-Option[data-fn-type="copyCut"]'),
    _copyHref = document.querySelector('.menu-Option[data-fn-type="copyHref"]'),
    _copySrc = document.querySelector('.menu-Option[data-fn-type="copySrc"]'),
    _copyImg = document.querySelector('.menu-Option[data-fn-type="copyImg"]'),
    _openTab = document.querySelector('.menu-Option[data-fn-type="openTab"]');

  const urlRegx = /^((https|http)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;

  fn.init = () => {
    fn.visible(_menuMusic, false);
    fn.visible(_menuOption, false);
  }

  fn.initEvent = () => {
    window.document.oncontextmenu = (event) => {
      if (event.ctrlKey || document.body.offsetWidth <= 500) {
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

    window.removeEventListener('blur', fn.hideMenu);
    document.body.removeEventListener('click', fn.hideMenu);

    window.addEventListener('blur', fn.hideMenu);
    document.body.addEventListener('click', fn.hideMenu);
  }

  // 菜单位置设定 
  fn.popMenu = (event) => {
    let mouseClientX = event.clientX;
    let mouseClientY = event.clientY;
    let screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let screenHeight = document.documentElement.clientHeight || document.body.clientHeight;

    try {
      fn.setMenuItem(event);
      fn.visible(_rightMenuWrapper);
      _rightMenuWrapper.focus();
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
      _rightMenuWrapper.blur();
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
    fn.visible(_openTab, false); // 隐藏新标签页打开 

    // 判断是否是输入框 
    if (eventTarget.tagName.toLowerCase() === 'input' || eventTarget.tagName.toLowerCase() === 'textarea') {
      const inputStr = eventTarget.value;

      // 全选 
      if (inputStr.length > 0) {
        fn.visible(_copySelect);
        _copySelect.onclick = () => {
          event.preventDefault();
          eventTarget.select();
        }
      } else {
        fn.visible(_copySelect, false);
      }

      // 剪切 
      if (selectText) {
        fn.visible(_copyCut);
        _copyCut.onclick = () => {
          const statrPos = eventTarget.selectionStart;
          const endPos = eventTarget.selectionEnd;
          fn.copyString(selectText);
          eventTarget.value = inputStr.substring(0, statrPos) + inputStr.substring(endPos, inputStr.length);
          eventTarget.selectionStart = statrPos;
          eventTarget.selectionEnd = statrPos;
          eventTarget.focus();
        }
      } else {
        fn.visible(_copyCut, false);
      }

      // 粘贴 
      fn.readClipboard().then(text => {
        // 如果剪切板存在内容 
        if (!!text) {
          fn.visible(_copyPaste);
          _copyPaste.onclick = () => {
            fn.insertAtCaret(eventTarget, text);
          }
        } else {
          fn.visible(_copyPaste, false);
        }
      }).catch((err) => {
        console.error(err);
        fn.visible(_copyPaste, false);
      });
    } else {
      fn.visible(_copySelect, false);
      fn.visible(_copyPaste, false);
      fn.visible(_copyCut, false);
    }

    // 新标签打开链接 
    const eventHref = eventTarget.href;
    if (!!eventHref && urlRegx.test(eventHref)) {
      optionFlag = true;
      fn.visible(_copyHref);
      fn.visible(_openTab);
      if (_copyHref) _copyHref.onclick = () => {
        fn.copyString(eventHref);
      }
      _openTab.onclick = () => {
        window.open(eventHref);
      }
    } else {
      fn.visible(_copyHref, false);
    }

    // 新标签打开图片 & 复制图片链接 
    const eventSrc = eventTarget.currentSrc;
    if (!!eventSrc && urlRegx.test(eventSrc)) {
      optionFlag = true;
      fn.visible(_copySrc);
      fn.visible(_openTab);

      _copySrc.onclick = () => {
        fn.copyString(eventSrc);
      }

      _openTab.onclick = () => {
        window.open(eventSrc);
      }
    } else {
      fn.visible(_copySrc, false);
    }

    // 复制图片 
    if (!!eventSrc && urlRegx.test(eventSrc) && eventSrc.trimEnd().endsWith('.png')) {
      optionFlag = true;
      fn.visible(_copyImg);

      _copyImg.onclick = () => {
        fn.writeClipImg(event, flag => {
          if (flag) volantis.message('系统提示', '图片复制成功！', volantis.rightMenu.faicon + ' fa-images');
        }, (error) => {
          volantis.message('系统提示', '复制失败：' + error, volantis.rightMenu.faicon + ' fa-exclamation-square red');
        })
      }
    } else {
      fn.visible(_copyImg, false);
    }

    // 复制文本 
    if (selectText) {
      optionFlag = true;
      fn.visible(_copyText);

      _copyText.onclick = () => {
        fn.copyString(selectText);
      }
    } else {
      fn.visible(_copyText, false);
    }

    // 打印 
    const _printArticle = document.querySelector('#post.article') || null;
    const pathName = window.location.pathname;
    if (!!_printArticle) {
      fn.visible(_printHtml);

      _printHtml.onclick = () => {
        if (window.location.pathname === pathName) {
          volantis.question('', '是否打印当前页面？<br><em style="font-size: 80%">建议打印时勾选背景图形</em><br>', () => {
            fn.printHtml();
          })
        } else {
          fn.hideMenu();
        }
      }
    } else {
      fn.visible(_printHtml, false);
    }

    if (volantis.APlayerController.status === 'play') {
      optionFlag = true;
      fn.visible(_menuMusic);
    } else {
      fn.visible(_menuMusic, false);
    }

    _menuLoad.forEach(ele => {
      fn.visible(ele, !optionFlag);
    })

    if (volantis.rightMenu.music == true) {
      if (volantis.APlayerController.APlayerLoaded) {
        MainAPlayer.checkAPlayer();
      }
    }
  }

  // 隐藏菜单 
  fn.hideMenu = () => {
    fn.visible(_rightMenuWrapper, false);
  }

  // 复制字符串 
  fn.copyString = (str) => {
    fn.writeClipText(str)
      .then(() => {
        volantis.message('复制成功', str.length > 120 ? str.substring(0, 120) + '...' : str, volantis.rightMenu.faicon + ' fa-copy');
      }).catch(e => {
        volantis.message('系统提示', e, volantis.rightMenu.faicon + ' fa-exclamation-square red');
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
    const eventSrc = volantis.rightMenu.customPicUrl === true ?
      event.target.currentSrc.replace(volantis.rightMenu.picOld, volantis.rightMenu.picNew) :
      event.target.currentSrc;
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
          success(true);
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
        success(false);
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
  fn.insertAtCaret = (elemt, value) => {
    const startPos = elemt.selectionStart,
      endPos = elemt.selectionEnd;
    if (document.selection) {
      elemt.focus();
      var sel = document.selection.createRange();
      sel.text = value;
      elemt.focus();
    } else {
      if (startPos || startPos == '0') {
        var scrollTop = elemt.scrollTop;
        elemt.value = elemt.value.substring(0, startPos) + value + elemt.value.substring(endPos, elemt.value.length);
        elemt.focus();
        elemt.selectionStart = startPos + value.length;
        elemt.selectionEnd = startPos + value.length;
        elemt.scrollTop = scrollTop;
      } else {
        elemt.value += value;
        elemt.focus();
      }
    }
  }

  // 执行打印页面 
  fn.printHtml = () => {
    if (volantis.rightMenu.defaultStyles === true) {
      fn.setAttribute('details', 'open', 'true');
      fn.remove('.cus-article-bkg');
      fn.remove('.iziToast-overlay');
      fn.remove('.iziToast-wrapper');
      fn.remove('.prev-next');
      fn.remove('#l_header');
      fn.remove('#l_cover');
      fn.remove('#l_side');
      fn.remove('#comments');
      fn.remove('#s-top');
      fn.remove('footer');
      fn.remove('#rightmenu-wrapper');
      fn.remove('.nav-tabs');
      fn.remove('#BKG');
      fn.setStyle('body', 'backgroundColor', 'unset');
      fn.setStyle('#l_main', 'width', '100%');
      fn.setStyle('#post', 'boxShadow', 'none');
      fn.setStyle('#post', 'background', 'none');
      fn.setStyle('#post', 'padding', '0');
      fn.setStyle('h1', 'textAlign', 'center');
      fn.setStyle('h1', 'fontWeight', '600');
      fn.setStyle('h1', 'fontSize', '2rem');
      fn.setStyle('h1', 'marginBottom', '20px');
      fn.setStyle('.tab-pane', 'display', 'block');
      fn.setStyle('.tab-content', 'borderTop', 'none');
      fn.setStyle('.highlight>table pre', 'whiteSpace', 'pre-wrap');
      fn.setStyle('.highlight>table pre', 'wordBreak', 'break-all');
      fn.setStyle('.fancybox img', 'height', 'auto');
      fn.setStyle('.fancybox img', 'weight', 'auto');
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

  // 控制元素显示隐藏
  fn.visible = (ele, type = true) => {
    if (ele) ele.style.display = type === true ? 'block' : 'none';
  }

  // 移除元素
  fn.remove = (param) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.remove();
    })
  }

  //设置属性
  fn.setAttribute = (param, attrName, attrValue) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.setAttribute(attrName, attrValue)
    })
  }

  // 设置样式
  fn.setStyle = (param, styleName, styleValue) => {
    const node = document.querySelectorAll(param);
    node.forEach(ele => {
      ele.style[styleName] = styleValue;
    })
  }

  return {
    init: (notice = false) => {
      fn.init();
      fn.initEvent();
      if (notice) volantis.message('系统提示', '自定义右键注册成功。');
    },
    destroy: (notice = false) => {
      fn.hideMenu();
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

if (document.readyState !== 'loading') {
  RightMenu.init();

  volantis.pjax.send(() => {
    RightMenu.hideMenu();
  })
} else {
  document.addEventListener("DOMContentLoaded", function () {
    RightMenu.init();

    volantis.pjax.send(() => {
      RightMenu.hideMenu();
    })
  })
}