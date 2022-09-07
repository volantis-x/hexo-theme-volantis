
// https://github.com/D0n9X1n/hexo-blog-encrypt/blob/master/ReadMe.zh.md#关于-callback-函数
hexo.extend.filter.register('before_post_render', function(data){
  if (data.password) {
    data.content += `
<style>
#toc-div {
  display: block !important;
}
</style>
<script>
volantis.requestAnimationFrame(listenSidebarTOC);
</script>
`
  }
  return data;
});