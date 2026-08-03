/**
 * 上次修改更新：6.8.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * timeline.js v2.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 *
 * {% Timeline %}
 *
 * <!-- node header1 -->
 * what happened 1
 *
 * <!-- node header2 -->
 * what happened 2
 *
 * {% endTimeline %}
 */

'use strict'

function layoutNodeTitle(ctx, content) {
  var el = ''
  el += '<div class="header">'
  if (content && content.length > 0) {
    el += `<span>${content}</span>`
  }
  el += '</div>'
  return el
}

function layoutNodeContent(ctx, content) {
  var el = ''
  el += '<div class="body fs14">'
  if (content && content.length > 0) {
    el += ctx.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')
  }
  el += '</div>'
  return el
}

function Timeline(rawArgs, content = '') {
  const ctx = hexo;
  let args = {}
  for (const item of rawArgs) {
    if (typeof item !== 'string') continue
    const idx = item.indexOf(':')
    if (idx === -1) continue

    const key = item.slice(0, idx)
    const value = item.slice(idx + 1)
    args[key] = value
  }

  const type = args.type || 'timeline'

  let classBuffer = ''
  let attrBuffer = ''
  if (args.api) {
    args['data-api'] = args.api
    delete args.api

    const attrKeys = Object.keys(args).filter(
      key =>
        key !== 'type' &&
        args[key] !== undefined &&
        args[key] !== null &&
        args[key] !== ''
    )

    classBuffer += ` data-service ds-${type}"`

    if (attrKeys.length) {
      attrBuffer += ' ' + ctx.args.joinTags(args, attrKeys).join(' ')
    }
  }

  let el = `<div class="tag-plugin timeline-v6${classBuffer}"${attrBuffer}>`

  var arr = content.split(/<!--\s*node (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (arr.length > 0) {
    var nodes = []
    arr.forEach((item, i) => {
      if (i % 2 == 0) {
        nodes.push({
          header: item
        })
      } else if (nodes.length > 0) {
        var node = nodes[nodes.length-1]
        if (node.body == undefined) {
          node.body = item
        } else {
          node.body += '\n' + item
        }
      }
    })
    nodes.forEach((node, i) => {
      el += '<div class="timenode-v6" index="' + (i) + '">'
      el += layoutNodeTitle(ctx, node.header)
      el += layoutNodeContent(ctx, node.body)
      el += '</div>'
    })  
  }

  el += '</div>'
  return el
}

hexo.extend.tag.register('Timeline', Timeline, {ends: true})







/**
 * 上次修改更新：5.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */
/**
 * timeline.js | https://volantis.js.org/v3/tag-plugins/#Timeline
 */


function postTimeline(args, content) {
  if (args.length > 0) {
    return `<div class="timeline"><p class='p h2'>${args}</p>${content}</div>`;
  }
  return `<div class="timeline">${content}</div>`;

}

function postTimenode(args, content) {
  if (/::/g.test(args)) {
    args = args.join(' ').split('::');
  }
  else {
    args = args.join(' ').split(',');
  }
  var time = args[0];
  return `<div class="timenode"><div class="meta"><p>${hexo.render.renderSync({ text: time, engine: 'markdown' })}</p></div><div class="body">${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}</div></div>`;
}


// {% timeline %}
// ... timenode ...
// {% endtimeline %}
hexo.extend.tag.register('timeline', postTimeline, { ends: true });

// {% timenode time %}
// what happened
// {% endtimenode %}
hexo.extend.tag.register('timenode', postTimenode, { ends: true });
