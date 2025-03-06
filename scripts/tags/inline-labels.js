'use strict';

function createTag(tagName) {
  return function(args) {
    return `<${tagName}>${args.join(' ')}</${tagName}>`;
  };
}

hexo.extend.tag.register('u', createTag('u'));
hexo.extend.tag.register('emp', createTag('emp'));
hexo.extend.tag.register('wavy', createTag('wavy'));
hexo.extend.tag.register('del', createTag('del'));
hexo.extend.tag.register('kbd', createTag('kbd'));
hexo.extend.tag.register('psw', createTag('psw'));