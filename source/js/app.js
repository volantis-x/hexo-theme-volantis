/* eslint-disable */
var customSearch;
(function ($) {

	"use strict";
	var scrollCorrection = 80; // (header height = 64px) + (gap = 16px)
	const $headerAnchor = $('.l_header', '.cover-wrapper');
	if ($headerAnchor[0]) {
		scrollCorrection = $headerAnchor[0].clientHeight + 16;
	}

	function scrolltoElement(elem, correction) {
		correction = correction || scrollCorrection;
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 400);
	};

  function setScrollAnchor(){
		// button
		const $postsBtn = $('.menu .active');
		const $topBtn = $('.s-top');
		const $titleBtn = $('h1.title', '#header-meta');
		// anchor
		const $bodyAnchor = $('.l_body');
		// action
		if ($postsBtn.length && $bodyAnchor) {
			$postsBtn.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($bodyAnchor); });
		}
		if ($titleBtn.length && $bodyAnchor) {
			$titleBtn.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($bodyAnchor); });
		}
		if ($topBtn.length && $bodyAnchor) {
			$topBtn.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($bodyAnchor); });
		}

		const $coverAnchor = $('.cover-wrapper');
		var showHeaderPoint = 0;
		if ($coverAnchor[0]) {
			showHeaderPoint = $coverAnchor[0].clientHeight - 164;
		}
		var pos = document.body.scrollTop;
		$(document, window).scroll(() => {
			const scrollTop = $(window).scrollTop();
			const del = scrollTop - pos;
			pos = scrollTop;
			if (scrollTop > 150) {
				$topBtn.addClass('show');
        if (del > 0) {
          $topBtn.removeClass('hl');
        } else {
          $topBtn.addClass('hl');
        }
			} else {
				$topBtn.removeClass('show').removeClass('hl');
			}
			if (scrollTop > showHeaderPoint) {
				$headerAnchor.addClass('show');
			} else {
				$headerAnchor.removeClass('show');
			}
		});
  }

	function setHeader() {
		if (!window.subData) return;
		const $wrapper = $('header .wrapper');
		const $comment = $('.s-comment', $wrapper);
		const $toc = $('.s-toc', $wrapper);

		$wrapper.find('.nav-sub .logo').text(window.subData.title);
		let pos = document.body.scrollTop;
		$(document, window).scroll(() => {
			const scrollTop = $(window).scrollTop();
			const del = scrollTop - pos;
			if (del >= 50 && scrollTop > 100) {
				pos = scrollTop;
				$wrapper.addClass('sub');
			} else if (del <= -50) {
				pos = scrollTop;
				$wrapper.removeClass('sub');
			}
		});

		// bind events to every btn
		const $commentTarget = $('#comments');
		if ($commentTarget.length) {
			$comment.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($commentTarget); });
		} else $comment.remove();

		const $tocTarget = $('.toc-wrapper');
		if ($tocTarget.length && $tocTarget.children().length) {
			$toc.click((e) => { e.stopPropagation(); $tocTarget.toggleClass('active'); });
		} else $toc.remove();



	}

	function setHeaderMenuSelection() {
    var $headerMenu = $('body .navgation');
    // 先把已经激活的取消激活
    $headerMenu.find('li a.active').removeClass('active');
		// var $underline = $headerMenu.find('.underline');
		function setUnderline($item) {
			// if (!transition) $underline.addClass('disable-trans');
			if ($item && $item.length) {
				$item.addClass('active').siblings().removeClass('active');
			}
		}
		//set current active nav
		var $active_link = null;
    var idname = location.pathname.replace(/\/|%/g, "");
    if (idname.length == 0) {
      idname = "home";
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
		if (idname && $headerMenu) {
			$active_link = $('#' + idname, $headerMenu);
			setUnderline($active_link);
		}
	}

	function setHeaderMenuPhone() {
		var $switcher = $('.l_header .switcher .s-menu');
		$switcher.click(function (e) {
			e.stopPropagation();
			$('body').toggleClass('z_menu-open');
			$switcher.toggleClass('active');
		});
		$(document).click(function (e) {
			$('body').removeClass('z_menu-open');
			$switcher.removeClass('active');
		});
	}

	function setHeaderSearch() {
		var $switcher = $('.l_header .switcher .s-search');
		var $header = $('.l_header');
		var $search = $('.l_header .m_search');
		if ($switcher.length === 0) return;
		$switcher.click(function (e) {
			e.stopPropagation();
			$header.toggleClass('z_search-open');
			$search.find('input').focus();
		});
		$(document).click(function (e) {
			$header.removeClass('z_search-open');
		});
		$search.click(function (e) {
			e.stopPropagation();
		});
    $header.ready(function () {
      $header.bind('keydown', function (event) {
        if (event.keyCode == 9) {
          return false;
        } else {
          var isie = (document.all) ? true: false;
          var key;
          var ev;
          if (isie) { //IE浏览器
            key = window.event.keyCode;
            ev = window.event;
          } else { //火狐浏览器
            key = e.which;
            ev = e;
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
        }
      });
    });
	}

	function setTocToggle() {
		const $toc = $('.toc-wrapper');
		if ($toc.length === 0) return;
		// $toc.click((e) => {
        //     e.stopPropagation();
        //     $toc.addClass('active');
        // });
		$(document).click(() => $toc.removeClass('active'));

		$toc.on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.target.tagName === 'A') {
        scrolltoElement(e.target);
      } else if (e.target.tagName === 'SPAN') {
        scrolltoElement(e.target.parentElement);
      }
      $toc.removeClass('active');
		});

		const liElements = Array.from($toc.find('li a'));
		//function animate above will convert float to int.
		const getAnchor = () => liElements.map(elem => Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection));

		let anchor = getAnchor();
		const scrollListener = () => {
			const scrollTop = $('html').scrollTop() || $('body').scrollTop();
			if (!anchor) return;
			//binary search.
			let l = 0, r = anchor.length - 1, mid;
			while (l < r) {
				mid = (l + r + 1) >> 1;
				if (anchor[mid] === scrollTop) l = r = mid;
				else if (anchor[mid] < scrollTop) l = mid;
				else r = mid - 1;
			}
			$(liElements).removeClass('active').eq(l).addClass('active');
		}
		$(window)
			.resize(() => {
				anchor = getAnchor();
				scrollListener();
			})
			.scroll(() => {
				scrollListener()
			});
		scrollListener();
	}


	$(function () {
		//set header
		setHeader();
		setHeaderMenuSelection();
		setHeaderMenuPhone();
		setHeaderSearch();

		setTocToggle();
    setScrollAnchor();
		// $(".article .video-container").fitVids();

		setTimeout(function () {
			$('#loading-bar-wrapper').fadeOut(500);
		}, 300);


		if (SEARCH_SERVICE === 'google') {
			customSearch = new GoogleCustomSearch({
				apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
				engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'algolia') {
			customSearch = new AlgoliaSearch({
				apiKey: ALGOLIA_API_KEY,
				appId: ALGOLIA_APP_ID,
				indexName: ALGOLIA_INDEX_NAME,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'hexo') {
			customSearch = new HexoSearch({
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'azure') {
			customSearch = new AzureSearch({
				serviceName: AZURE_SERVICE_NAME,
				indexName: AZURE_INDEX_NAME,
				queryKey: AZURE_QUERY_KEY,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'baidu') {
			customSearch = new BaiduSearch({
				apiId: BAIDU_API_ID,
				imagePath: "/images/"
			});
		}

	});

})(jQuery);
