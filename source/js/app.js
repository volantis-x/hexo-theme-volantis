/* eslint-disable */
var customSearch;
(function ($) {

	"use strict";

	// 校正页面定位（被导航栏挡住的区域）
	var scrollCorrection = 80; // (header height = 64px) + (gap = 16px)
	var $headerAnchor = $('.l_header', '.cover-wrapper');
	if ($headerAnchor[0]) {
		scrollCorrection = $headerAnchor[0].clientHeight + 16;
	}

	// 尝试： 重设数据值  作用判断待定
	function restData() {
		scrollCorrection = 80;
		$headerAnchor = $('.l_header', '.cover-wrapper');
		if ($headerAnchor[0]) {
			scrollCorrection = $headerAnchor[0].clientHeight + 16;
		}
	}

	// 校正页面定位（被导航栏挡住的区域）
	function scrolltoElement(elem, correction = scrollCorrection) {
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({
			'scrollTop': $elem.offset().top - correction
		}, 500);
	}

	// 设置滚动锚点
	function setScrollAnchor() {
		const $postsBtn = $('.menu .active');            // 一级导航上的当前激活的按钮
		const $topBtn = $('.s-top');                     // 向上
		const $titleBtn = $('h1.title', '#header-meta'); // 文章内标题
		const $bodyAnchor = $('.l_body');                // 页面主体

		if ($postsBtn.length && $bodyAnchor) {
			$postsBtn.click(e => {                 // 挺好奇这个的点击的作用  感觉没啥用
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
				e.stopImmediatePropagation();
			});
		}
		if ($titleBtn.length && $bodyAnchor) {
			$titleBtn.click(e => {                // 挺好奇这个的点击的作用  感觉没啥用
				e.preventDefault();                 // +1 好奇
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
				e.stopImmediatePropagation();
			});
		}
		if ($topBtn.length && $bodyAnchor) {
			$topBtn.click(e => {                  // 天天向上 呱~
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($bodyAnchor);
				e.stopImmediatePropagation();
			});
		}

		//==========================================
		//  不知道怎么处理的封面部分 👇👇👇👇👇👇👇👇👇

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

	// 设置导航栏  fix √
	function setHeader() {
		if (!window.subData) return;
		const $wrapper = $('header .wrapper');        // 整个导航栏
		const $comment = $('.s-comment', $wrapper);   // 评论按钮  桌面端 移动端
		const $toc = $('.s-toc', $wrapper);           // 目录按钮  仅移动端

		// 判断文章用的，只有在文章页面才需要进行一二级导航的切换
		const pathname = window.location.pathname;
		const parm1 = pathname == "/" ? "index" : pathname.split('/')[1];
		const parm2 = HEXO_PERMALINK.split('/')[0];
		const isArticle = (parm1 == "" || parm1 == parm2) ? true : false;

		$wrapper.find('.nav-sub .title').text(window.subData.title);   // 二级导航文章标题

		// 决定一二级导航栏的切换
		let pos = document.body.scrollTop;
		if (isArticle){
      $(document, window).scroll(() => {
          const scrollTop = $(window).scrollTop();
          const del = scrollTop - pos;
          if (del >= 50 && scrollTop > 100) {
            pos = scrollTop;
            $wrapper.addClass('sub');
          } else if (del <= -50) {
            pos = scrollTop;
            $wrapper.removeClass('sub');  // <---- 取消二级导航显示
          }
      });
		}

		// bind events to every btn
		let $commentTarget = $('.l_body .comments');  // 评论区域
		if ($commentTarget.length) {
			$comment.click(e => {                         // 评论按钮点击后 跳转到评论区域
				e.preventDefault();
				e.stopPropagation();
				scrolltoElement($('.l_body .comments'));
				e.stopImmediatePropagation();
			});
		}
		// else $comment.remove();   // bug：进入到没有评论的页面后，评论按钮被移除的   （👇 咋加？）
		                             // todo： 或许可以尝试在 pjax 完成事件里手动添加评论按钮
		                             // ==============================================


		// -------------------------hello world------------------------- //

		const $tocTarget = $('.l_body .toc-wrapper');         // 侧边栏的目录列表  PC
		if ($tocTarget.length && $tocTarget.children().length) {
			$toc.click((e) => {
				e.stopPropagation();
				$tocTarget.toggleClass('active');
				$toc.toggleClass('active');
			});
			$(document).click(function (e) {
				e.stopPropagation();
				$tocTarget.removeClass('active');
				$toc.removeClass('active');
			});
			$(document, window).scroll(() => {
				$tocTarget.removeClass('active');
				$toc.removeClass('active');
			});
		} else $toc.remove();
	}

	// 设置导航栏菜单选中状态            <-------------- 重新加载下即可
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

	// 设置导航栏搜索框   fix √
	function setHeaderSearch() {
		var $switcher = $('.l_header .switcher .s-search');   // 搜索按钮   移动端
		var $header = $('.l_header');                         // 移动端导航栏
		var $search = $('.l_header .m_search');               // 搜索框 桌面端
		if ($switcher.length === 0) return;
		$switcher.click(function (e) {
			// e.stopPropagation();
			$header.toggleClass('z_search-open');   // 激活移动端搜索框
			$switcher.toggleClass('active');        // 搜索按钮
			$search.find('input').focus();
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

	// 设置导航栏搜索框
	function setTocToggle() {
		const $toc = $('.toc-wrapper');   // 侧边栏 TOC 移动端
		if ($toc.length === 0) return;
		$toc.click((e) => {
		    e.stopPropagation();
		    $toc.addClass('active');
		});
		$(document).click(() => $toc.removeClass('active'));

		// 👇  不知道是干嘛的  懒得看了
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

		// balabala  此处暂时这样判断吧，存在没有 toc 的文章的，需要过滤
		// TODO：需改善

		const liElements = Array.from($toc.find('li a'));
		if (liElements.length != 0) {
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
	}

	// 设置搜索服务
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

	// 设置 tabs 标签
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
		setHeaderSearch();
		setTocToggle();
		setScrollAnchor();
		setSearchService();
		setTabs();

		// 全屏封面底部箭头 无需处理
		$('.scroll-down').on('click', function () {
	    scrolltoElement('.l_body');
	  });


		// addEventListener是先绑定先执行，此处的绑定后执行
		document.addEventListener('pjax:success', function () {
			try {
				restData();
				setHeader();
				setHeaderMenuSelection();
				setTocToggle();
				setScrollAnchor();
				setTabs();

			} catch (error) {
				console.log(error);
			}
		});
	});



})(jQuery);
