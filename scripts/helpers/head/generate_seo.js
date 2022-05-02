hexo.extend.helper.register('generate_seo', function (theme, page) {
  const hexo = this;
  let robots_content="";
  if (page.robots) {
    robots_content = page.robots
  } else if (theme.seo && theme.seo.robots) {
    if (hexo.is_home()) {
      if (page.prev == 0) {
        robots_content=theme.seo.robots.home_first_page
      }else{
        robots_content=theme.seo.robots.home_other_pages
      }
    } else if (hexo.is_archive()) {
      robots_content=theme.seo.robots.archive
    } else if (hexo.is_category()) {
      robots_content=theme.seo.robots.category
    } else if (hexo.is_tag()) {
      robots_content=theme.seo.robots.tag
    }
  }
  if(robots_content){
    return `<meta name="robots" content="${robots_content}">`
  }
});