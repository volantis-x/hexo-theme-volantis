/* eslint-disable */
var customSearch;
(function ($) {

	"use strict";
	var scrollCorrection = 80; // (header height = 64px) + (gap = 16px)
	const $headerAnchor = $('.l_header', '.cover-wrapper');
	if ($headerAnchor[0]) {
		scrollCorrection = $headerAnchor[0].clientHeight + 16;
	}

	function scrolltoElement(elem, correction = scrollCorrection) {
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({
			'scrollTop': $elem.offset().top - correction
		}, 500);
	}

	function setScrollAnchor() {
		// button
		const $postsBtn = $('.menu .active');
		const $topBtn = $('.s-top');
		const $titleBtn = $('h1.title', '#header-meta');
		// anchor
		const $bodyAnchor = $('.l_body');
		// action
		if ($postsBtn.length && $bodyAnchor) {
			$postsBtn.click(e => {
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
			});
		}
		if ($titleBtn.length && $bodyAnchor) {
			$titleBtn.click(e => {
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
			});
		}
		if ($topBtn.length && $bodyAnchor) {
			$topBtn.click(e => {
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
			});
		}

		const $coverAnchor = $('.cover-wrapper');
		var showHeaderPoint = 0;
		if ($coverAnchor[0]) {
			showHeaderPoint = $coverAnchor[0].clientHeight - 180;
		}
		var pos = document.body.scrollTop;
		$(document, window).scroll(() => {
			const scrollTop = $(window).scrollTop();
			const del = scrollTop - pos;
			pos = scrollTop;
			if (scrollTop > 180) {
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

		$wrapper.find('.nav-sub .title').text(window.subData.title);
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
		const $commentTarget = $('.l_body .comments');
		if ($commentTarget.length) {
			$comment.click(e => {
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($commentTarget);
			});
		} else $comment.remove();

		const $tocTarget = $('.l_body .toc-wrapper');
		if ($tocTarget.length && $tocTarget.children().length) {
			$toc.click((e) => {
				e.stopPropagation();
				$tocTarget.toggleClass('active');
				$toc.toggleClass('active');
			});
			$(document).click(function (e) {
				$tocTarget.removeClass('active');
				$toc.removeClass('active');
			});
			$(document, window).scroll(() => {
				$tocTarget.removeClass('active');
				$toc.removeClass('active');
			});
		} else $toc.remove();



	}

	function setHeaderMenuSelection() {
		var $headerMenu = $('body .navigation');
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
		// replace '%' '/' '.'
		var idname = location.pathname.replace(/\/|%|\./g, "");
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
		// var $switcher = $('.l_header .switcher .s-menu');
		// var $menu = $('body .menu-phone');
		// $switcher.click(function (e) {
		// 	e.stopPropagation();
		// 	$menu.toggleClass('show');
		// 	$switcher.toggleClass('active');
		// });
		// $(document).click(function (e) {
		// 	// $menu.removeClass('show');
		// 	$switcher.removeClass('active');
		// });
		// $(document, window).scroll(() => {
		// 	$menu.removeClass('show');
		// 	$switcher.removeClass('active');
		// });
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
			$switcher.toggleClass('active');
		});
		$(document).click(function (e) {
			$header.removeClass('z_search-open');
			$switcher.removeClass('active');
		});
		$search.click(function (e) {
			e.stopPropagation();
		});
		$header.ready(function () {
			$header.bind('keydown', function (event) {
				if (event.keyCode == 9) {
					return false;
				} else {
					var isie = (document.all) ? true : false;
					var key;
					var ev;
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
				}
			});
		});
	}

	function setTocToggle() {
		const $toc = $('.toc-wrapper');
		if ($toc.length === 0) return;
		$toc.click((e) => {
		    e.stopPropagation();
		    $toc.addClass('active');
		});
		$(document).click(() => $toc.removeClass('active'));

		$toc.on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.target.tagName === 'A') {
				scrolltoElement(e.target, 0);
			} else if (e.target.tagName === 'SPAN') {
				scrolltoElement(e.target.parentElement, 0);
			}
			$toc.removeClass('active');
			const $tocBtn = $('.s-toc');
			if ($tocBtn.length > 0) {
				$tocBtn.removeClass('active');
			}
		});

		const liElements = Array.from($toc.find('li a'));
		//function animate above will convert float to int.
		const getAnchor = () => liElements.map(elem => Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection));

		let anchor = getAnchor();
		const scrollListener = () => {
			const scrollTop = $('html').scrollTop() || $('body').scrollTop();
			if (!anchor) return;
			//binary search.
			let l = 0,
				r = anchor.length - 1,
				mid;
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

	function setSearchService() {
		if (SEARCH_SERVICE === 'google') {
			customSearch = new GoogleCustomSearch({
				apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
				engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
				imagePath: "/img/"
			});
		} else if (SEARCH_SERVICE === 'algolia') {
			customSearch = new AlgoliaSearch({
				apiKey: ALGOLIA_API_KEY,
				appId: ALGOLIA_APP_ID,
				indexName: ALGOLIA_INDEX_NAME,
				imagePath: "/img/"
			});
		} else if (SEARCH_SERVICE === 'hexo') {
			customSearch = new HexoSearch({
				imagePath: "/img/"
			});
		} else if (SEARCH_SERVICE === 'azure') {
			customSearch = new AzureSearch({
				serviceName: AZURE_SERVICE_NAME,
				indexName: AZURE_INDEX_NAME,
				queryKey: AZURE_QUERY_KEY,
				imagePath: "/img/"
			});
		} else if (SEARCH_SERVICE === 'baidu') {
			customSearch = new BaiduSearch({
				apiId: BAIDU_API_ID,
				imagePath: "/img/"
			});
		}
	}

	function setTabs() {
		const $tabs = $('.tabs');
		if ($tabs.length === 0) return;
		let $navs = $tabs.find('.nav-tabs .tab');
		for (var i = 0; i < $navs.length; i++) {
			let $a = $tabs.find($navs[i].children[0]);
			$a.addClass($a.attr("href"));
			$a.removeAttr('href');
		}
		$('.tabs .nav-tabs').on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			let $tab = $(e.target.parentElement.parentElement.parentElement);
			$tab.find('.nav-tabs .active').removeClass('active');
			$tab.find(e.target.parentElement).addClass('active');
			$tab.find('.tab-content .active').removeClass('active');
			$tab.find($(e.target).attr("class")).addClass('active');
			return false;
		});
	}

	$(function () {
		setHeader();
		setHeaderMenuSelection();
		setHeaderMenuPhone();
		setHeaderSearch();
		setTocToggle();
		setScrollAnchor();
		setSearchService();
		setTabs();
		// $(".article .video-container").fitVids();
		$('.scroll-down').on('click', function () {
	    scrolltoElement('.l_body');
	  });
		setTimeout(function () {
			$('#loading-bar-wrapper').fadeOut(500);
		}, 300);
	});

})(jQuery);

/*code-block-fullscreen*/
$("figcaption").click(function () {
	if (window.CodeBlockFullscreen) {
		$("#post").removeClass("code-block-fullscreen");
		$(this).parent().removeClass("code-block-fullscreen");
		$(this).parent().removeClass("code-block-fullscreen-overflow-auto");
		$("html").removeClass("code-block-fullscreen-html-scroll");
		$(".highlight>table .gutter").removeClass("code-block-fullscreen-gutter");
		window.CodeBlockFullscreen = false
	} else {
		$("#post").addClass("code-block-fullscreen");
		$(this).parent().addClass("code-block-fullscreen");
		$(this).parent().addClass("code-block-fullscreen-overflow-auto");
		$("html").addClass("code-block-fullscreen-html-scroll");
		$(".highlight>table .gutter").addClass("code-block-fullscreen-gutter");
		window.CodeBlockFullscreen = true
	}
});
