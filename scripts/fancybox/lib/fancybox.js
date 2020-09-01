'use strict';

function lazyProcess(htmlContent, target)  {

    let fb = this.theme.config.plugins.fancybox, fbFlag = true;
    if (fb == undefined || fb.enable != true) {
        fbFlag = false;
    }

    return htmlContent.replace(/<img.*?(?:>|\/>)/gi, function(img) {
        let imgSrc = '', imgAlt = '', imgClass = '';

        if (/src=[\'\"]?([^\'\"]*)[\'\"]?/i.test(img)) {
            imgSrc = img.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
        }
        if (/alt=[\'\"]?([^\'\"]*)[\'\"]?/i.test(img)) {
            imgAlt = img.match(/alt=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
        }
        if (/class=[\'\"]?([^\'\"]*)[\'\"]?/i.test(img)) {
            imgClass = img.match(/class=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
        }

        if (/data:image(.*?)/gi.test(imgSrc)) {
            return img;
        }

        if (/inline/gi.test(imgClass)) {
            return img;
        }

        if (/fancybox/gi.test(img)) {
            return img;
        }

        img = img.replace('<img', '<img fancybox');

        if (fbFlag) {
            return "<div class='fancybox'>"
                + "  <div class='bg'> "
                + "    <a class='fancybox' pjax-fancybox href='" + imgSrc + "' data-fancybox='images' data-caption='" + imgAlt + "'>"
                +         img
                + "    </a>"
                + "  </div>"
                + "  <span class='image-caption'>" + imgAlt + "</span>"
                + "</div>";
        } else {
            return "<div class='fancybox'>"
                + "  <div class='bg'> "
                +       img
                + "  </div>"
                + "  <span class='image-caption'>" + imgAlt + "</span>"
                + "</div>";
        }
    });
}

module.exports.processPost = function(data) {
  data.content = lazyProcess.call(this, data.content, 'post');
  return data;
};

module.exports.processSite = function (htmlContent) {
  return lazyProcess.call(this, htmlContent, 'site');
};
