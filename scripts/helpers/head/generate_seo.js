function addImagePreviewIfNoNoindex(robotsContent) {
    // 检查是否不包含 'noindex' 且尚未包含 max-image-preview
    if (!robotsContent.toLowerCase().includes('noindex') && 
        !robotsContent.toLowerCase().includes('max-image-preview')) {
        // 处理行尾标点，确保添加格式正确
        const trimmed = robotsContent.trim();
        const needsSemicolon = trimmed && !trimmed.endsWith(',');
        return `${robotsContent}${needsSemicolon ? ',' : ''} max-image-preview:large`;
    }
    return robotsContent;
}
hexo.extend.helper.register('generate_seo', function (theme, page) {
  const hexo = this;
  let robots_content = "";
  if (page.robots) {
    robots_content = page.robots
  } else if (theme.seo && theme.seo.robots) {
    if (hexo.is_home()) {
      if (page.prev == 0) {
        robots_content = theme.seo.robots.home_first_page
      } else {
        robots_content = theme.seo.robots.home_other_pages
      }
    } else if (hexo.is_archive()) {
      robots_content = theme.seo.robots.archive
    } else if (hexo.is_category()) {
      robots_content = theme.seo.robots.category
    } else if (hexo.is_tag()) {
      robots_content = theme.seo.robots.tag
    }
  }
  const IS_BACKUP = process.env.IS_BACKUP === 'true';
  if (IS_BACKUP) {
    robots_content = 'noindex, nofollow, noarchive';
  }
  if (robots_content) {
    robots_content = addImagePreviewIfNoNoindex(robots_content)
    return `<meta name="robots" content="${robots_content}">`
  }else{
    return `<meta name="robots" content="index,follow,max-image-preview:large">`
  }
});
