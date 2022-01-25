
hexo.extend.tag.register('md', function(args) {
  const {config} = hexo;
  const md_path = args[0].trim();
  let md_id = "md-" + hexo.createUuid()
  let mat = `
  <div id="${md_id}" class="tag-md markdown-body"></div>
  <script>
  (()=>{
    volantis.css("${hexo.theme.config.plugins.markdown}");
    const contentEl = document.getElementById("${md_id}");
    const loadMarkdown = (url) => {
      if (!window.fetch) {
        contentEl.innerHTML =
          '<div style="font-size: 24px"><p>Your browser outdated. Please use the latest version of Chrome or Firefox!</p><p>您的浏览器版本过低，请使用最新版的 Chrome 或 Firefox 浏览器！</p></div>';
      } else {
        contentEl.innerHTML =
          '<div style="font-size: 24px">Loading ... | 加载中。。。</div>';
        fetch(url, { method: "GET" })
          .then((resp) => {
            return Promise.all([
              resp.ok,
              resp.status,
              resp.text(),
              resp.headers,
            ]);
          })
          .then(([ok, status, data, headers]) => {
            if (ok) {
              return {
                ok,
                status,
                data,
                headers,
              };
            } else {
              throw new Error(JSON.stringify(json.error));
            }
          })
          .then((resp) => {
            let data = marked.parse(resp.data);
            contentEl.innerHTML = data;
          })
          .catch((error) => {
            console.log(error);
            contentEl.innerHTML =
              '<div style="font-size: 24px"><p>There was a problem loading the file!</p><p>加载文件时出现问题！</p></div>';
          });
      };
    };
    volantis.js("${hexo.theme.config.plugins.marked}").then(()=>{
      loadMarkdown("${md_path}?t=" + new Date().getTime());
    })
  })();
  </script>
  `

  return mat
});
