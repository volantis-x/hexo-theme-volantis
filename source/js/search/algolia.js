let SearchService = (() => {
  const fn = {};
  let search, algolia;

  fn.template = `<div id="u-search">
  <div class="modal">
    <header class="modal-header" class="clearfix">
      <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit">
        <span class="fa-solid fa-search"></span>
      </button>
      <div id="algolia-search-input"></div>
      <a id="u-search-btn-close" class="btn-close"> <span class="fa-solid fa-times"></span> </a>
    </header>
    <main class="modal-body">
      <div id="algolia-search-results">
        <div id="algolia-hits"></div>
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
  }

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

  }

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
      }
    })

    const hits = instantsearch.widgets.hits({
      container: '#algolia-hits',
      templates: {
        item(data) {
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
            <a href="${link}" class="result">
            <span class="title">${result.title.value || 'no-title'}</span>
            <span class="digest">${content}</span>
            </a>`
        },
        empty: function (data) {
          return (
            `<div id="algolia-hits-empty">${volantis.GLOBAL_CONFIG.languages.algolia.hits_empty.replace(/\$\{query}/, data.query)}</div>`
          )
        }
      }
    })

    const stats = instantsearch.widgets.stats({
      container: '#algolia-info > .algolia-stats',
      templates: {
        text: function (data) {
          const stats = volantis.GLOBAL_CONFIG.languages.algolia.hits_stats
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
        first: '<i class="fas fa-angle-double-left"></i>',
        last: '<i class="fas fa-angle-double-right"></i>',
        previous: '<i class="fas fa-angle-left"></i>',
        next: '<i class="fas fa-angle-right"></i>'
      }
    })

    search.addWidgets([configure, searchBox, hits, stats, powerBy, pagination])

    search.start()

    window.pjax && search.on('render', () => {
      window.pjax.refresh(document.getElementById('algolia-hits'))
    })
  }

  fn.setQueryText = queryText => {
    if (!search) {
      fn.init()
    }
    search?.setUiState({
      [algolia.indexName]: {
        query: queryText
      }
    })
  }

  fn.search = () => {
    search?.refresh();
    document.querySelector("#u-search").style.display = "block";
    document.addEventListener("keydown", event => {
      if (event.code === "Escape") {
        fn.close();
      }
    }, { once: true })
  }

  fn.onSubmit = (event) => {
    event.preventDefault();
    let input = event.target.querySelector(".u-search-input");
    fn.setQueryText(input?.value ? input.value : event.target.value)
    fn.search();
  };

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

  fn.close = () => {
    document.querySelector("#u-search").style.display = "none";
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
