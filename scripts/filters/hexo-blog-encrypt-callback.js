
// https://github.com/D0n9X1n/hexo-blog-encrypt/blob/master/ReadMe.zh.md#关于-callback-函数
hexo.extend.filter.register('before_post_render', function (data) {
  const tagEncryptPairs = [];
  let password = data.password;
  let tagUsed = false;

  // use a empty password to disable category encryption
  if (password === "") {
    return data;
  }
  if (hexo.config.encrypt === undefined) {
    hexo.config.encrypt = [];
  }
  if (('encrypt' in hexo.config) && ('tags' in hexo.config.encrypt)) {
    hexo.config.encrypt.tags.forEach((tagObj) => {
      tagEncryptPairs[tagObj.name] = tagObj.password;
    });
  }
  if (data.tags) {
    data.tags.forEach((cTag) => {
      if (tagEncryptPairs.hasOwnProperty(cTag.name)) {
        tagUsed = password ? tagUsed : cTag.name;
        password = password || tagEncryptPairs[cTag.name];
      }
    });
  }
  if (password == undefined) {
    return data;
  }

  // callback
  data.content += `
<style>
#toc-div {
  display: block !important;
}
</style>
<script>
volantis.pjax.method.complete.start();
</script>
`
  return data;
});
