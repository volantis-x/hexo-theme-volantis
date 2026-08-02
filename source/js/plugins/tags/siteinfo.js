// 本插件由CardLink定制而成，原项目源码: https://github.com/Lete114/CardLink
function setCardLink(nodes) {
  // If the `nodes` do not contain a `forEach` method, then the default `a[cardlink]` is used
  nodes = 'forEach' in (nodes || {}) ? nodes : document.querySelectorAll('a[cardlink]')
  nodes.forEach((el) => {
    // If it is not a tag element then it is not processed
    if (el.nodeType !== 1) return;
    el.removeAttribute('cardlink');
    const api = el.dataset.api;
    if (api == null) return;
    fetch(api).then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
      var autofill = [];
      const autofillStr = el.getAttribute('autofill');
      if (autofillStr) {
        autofill = autofillStr.split(',');
      }
      if (data.title && data.title.length > 0 && autofill.includes('title')) {
        el.querySelector('.title').innerHTML = data.title;
        el.title = data.title;
      }
      if (data.icon && data.icon.length > 0 && autofill.includes('icon')) {
        el.querySelector('.img').style = 'background-image: url("' + data.icon + '");';
        el.querySelector('.img').setAttribute('data-bg', data.icon);
      }
      let desc = el.querySelector('.desc');
      if (desc && data.desc && data.desc.length > 0 && autofill.includes('desc')) {
        desc.innerHTML = data.desc;
      }
    }).catch(function(error) {
      console.error(error);
    });
  })
}
