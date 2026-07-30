/**
 * 上次修改更新：6.7.0 | https://github.com/volantis-x/hexo-theme-volantis
 *
 */

/**
 * okr.js v2 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 
 * {% okr o1 percent:50 status:in_track/at_risk/off_track/finished/unfinished %}
 * title (only one line)
 * note
 * <!-- okr kr1 percent:100 status:in_track/at_risk/off_track/finished/unfinished -->
 * title (only one line)
 * note
 * {% endokr %}
 * 
 */

'use strict'

function splitContentAndNote(input) {
  var arr = input.trim().split('\n').filter(item => item.trim().length > 0)
  if (arr.length == 0) {
    return {title:'', note:''}
  }
  const title = arr.shift()
  const note = arr.join('\n')
  return {title:title, note:note}
}

function generateKRList(ctx, contentArray) {
  if (contentArray.length < 3) {
    console.error('invalid okr tag:', contentArray);
    return []
  }
  var result = []
  var krTagIndexes = []
  for (let index = 0; index < contentArray.length; index++) {
    const element = contentArray[index];
    if (element.startsWith('kr')) {
      krTagIndexes.push(index)
    }
  }
  for (let index of krTagIndexes) {
    if (index >= contentArray.length) {
      break
    }
    const tagStr = contentArray[index]
    const contentStr = contentArray[index+1]
    if (contentStr.startsWith('kr')) {
      continue
    }
    result.push({
      krMeta: ctx.args.map(tagStr.split(/\s+/), ['percent', 'status'], 'krIndex'),
      krBody: splitContentAndNote(contentStr)
    })
  }
  return result
}

function layoutItem(ctx, type, index, title, note, color, label, percent) {
  const percentStr = percent.toString().replace(/\.\d*/, '')
  return `
  <div class="okr-item ${type}" id="okr-${index.toLowerCase()}">
    <div class="okr-left">
      <span class="title">${index.toUpperCase()}</span>
    </div>
    <div class="okr-center">
      <span class="title">${title}</span>
      <div class="okr-note">${ctx.render.renderSync({text: note, engine: 'markdown'}).split('\n').join('')}</div>
    </div>
    <div class="okr-right colorful" color="${color}">
      <div class="labels">
        <span class="status label">${label}</span>
        <span class="status percent">${percentStr}%</span>
      </div>
      <div class="progress">
        <div class="fill" style="width:${percentStr}%;"></div>
      </div>
    </div>
  </div>
  `
}

function okr(args, content = '') {
  const ctx = hexo;
  args = ctx.args.map(args, ['percent', 'status', 'color'], 'oIndex')
  var contentArray = content.split(/<!--\s*okr (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (contentArray.length < 3) {
    console.error('invalid okr tag:', contentArray);
    return ''
  }
  const statusList = ctx.theme.config.tag_plugins.okr.status
  const oMeta = args
  const oBody = splitContentAndNote(contentArray.shift())
  const krList = generateKRList(ctx, contentArray)
  
  var el_krs = ''
  var krPercentList = []
  for (let kr of krList) {
    const { krMeta, krBody } = kr
    const krPercent = Number(krMeta.percent) || 0
    if (krMeta == null || krBody == null) {
      continue
    }
    var status = null
    if (krMeta.status && statusList[krMeta.status]) {
      status = statusList[krMeta.status] 
    }
    if (status == null) {
      if (krPercent >= 100) {
        status = statusList['finished']
      } else {
        status = statusList['in_track']
      }
    }
    krPercentList.push(krPercent)
    el_krs += layoutItem(ctx, 'kr', krMeta.krIndex, krBody.title, krBody.note, status.color, status.label, krPercent)
  }
  const krPercentSum = krPercentList.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  
  const oPercent = Number(oMeta.percent) || (krPercentSum / krPercentList.length).toFixed(2)
  var status = null
  if (args.status != null && args.status && statusList[args.status]) {
    status = statusList[args.status] 
  }
  if (status == null) {
    if (oPercent >= 100) {
      status = statusList['finished']
    } else {
      status = statusList['in_track']
    }
  } 
  
  var el = ''
  el += '<div class="tag-plugin colorful okr"'
  el += ' ' + ctx.args.joinTags(args, ['color']).join(' ')
  el += '>'
  el += layoutItem(ctx, 'o', oMeta.oIndex, oBody.title, oBody.note, status.color, status.label, oPercent)
  el += el_krs
  el += '</div>'
  return el
}

hexo.extend.tag.register('okr', okr, {ends: true})



