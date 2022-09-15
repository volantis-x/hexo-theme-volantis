let SearchService = (() => {
  const fn = {};
  let search, meilisearch, timerId; 
  fn.queryText = null;
  fn.template = `<div id="u-search">
  <div class="modal">
    <header class="modal-header" class="clearfix">
      <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit">
        <span class="fa-solid fa-search"></span>
      </button>
      <div id="meilisearch-search-input"></div>
      <a id="u-search-btn-close" class="btn-close"> <span class="fa-solid fa-times"></span> </a>
    </header>
    <main class="modal-body">
      <div id="meilisearch-search-results">
        <div id="meilisearch-hits">
          <div class="search-icon"><i class="fa-sharp fa-solid fa-telescope"></i></i></div>
        </div>
      </div>
    </main>
    <footer>
      <hr>
      <div id="meilisearch-info">
        <div class="meilisearch-stats"></div>
        <div class="meilisearch-poweredBy">
          <a href="https://www.meilisearch.com" titile="meilisearch" target="_blank">
            <svg width="97" height="20" viewBox="0 0 537 83" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M49.8729 49.6398C49.8729 41.9727 53.5489 37.4565 60.5858 37.4565C67.2026 37.4565 69.4082 42.1827 69.4082 48.2744V80.9383H84.3222V46.5939C84.3222 33.7805 77.6004 24.643 64.3668 24.643C56.4897 24.643 50.9232 27.0586 46.0919 32.4151C42.941 27.5838 37.5846 24.643 30.1275 24.643C22.2504 24.643 16.7889 27.8989 14.2682 32.6251V25.9033H0.509521V80.9383H15.4236V49.3247C15.4236 41.9727 19.2046 37.4565 26.1365 37.4565C32.7532 37.4565 34.9588 42.1827 34.9588 48.2744V80.9383H49.8729V49.6398Z" fill="black"/><path d="M145.538 57.727C145.538 57.727 145.748 55.7314 145.748 53.3158C145.748 37.0363 134.72 24.643 118.441 24.643C102.161 24.643 90.8184 37.0363 90.8184 53.3158C90.8184 70.2253 102.266 82.1986 118.546 82.1986C131.254 82.1986 141.337 74.5315 144.593 63.3985H129.574C127.788 67.3896 123.482 69.3851 118.966 69.3851C111.509 69.3851 106.678 65.289 105.627 57.727H145.538ZM118.336 36.6162C125.268 36.6162 129.784 40.8174 130.834 47.014H105.837C107.098 40.7123 111.509 36.6162 118.336 36.6162Z" fill="black"/><path d="M147.947 38.7168H154.564V80.9383H169.478V25.9033H147.947V38.7168ZM162.021 18.7614C167.272 18.7614 171.054 15.0854 171.054 9.83396C171.054 4.58254 167.272 0.801514 162.021 0.801514C156.77 0.801514 152.989 4.58254 152.989 9.83396C152.989 15.0854 156.77 18.7614 162.021 18.7614Z" fill="black"/><path d="M200.361 68.1248C199.94 68.1248 199.31 68.2298 198.365 68.2298C195.004 68.2298 194.584 66.6544 194.584 64.3438V2.16688H179.67V65.394C179.67 76.317 183.871 81.1483 195.739 81.1483C197.735 81.1483 199.625 80.9382 200.361 80.8332V68.1248Z" fill="black"/><path d="M202.057 38.7168H208.674V80.9383H223.588V25.9033H202.057V38.7168ZM216.131 18.7614C221.383 18.7614 225.164 15.0854 225.164 9.83396C225.164 4.58254 221.383 0.801514 216.131 0.801514C210.88 0.801514 207.099 4.58254 207.099 9.83396C207.099 15.0854 210.88 18.7614 216.131 18.7614Z" fill="black"/><path d="M253.531 81.5175C268.025 81.5175 274.852 73.8504 274.852 65.7632C274.852 43.2871 241.768 55.7855 241.768 40.9765C241.768 36.1452 245.864 32.0491 254.161 32.0491C262.669 32.0491 266.66 36.6703 267.29 42.4469H274.747C274.117 35.1999 269.18 25.5373 254.371 25.5373C241.663 25.5373 234.521 33.0994 234.521 41.2916C234.521 63.2425 267.605 50.6391 267.605 65.9733C267.605 71.3297 262.564 75.0057 253.531 75.0057C244.289 75.0057 239.667 70.3845 239.142 63.5576H231.58C232.21 72.9051 238.092 81.5175 253.531 81.5175Z" fill="black"/><path d="M334.078 55.6805C334.078 55.6805 334.183 54 334.183 52.8447C334.183 37.7206 324.415 25.5373 308.451 25.5373C292.382 25.5373 282.194 38.6659 282.194 53.4749C282.194 68.4939 291.647 81.5175 308.556 81.5175C321.265 81.5175 330.087 73.7454 333.238 63.5576H325.466C323.155 70.0694 316.853 74.7956 308.661 74.7956C297.423 74.7956 290.386 66.4984 289.651 55.6805H334.078ZM308.451 32.2592C318.954 32.2592 325.781 39.2961 326.726 49.5888H289.861C291.121 39.7162 298.053 32.2592 308.451 32.2592Z" fill="black"/><path d="M380.477 54.8402V59.8816C380.477 69.0191 373.86 75.3208 361.152 75.3208C353.274 75.3208 348.968 72.0649 348.968 65.028C348.968 61.457 350.649 58.7263 353.274 57.2559C356.005 55.7855 359.681 54.8402 380.477 54.8402ZM360.311 81.5175C369.554 81.5175 377.011 78.5767 380.792 72.485V80.2571H387.934V45.2827C387.934 33.4145 381.107 25.5373 365.668 25.5373C350.859 25.5373 344.347 32.9944 342.982 42.5519H350.229C351.699 34.9899 357.476 31.9441 365.353 31.9441C375.435 31.9441 380.477 36.1452 380.477 45.1776V48.6436C363.567 48.6436 356.53 48.9587 351.279 51.0592C345.187 53.4749 341.616 58.8313 341.616 65.2381C341.616 74.5856 347.603 81.5175 360.311 81.5175Z" fill="black"/><path d="M428.703 26.3776C428.703 26.3776 427.443 26.2725 426.917 26.2725C417.045 26.2725 411.793 31.4189 409.798 35.0949V26.7977H402.656V80.2571H410.113V49.9039C410.113 38.7709 416.94 33.3094 426.077 33.3094C427.443 33.3094 428.703 33.4145 428.703 33.4145V26.3776Z" fill="black"/><path d="M429.976 53.5799C429.976 68.1789 440.059 81.5175 456.338 81.5175C470.832 81.5175 479.235 71.8548 481.335 61.247H473.773C471.568 69.5442 465.476 74.7956 456.338 74.7956C445.1 74.7956 437.538 65.8682 437.538 53.5799C437.538 41.1866 445.1 32.2592 456.338 32.2592C465.476 32.2592 471.568 37.5106 473.773 45.8078H481.335C479.235 35.1999 470.832 25.5373 456.338 25.5373C440.059 25.5373 429.976 38.8759 429.976 53.5799Z" fill="black"/><path d="M498.891 1.48584H491.434V80.2571H498.891V48.6436C498.891 37.7206 505.927 32.0491 514.96 32.0491C524.517 32.0491 529.034 37.9307 529.034 47.5933V80.2571H536.491V46.1229C536.491 34.2547 529.454 25.5373 516.22 25.5373C506.243 25.5373 500.781 30.9988 498.891 34.2547V1.48584Z" fill="black"/></svg>
          </a>
        </div>
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

    meilisearch = volantis.GLOBAL_CONFIG.search;
    if (meilisearch.appId && meilisearch.apiKey && meilisearch.indexName) {
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
    document.querySelector("#meilisearch-search-input").addEventListener("input", event => {
      let input = event.target.querySelector(".ais-SearchBox-input");
      if (input) {
        fn.queryText = input.value;
      } else {
        fn.queryText = event.target.value;
      }
    })
  }

  fn.setAlgolia = () => {
    search = instantsearch({
      indexName: meilisearch.indexName,
      searchClient: instantMeiliSearch(meilisearch.appId, meilisearch.apiKey),
      searchFunction(helper) {
        helper.state.query && helper.search()
      },
    })

    const configure = instantsearch.widgets.configure({
      hitsPerPage: meilisearch.hitsPerPage
    })

    const searchBox = instantsearch.widgets.searchBox({
      container: '#meilisearch-search-input',
      autofocus: true,
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
      searchAsYouType: meilisearch.searchAsYouType,
      placeholder: meilisearch.placeholder,
      templates: {
        input: 'meilisearch-input'
      },
      queryHook(query, refine) {
        clearTimeout(timerId)
        timerId = setTimeout(() => refine(query), 500)
      }
    })

    const hits = instantsearch.widgets.hits({
      container: '#meilisearch-hits',
      templates: {
        item(data) {
          const keyword = !!fn.queryText ? `?keyword=${fn.queryText}` : ''
          const link = data.permalink ? data.permalink : `${volantis.GLOBAL_CONFIG.root}${data.path}`
          const result = data._highlightResult
          const content = fn.cutContent(result.text.value)
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
      container: '#meilisearch-info > .meilisearch-stats',
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

    search.addWidgets([searchBox, hits, stats])

    search.start()

    window.pjax && search.on('render', () => {
      window.pjax.refresh(document.getElementById('meilisearch-hits'))
    })
  }

  fn.setQueryText = queryText => {
    fn.queryText = queryText;
    if (!search) {
      fn.init()
    }
    search?.setUiState({
      [meilisearch.indexName]: {
        query: queryText
      }
    })
  }

  fn.search = () => {
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
