'use strict';

// {% pandown type, url, pwd, fname %}
hexo.extend.tag.register('pandown', function(args) {
    if(/::/g.test(args)){
        args = args.join(' ').split('::');
    }
    else{
        args = args.join(' ').split(',');
    }
    let type = '';
    let url = '';
    let pwd = '';
    let fname = '';
    if (args.length < 4) {
        return;
    } else if (args[0].trim() === 'yun') {
        return '<p>对不起，pandown-tags不支持自定义</p><br><p>Sorry, pandown-tags does not support customization</p>'
    } else {
        type = args[0].trim();
        url = args[1].trim();
        pwd = args[2].trim();
        fname = args[3].trim();
    }
    let result = '';
    // js
    result += '<div class="tag pandown-tags">';
    //pandown
    result += '<pandown type="'+type+'" url="'+url+'" pwd="'+pwd+'" fname="'+fname+'"></pandown>'
    //调用
    result += '<script>volantis.js("https://unpkg.com/pandown").then(pandown)</script></div>'
    return result;
});
