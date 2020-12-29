'use strict';

function postP(args) {
  args = args.join(' ').split(',');
  const p0 = args[0].trim();
  const p1 = args[1].trim();
  return `<p class='p ${p0}'>${p1}</p>`;
}
function postSpan(args) {
  args = args.join(' ').split(',');
  const p0 = args[0].trim();
  const p1 = args[1].trim();
  return `<span class='p ${p0}'>${p1}</span>`;
}

hexo.extend.tag.register('p', postP);
hexo.extend.tag.register('span', postSpan);
