// Algolia 搜索服务：基于 instantsearch.js 的搜索界面
let SearchService = (() => {
  const fn = {};
  let search, algolia, timerId;
  fn.queryText = null;

  // 搜索弹窗模板
  fn.template = `<div id="u-search">
  <div class="modal">
    <header class="modal-header" class="clearfix">
      <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
      <div id="algolia-search-input"></div>
      <a id="u-search-btn-close" class="btn-close"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </a>
    </header>
    <main class="modal-body">
      <div id="algolia-search-results">
        <div id="algolia-hits">
          <div class="search-icon"><i class="fa-sharp fa-solid fa-telescope"></i></i></div>
        </div>
      </div>
    </main>
    <footer>
      <div id="algolia-pagination"></div>
      <hr>
      <div id="algolia-info">
        <div class="algolia-stats"></div>
        <div class="algolia-poweredBy"></div>
      </div>
    </footer>
  </div>
  <div id="modal-overlay" class="modal-overlay"></div>
  </div>
  `;

  // 初始化搜索界面
  fn.init = () => {
    let div = document.createElement("div");
    div.innerHTML += fn.template;
    document.body.append(div);

    algolia = volantis.GLOBAL_CONFIG.search;
    if (algolia.appId && algolia.apiKey && algolia.indexName) {
      fn.event();
      fn.setAlgolia();
    } else {
      document.querySelector('#u-search main.modal-body').innerHTML = 'Algolia setting is invalid!';
      document.querySelector('#u-search main.modal-body').style.textAlign = 'center';
      document.querySelector('#u-search .modal').style.maxHeight = '128px';
    }

    fn.uSearch = document.querySelector("#u-search");
    fn.uSearchModal = document.querySelector("#u-search > .modal");
  }

  // 事件绑定
  fn.event = () => {
    document
      .querySelector("#u-search-btn-close")
      .addEventListener("click", fn.close, false);
    document
      .querySelector("#modal-overlay")
      .addEventListener("click", fn.close, false);
    document.querySelectorAll(".u-search-form").forEach((e) => {
      e.addEventListener("submit", fn.onSubmit, false);
    });
    document.querySelector("#algolia-search-input").addEventListener("input", event => {
      let input = event.target.querySelector(".ais-SearchBox-input");
      if (input) {
        fn.queryText = input.value;
      } else {
        fn.queryText = event.target.value;
      }
    })
  }

  // 配置 Algolia 搜索实例和组件
  fn.setAlgolia = () => {
    search = instantsearch({
      indexName: algolia.indexName,
      searchClient: algoliasearch(algolia.appId, algolia.apiKey),
      searchFunction(helper) {
        helper.state.query && helper.search()
      },
    })

    const configure = instantsearch.widgets.configure({
      hitsPerPage: algolia.hitsPerPage
    })

    const searchBox = instantsearch.widgets.searchBox({
      container: '#algolia-search-input',
      autofocus: true,
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
      searchAsYouType: algolia.searchAsYouType,
      placeholder: algolia.placeholder,
      templates: {
        input: 'algolia-input'
      },
      queryHook(query, refine) {
        clearTimeout(timerId)
        timerId = setTimeout(() => refine(query), 500)
      }
    })

    const hits = instantsearch.widgets.hits({
      container: '#algolia-hits',
      templates: {
        item(data) {
          const keyword = !!fn.queryText ? `?keyword=${fn.queryText}` : ''
          const link = data.permalink ? data.permalink : `${volantis.GLOBAL_CONFIG.root}${data.path}`
          const result = data._highlightResult
          const content = result.contentStripTruncate
            ? fn.cutContent(result.contentStripTruncate.value)
            : result.contentStrip
              ? fn.cutContent(result.contentStrip.value)
              : result.content
                ? fn.cutContent(result.content.value)
                : ''
          return `
            <a href="${link}${keyword}" class="result">
            <span class="title">${result.title.value || 'no-title'}</span>
            <span class="digest">${content}</span>
            </a>`
        },
        empty: function (data) {
          return (
            `<div id="resule-hits-empty"><i class="fa-solid fa-box-open"></i><p>${volantis.GLOBAL_CONFIG.languages.search.hits_empty.replace(/\$\{query}/, data.query)}</p></div>`
          )
        }
      }
    })

    const stats = instantsearch.widgets.stats({
      container: '#algolia-info > .algolia-stats',
      templates: {
        text: function (data) {
          const stats = volantis.GLOBAL_CONFIG.languages.search.hits_stats
            .replace(/\$\{hits}/, data.nbHits)
            .replace(/\$\{time}/, data.processingTimeMS)
          return (
            `${stats}`
          )
        }
      }
    })

    const powerBy = instantsearch.widgets.poweredBy({
      container: '#algolia-info > .algolia-poweredBy',
      theme: volantis.dark?.mode === 'dark' ? 'dark' : 'light'
    })

    const pagination = instantsearch.widgets.pagination({
      container: '#algolia-pagination',
      totalPages: 5,
      templates: {
        first: '<i class="far fa-angle-double-left"></i>',
        last: '<i class="far fa-angle-double-right"></i>',
        previous: '<i class="far fa-angle-left"></i>',
        next: '<i class="far fa-angle-right"></i>'
      }
    })

    search.addWidgets([configure, searchBox, hits, stats, powerBy, pagination])

    search.start()

    window.pjax && search.on('render', () => {
      window.pjax.refresh(document.getElementById('algolia-hits'))
    })
  }

  // 设置查询关键词
  fn.setQueryText = queryText => {
    fn.queryText = queryText;
    if (!search) {
      fn.init()
    }
    search?.setUiState({
      [algolia.indexName]: {
        query: queryText
      }
    })
  }

  // 显示搜索弹窗
  fn.search = () => {
    fn.uSearch.style.display = "block";
    setTimeout(() => {
      fn.uSearchModal.style.transform = "translate(0px, 0px)";
    }, 100);
    document.addEventListener("keydown", event => {
      if (event.code === "Escape") {
        fn.close();
      }
    }, { once: true })
  }

  // 表单提交处理
  fn.onSubmit = (event) => {
    event.preventDefault();
    let input = event.target.querySelector(".u-search-input");
    fn.setQueryText(input?.value ? input.value : event.target.value)
    fn.search();
  };

  // 截取搜索结果摘要
  fn.cutContent = content => {
    if (content === '') return ''

    const firstOccur = content.indexOf('<mark>')

    let start = firstOccur - 30
    let end = firstOccur + 120
    let pre = ''
    let post = ''

    if (start <= 0) {
      start = 0
      end = 140
    } else {
      pre = '...'
    }

    if (end > content.length) {
      end = content.length
    } else {
      post = '...'
    }

    let matchContent = pre + content.substring(start, end) + post
    return matchContent
  }

  // 关闭搜索弹窗
  fn.close = () => {
    fn.uSearchModal.style.transform = "translateY(120%)";
    setTimeout(() => {
      fn.uSearch.style.display = "none";
    }, 400);
  };

  return {
    init: fn.init,
    setQueryText: queryText => {
      fn.setQueryText(queryText);
    },
    search: fn.search,
    close: fn.close
  }
})()

Object.freeze(SearchService);

SearchService.init();
document.addEventListener("pjax:send", SearchService.close);
