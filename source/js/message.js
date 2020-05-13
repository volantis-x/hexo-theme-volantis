$.extend({
    message: function (a) {
        var b = {
            title: "",
            message: " 操作成功",
            time: "3000",
            type: "success",
            showClose: !0,
            autoClose: !0,
            onClose: function () {}
        };
        "string" == typeof a && (b.message = a), "object" == typeof a && (b = $.extend({}, b, a));
        var c, d, e, f = b.showClose ? '<div class="c-message--close">×</div>' : "",
            g = "" !== b.title ? '<h2 class="c-message__title">' + b.title + "</h2>" : "",
            h = '<div class="c-message animated animated-lento slideInRight"><i class=" c-message--icon c-message--' + b.type + '"></i><div class="el-notification__group">' + g + '<div class="el-notification__content">' + b.message + "</div>" + f + "</div></div>",
            i = $("body"),
            j = $(h);
        d = function () {
            j.addClass("slideOutRight"), j.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                e()
            })
        }, e = function () {
            j.remove(), b.onClose(b), clearTimeout(c)
        }, $(".c-message").remove(), i.append(j), j.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            j.removeClass("messageFadeInDown")
        }), i.on("click", ".c-message--close", function (a) {
            d()
        }), b.autoClose && (c = setTimeout(function () {
            d()
        }, b.time))
    }
})