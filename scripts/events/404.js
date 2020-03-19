hexo.extend.generator.register('404', function(locals){
  return {
    path: '404.html',
    data: locals.posts,
    layout: ['404']
  }
});
