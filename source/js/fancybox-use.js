// 集成fancybox, 为所有img元素添加父元素
$("img").each(function () {
   	var value = $(this).attr("class");
   	// 头像不进行放大
   	if(value === "avatar") {
   		return ture;
   	}

    var element = document.createElement("a");
    $(element).attr("data-fancybox", "gallery");
    $(element).attr("href", $(this).attr("src"));
    $(this).wrap(element);
});