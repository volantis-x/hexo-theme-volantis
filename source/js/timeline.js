$(function(){
	systole();
});
// TODO: 全局加载的话,除非首次进入,否则无动画
function systole(){
	if(!$(".history").length){
		return;
	}
	var $warpEle = $(".history-date"),
		$targetA = $warpEle.find("h2 a,ul li dl dt a"),
		parentH,
		eleTop = [];
	
	parentH = $warpEle.parent().height();
	$warpEle.parent().css({"height":59});
	
	setTimeout(function(){
		$warpEle.find("ul").children(":not('.first-li')").each(function(idx){
			eleTop.push($(this).position().top);
			$(this).css({"margin-top":-eleTop[idx]}).children().hide();
		}).animate({"margin-top":0}, 800).children().fadeIn();

		$warpEle.parent().animate({"height":parentH}, 1500);

		$warpEle.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({"-webkit-animation-duration":"2s","-webkit-animation-delay":"0","-webkit-animation-timing-function":"ease","-webkit-animation-fill-mode":"both"}).end().children("h2").css({"position":"relative"});
		
	}, 200);

	$targetA.click(function(){
		$(this).parent().parent().css({"position":"relative"});		// parent为同级的li元素
		$(this).parent().parent().siblings().slideToggle();
		$warpEle.parent().removeAttr("style");
		return false;
	});
};
window.systole = systole