// https://web.dev/content-visibility/
// https://www.caniuse.com/?search=content-visibility
// 在文章内容渲染时将每两个 <h2> 之间的内容分为一块 用 <div class="post-story"></div> 包裹起来。然后为 .post-story 声明 content-visibility: auto
hexo.extend.filter.register('after_post_render', function (data) {
  let dataList = data.content.split('\n')
  let mydata = ``
  let flag = 1
  dataList.forEach(e => {
    let yy = e.replace(/<h2.*?>.*?<\/h2>/, function (str) {
      if (flag) {
        flag = 0
        return str + `<div class="story post-story">`
      } else {
        return `</div>` + str + `<div class="story post-story">`
      }
    })
    mydata += yy
    mydata += "\n"
  });
  if (!flag) {
    mydata += `</div>`
  }
  data.content = mydata
  return data;
});