/**
 * 搜索服务类（单例模式）
 * 负责搜索界面渲染、事件绑定、搜索数据处理、结果展示、搜索历史管理
 * 支持多类型筛选（全部/文章/页面/标签）、关键词高亮、localStorage存储搜索历史
 */
class SearchService {
  /**
   * 单例实例，确保全局唯一的搜索服务实例
   * @type {SearchService|null}
   */
  static instance = null;

  /**
   * 构造函数（单例模式核心：防止重复创建实例）
   * 初始化搜索相关属性、多语言文本、搜索界面模板，执行实例初始化
   */
  constructor() {
    // 单例判断：若已存在实例，直接返回现有实例，避免重复创建
    if (!SearchService.instance) {
      this.queryText = null; // 当前搜索关键词
      this.data = null; // 搜索数据源（文章/页面/标签等）
      this.searchHistory = []; // 搜索历史数组
      this.maxHistoryCount = 5; // 最大搜索历史记录数（防止过多）
      this.isComposing = false; // 输入法组合状态标识（处理中文输入时的特殊事件）
      this.debouncedInputHandler = this.debounce(event => {
        if (!this.isComposing) this.onSubmit(event);
      }, 300);

      // 多语言文本配置（优先使用全局配置，无则用默认值）
      const searchLang = volantis.GLOBAL_CONFIG?.languages?.search || {};
      this.hitsEmpty = searchLang.hits_empty || '未找到与「${query}」相关的内容';
      this.hitsFound = searchLang.hits_found || '找到 ${totalResults} 个相关结果';
      this.normalText = searchLang.placeholder || '搜索文章、标签或分类...';
      this.loadDataText = searchLang.normal || '正在加载数据...';
      this.searchingText = searchLang.searching || '搜索中...';
      this.searchHistoryText = searchLang.history || '搜索历史';
      this.noSearchHistoryText = searchLang.no_history || '暂无搜索历史';
      this.clearHistoryText = searchLang.clear_history || '清除历史';
      this.filterAll = searchLang.filter_all || '全部';
      this.filterPosts = searchLang.filter_posts || '文章';
      this.filterPages = searchLang.filter_pages || '页面';
      this.filterTags = searchLang.filter_tags || '标签';
      this.labelPosts = searchLang.label_posts || '文章';
      this.labelPages = searchLang.label_pages || '页面';
      this.labelTags = searchLang.label_tags || '标签';

      // 空查询时的默认显示内容
      this.normal = `<div class="result-hits-empty"><p>${this.normalText}🔍</p></div>`;

      // 搜索界面HTML模板（模态框结构：输入区+筛选区+结果区+历史区+加载区+遮罩层）
      this.template = `
        <div class="modal">
          <header class="modal-header clearfix">
            <form id="u-search-modal-form" class="u-search-form" name="uSearchModalForm">
              <input type="text" id="u-search-modal-input" class="u-search-input" placeholder="${this.normalText}" autocomplete="off" />
              <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
            <a id="u-search-btn-close" class="btn-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </a>
          </header>
          <div class="search-filters">
            <button class="filter-btn active" data-filter="all">${this.filterAll}</button>
            <button class="filter-btn" data-filter="posts">${this.filterPosts}</button>
            <button class="filter-btn" data-filter="pages">${this.filterPages}</button>
            <button class="filter-btn" data-filter="tags">${this.filterTags}</button>
          </div>
          <main class="modal-body">
            <div class="search-stats hidden"></div>
            <ul class="modal-results"></ul>
            <div class="search-history hidden">
              <h3>${this.searchHistoryText}</h3>
              <button class="clear-history">${this.clearHistoryText}</button>
              <ul class="history-list"></ul>
            </div>
            <div class="search-loading hidden">
              <div class="spinner"></div>
              <p>${this.loadDataText}</p>
            </div>
          </main>
        </div>
        <div id="modal-overlay" class="modal-overlay"></div>`;

      // 初始化实例（创建DOM、绑定事件、加载历史）
      this.initInstance();
      // 赋值单例实例，确保后续调用获取同一实例
      SearchService.instance = this;
    }
    // 返回单例实例（无论是否新建，确保全局唯一）
    return SearchService.instance;
  }

  /**
   * 静态方法：初始化单例实例
   * 防止外部直接new创建，统一通过该方法初始化
   */
  static init() {
    if (!SearchService.instance) {
      new SearchService();
    }
  }

  /**
   * 实例初始化核心方法
   * 1. 创建搜索DOM元素（若不存在）
   * 2. 绑定所有交互事件
   * 3. 加载localStorage中的搜索历史
   * 4. 更新搜索历史的DOM显示
   * 5. 初始化暗黑模式状态并设置监听器
   */
  initInstance() {
    // 若页面中无#u-search元素，创建并添加到body
    if (!document.querySelector('#u-search')) {
      const div = document.createElement("div");
      div.id = "u-search"; // 搜索容器ID
      div.innerHTML = this.template; // 插入搜索界面模板
      document.body.append(div); // 添加到页面body
    }

    this.bindEvents(); // 绑定所有交互事件
    this.loadSearchHistory(); // 从localStorage加载搜索历史
    this.updateHistoryDisplay(); // 更新搜索历史的DOM显示
  }

  /**
   * 绑定所有搜索相关交互事件
   * 包括：输入框事件、表单提交、关闭/遮罩点击、筛选切换、历史管理事件
   */
  bindEvents() {
    const uSearchModalInput = document.querySelector("#u-search-modal-input");
    if (!uSearchModalInput.hasAttribute('data-event-bound')) {
      uSearchModalInput.setAttribute('data-event-bound', 'true');
      uSearchModalInput.addEventListener("compositionstart", () => (this.isComposing = true));
      uSearchModalInput.addEventListener("compositionend", (event) => {
        this.isComposing = false;
        this.onSubmit(event);
      });
      uSearchModalInput.addEventListener("input", this.debouncedInputHandler.bind(this));

      document.querySelectorAll(".u-search-form").forEach((e) => {
        e.addEventListener("submit", this.onSubmit.bind(this));
      });

      document.querySelector("#u-search-btn-close").addEventListener("click", this.close.bind(this));
      document.querySelector("#modal-overlay").addEventListener("click", this.close.bind(this));

      // 筛选按钮点击事件（全部/文章/页面/标签）
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.onSubmit({
            preventDefault: () => { },
            target: document.querySelector("#u-search-modal-form")
          });
        });
      });

      // 清除历史按钮点击事件：清空搜索历史
      document.querySelector('.clear-history').addEventListener('click', () => {
        this.clearSearchHistory();
      });

      // 搜索历史列表项点击事件：点击历史关键词填充输入框并触发搜索
      document.querySelector('.history-list').addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          uSearchModalInput.value = e.target.textContent;
          this.onSubmit({
            preventDefault: () => { },
            target: document.querySelector("#u-search-modal-form")
          });
        }
      });
    }
  }

  /**
   * 搜索提交处理函数
   * 阻止表单默认提交行为，获取搜索关键词，触发搜索逻辑
   * @param {Event} event - 提交事件（表单submit/输入框input等）
   */
  async onSubmit(event) {
    event.preventDefault();
    const input = event.target.querySelector(".u-search-input") || event.target;
    this.queryText = input.value.trim();

    await this.search();
  }

  /**
   * 核心搜索逻辑
   * 1. 显示搜索界面和加载状态
   * 2. 加载数据源（若未加载）
   * 3. 根据筛选条件生成搜索结果
   * 4. 显示结果/空状态/搜索历史
   * 5. 绑定ESC关闭事件
   */
  async search() {
    // 获取所有搜索相关DOM元素
    const searchInputs = document.querySelectorAll(".u-search-input"); // 所有搜索输入框
    const searchModal = document.querySelector("#u-search"); // 搜索容器
    const modalOverlay = document.querySelector("#modal-overlay"); // 遮罩层
    const modalResults = document.querySelector("#u-search .modal-results"); // 结果列表
    const modal = document.querySelector("#u-search .modal"); // 模态框主体
    const searchStats = document.querySelector('.search-stats'); // 结果统计
    const searchLoading = document.querySelector('.search-loading'); // 加载状态
    const searchLoadingText = searchLoading.querySelector('p'); // 加载状态文本
    const searchHistory = document.querySelector('.search-history'); // 搜索历史
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter; // 当前筛选条件（all/posts/pages/tags）

    // 同步所有输入框的关键词
    searchInputs.forEach((input) => (input.value = this.queryText));

    // 显示搜索容器和遮罩层毛玻璃效果
    searchModal.style.display = "block";
    modalOverlay.style.backdropFilter = "blur(10px)";

    // 延迟100ms执行模态框显示动画
    setTimeout(() => {
      modal.style.transform = "translate(0px, 0px)"; // 从下移状态恢复到正常位置
    }, 100);

    // 显示加载状态，隐藏统计、历史和结果
    modalResults.innerHTML = '';
    modalResults.style.flex = '';
    searchStats.classList.add('hidden');
    searchLoading.classList.remove('hidden');
    searchHistory.classList.add('hidden');

    // 若未加载数据源，异步获取（从配置的dataPath请求）
    if (!this.data) {
      searchLoadingText.textContent = this.loadDataText;
      this.data = await this.fetchData();
    } else {
      searchLoadingText.textContent = this.searchingText;
    }

    // 延迟300ms执行结果生成
    setTimeout(async () => {
      let results = ""; // 最终搜索结果HTML
      let totalResults = 0; // 总结果数统计

      // 根据当前筛选条件生成对应结果
      if (activeFilter === 'all' || activeFilter === 'posts') {
        // 生成文章类型结果（调用buildResultList）
        const postResults = this.buildResultList(this.data.posts, 'post');
        results += postResults.html; // 拼接文章结果HTML
        totalResults += postResults.count; // 累加文章结果数
      }

      if (activeFilter === 'all' || activeFilter === 'pages') {
        // 生成页面类型结果（调用buildResultList）
        const pageResults = this.buildResultList(this.data.pages, 'page');
        results += pageResults.html; // 拼接页面结果HTML
        totalResults += pageResults.count; // 累加页面结果数
      }

      if (activeFilter === 'all' || activeFilter === 'tags') {
        // 生成标签类型结果（调用buildTagResults）
        const tagResults = this.buildTagResults();
        results += tagResults.html; // 拼接标签结果HTML
        totalResults += tagResults.count; // 累加标签结果数
      }

      // 隐藏加载状态（搜索完成）
      searchLoading.classList.add('hidden');

      // 处理搜索结果显示逻辑
      if (!results) {
        modalResults.style.flex = 1;
        // 无结果：显示空状态提示（替换关键词占位符）
        results = `<div class="result-hits-empty no-results">
          <i class="fa-solid fa-search"></i>
          <p>${this.hitsEmpty.replace(/\$\{query}/, this.queryText)}</p>
        </div>`;
        searchStats.classList.add('hidden'); // 隐藏统计（无结果无需统计）
      } else {
        // 有结果：显示结果统计，保存搜索历史（关键词非空时）
        searchStats.textContent = this.hitsFound.replace(/\$\{totalResults}/, totalResults);
        searchStats.classList.remove('hidden');

        // 关键词非空时，添加到搜索历史
        if (this.queryText && this.queryText.length > 0) {
          this.addToSearchHistory(this.queryText);
        }
      }

      // 空查询（关键词为空）：显示默认提示和搜索历史
      if (this.queryText === "") {
        results = this.normal; // 显示默认提示（如“搜索文章、标签或分类...”）
        searchStats.classList.add('hidden'); // 隐藏统计
        searchHistory.classList.remove('hidden'); // 显示搜索历史
        this.updateHistoryDisplay(); // 更新历史显示（确保最新）
      }

      // 渲染搜索结果到DOM
      modalResults.innerHTML = results;
      // 若存在pjax，刷新搜索容器（适配pjax页面切换场景）
      window.pjax && pjax.refresh(searchModal);
      // 重新初始化懒加载（适配新结果中的图片）
      window.lazyLoader && window.lazyLoader.reinitObserver();

      // 绑定ESC键关闭搜索模态框（单次有效，关闭后移除事件）
      const handleKeydown = (event) => {
        if (event.code === "Escape") { // 监听ESC键
          this.close(); // 关闭模态框
          document.removeEventListener("keydown", handleKeydown); // 移除事件监听（避免内存泄漏）
        }
      };
      document.addEventListener("keydown", handleKeydown);
    }, 300);
  }

  /**
   * 关闭搜索模态框
   * 执行模态框隐藏动画，延迟隐藏容器和取消遮罩层效果
   */
  close() {
    const modal = document.querySelector("#u-search .modal"); // 模态框主体
    const searchOverlay = document.querySelector("#u-search"); // 搜索容器
    const modalOverlay = document.querySelector("#modal-overlay"); // 遮罩层

    // 模态框下移动画（隐藏效果）
    modal.style.transform = "translateY(120%)";
    // 延迟300ms（等待动画完成）后隐藏容器，取消遮罩层毛玻璃
    setTimeout(() => {
      searchOverlay.style.display = "none";
      modalOverlay.style.backdropFilter = "blur(0)";
    }, 300);
  }

  /**
   * 异步获取搜索数据源
   * 从全局配置的search.dataPath请求JSON数据（文章/页面/标签等）
   * @returns {Promise<Object|null>} 数据源JSON对象，失败返回null
   */
  async fetchData() {
    try {
      // 发送GET请求获取数据源
      const response = await fetch(volantis.GLOBAL_CONFIG.search.dataPath);
      // 解析JSON响应并返回
      return await response.json();
    } catch (error) {
      // 捕获请求/解析错误，打印日志
      console.error("Error fetching search data:", error);
      return null; // 失败返回null
    }
  }

  /**
   * 构建文章/页面类型的搜索结果列表
   * @param {Array} data - 数据源数组（文章或页面列表）
   * @param {string} type - 结果类型（post：文章，page：页面）
   * @returns {Object} { html: 结果HTML字符串, count: 结果数量 }
   */
  buildResultList(data, type) {
    // 数据或关键词为空时，返回空结果
    if (!data || !this.queryText) return { html: '', count: 0 };

    // 按更新时间降序排序（最新的结果排在前面）
    const sortedData = data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    let results = ''; // 结果HTML字符串
    let count = 0; // 结果数量统计

    // 遍历排序后的数据源，筛选匹配的结果
    sortedData.forEach(item => {
      // 调用contentSearch判断当前项是否匹配关键词
      if (this.contentSearch(item)) {
        // 匹配则生成单个结果项HTML，拼接至结果中
        results += this.buildResult(item, type);
        count++; // 累加结果数量
      }
    });

    // 若有结果，添加结果分组标题（如“文章 (5)”、“页面 (1)”）
    if (results && count > 0) {
      const label = type === 'post' ? this.labelPosts : this.labelPages;
      results = `<li class="result-group"><h3>${label} (${count})</h3></li>` + results;
    }

    // 返回结果HTML和数量
    return { html: results, count };
  }

  /**
   * 构建标签类型的搜索结果列表
   * 匹配标签名中包含关键词的标签，生成标签结果项
   * @returns {Object} { html: 结果HTML字符串, count: 结果数量 }
   */
  buildTagResults() {
    // 标签数据或关键词为空时，返回空结果
    if (!this.data.tags || !this.queryText) return { html: '', count: 0 };

    const query = this.queryText.toLowerCase(); // 关键词转为小写（不区分大小写匹配）
    let results = ''; // 结果HTML字符串
    let count = 0; // 结果数量统计

    // 遍历标签数据源，筛选匹配的标签
    this.data.tags.forEach(tag => {
      // 标签名包含关键词（不区分大小写）
      if (tag.name.toLowerCase().includes(query)) {
        // 生成单个标签结果项HTML（包含图标、高亮关键词的标签名、链接）
        results += `
          <li class="tag-result">
            <a href="${tag.permalink}">
              <span class="tag-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke="currentColor">
                  <line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>
                </svg>
              </span>
              <span class="tag-name">${this.highlightMatch(tag.name)}</span>
            </a>
          </li>
        `;
        count++; // 累加结果数量
      }
    });

    // 若有结果，添加标签分组标题（如“标签 (1)”）
    if (results && count > 0) {
      results = `<li class="result-group"><h3>${this.labelTags} (${count})</h3></li><ul class="result-tags-list">${results}</ul>`;
    }

    // 返回结果HTML和数量
    return { html: results, count };
  }

  /**
   * 判断内容是否匹配关键词（文章/页面通用）
   * 匹配范围：标题、内容、描述、标签，匹配则生成高亮摘要
   * @param {Object} post - 单个文章/页面对象
   * @returns {boolean} 匹配返回true，不匹配返回false
   */
  contentSearch(post) {
    // 关键词为空时，不匹配
    if (!this.queryText) return false;

    // 拆分关键词为数组（支持空格/连字符分隔，转为小写）
    const keywords = this.queryText.toLowerCase().split(/[-\s]+/);
    // 提取文章/页面的关键字段（转为小写，无则为空字符串）
    const postTitle = post?.title?.toLowerCase() || '';
    const postContent = (post?.content || post?.text)?.toLowerCase() || '';
    const postDescription = (post?.description || post?.excerpt)?.toLowerCase() || '';
    const postTags = post?.tags?.map(t => t.name.toLowerCase()).join(' ') || '';

    // 检查是否包含任一关键词（标题/内容/描述/标签中任一匹配即可）
    const foundMatch = keywords.some(word =>
      postTitle.includes(word) ||
      postContent.includes(word) ||
      postDescription.includes(word) ||
      postTags.includes(word)
    );

    // 无匹配关键词，返回false
    if (!foundMatch) return false;

    // 有匹配：生成高亮摘要（截取关键词附近内容）
    const fullText = postContent || postDescription || postTitle; // 优先用内容，无则用描述/标题
    // 找到第一个关键词出现的位置（取最小索引）
    const firstOccur = keywords.reduce((acc, word) => {
      const index = fullText.indexOf(word);
      return index !== -1 && index < acc ? index : acc; // 存在且索引更小则更新
    }, fullText.length);

    // 截取摘要范围：关键词前40字符到后120字符（防止超出文本长度）
    const start = Math.max(firstOccur - 40, 0);
    const end = Math.min(firstOccur + 120, fullText.length);
    // 移除HTML标签，高亮关键词（用mark标签包裹）
    const matchContent = this.stripHTML(fullText).slice(start, end)
      .replace(new RegExp(`(${keywords.join("|")})`, "gi"), "<mark>$1</mark>");

    // 将高亮摘要赋值给post.digest，供后续渲染使用
    post.digest = `${matchContent}......`;
    return true; // 匹配成功，返回true
  }

  /**
   * 构建单个文章/页面结果项的HTML
   * 包含：头图、标题（高亮关键词）、日期、分类、标签、摘要
   * @param {Object} item - 单个文章/页面对象
   * @param {string} type - 结果类型（post：文章，page：页面）
   * @returns {string} 单个结果项的HTML字符串
   */
  buildResult(item, type) {
    // 处理结果链接：取URL的pathname部分（去除查询参数）
    const resultUrl = new URL(item.permalink).pathname.split("?")[0];
    // 格式化日期：优先用更新时间，无则用创建时间，转为YYYY-MM-DD格式
    const date = new Date(item.updated || item.date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // 构建标签HTML（若有标签）
    let tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      tagsHtml = `<div class="tags">
        ${item.tags.map(tag =>
        `<a href="${tag.permalink}" class="tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke="currentColor">
            <line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
          ${this.highlightMatch(tag.name)}
        </a>` // 标签名高亮关键词
      ).join('')}
      </div>`;
    }

    // 构建分类HTML（若有分类）
    let categoryHtml = '';
    if (item.categories && item.categories.length > 0) {
      categoryHtml = `<div class="category">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        ${item.categories.map(cat => `<a href="${cat.permalink}">${cat.name}</a>`).join('')}
      </div>`;
    }

    // 构建头图HTML（若有头图，仅文章可能有）
    let headimgHtml = '';
    if (item.headimg) {
      headimgHtml = `<div class="result-image">
        <picture>
          <img src="${item.headimg}" alt="${item.title}">
        </picture>
      </div>`;
    }

    // 拼接单个结果项HTML（包含类型标识、链接、头图、内容区）
    return `
      <li class="result-item ${type}-result">
        <a class="result-link" href="${resultUrl}?keyword=${encodeURIComponent(this.queryText)}">
          ${headimgHtml}
          <div class="result-content">
            <h3 class="title">${this.highlightMatch(item.title)}</h3>
            <div class="meta">
              <span class="date">${formattedDate}</span>
              ${categoryHtml}
            </div>
            ${tagsHtml}
            ${item.digest ? `<p class="digest">${item.digest}</p>` : ''}
          </div>
        </a>
      </li>
    `;
  }

  /**
   * 高亮文本中匹配的关键词
   * 用mark标签包裹关键词，支持多个关键词（不区分大小写）
   * @param {string} text - 待处理的文本（标题/标签名等）
   * @returns {string} 关键词高亮后的HTML文本
   */
  highlightMatch(text) {
    // 关键词为空时，返回原文本
    if (!this.queryText) return text;

    // 拆分关键词为数组（支持空格/连字符分隔）
    const keywords = this.queryText.toLowerCase().split(/[-\s]+/);
    // 无关键词时，返回原文本
    if (!keywords.length) return text;

    // 创建正则表达式（全局匹配、不区分大小写）
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    // 用mark标签包裹匹配的关键词，返回处理后的文本
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * 移除HTML标签和多余格式，返回纯文本
   * 用于生成摘要时清理HTML内容，避免标签干扰
   * @param {string} html - 带HTML标签的文本
   * @returns {string} 纯文本字符串
   */
  stripHTML(html) {
    return html
      .replace(/\n+/g, ' ') // 替换所有换行符为空格
      .replace(/<(img|figure)[^>]*>.*?<\/\1>/g, '') // 移除img和figure标签及其内容
      .replace(/<[^>]+>/g, '') // 移除所有剩余HTML标签
      .trim() // 去除前后空格
      .replace(/\s+/g, ' ') // 合并多个空格为单个空格
      .replace(/(\S)(https:\/\/)/g, '$1 $2'); // 在链接前加空格（避免链接与前面文本粘连）
  }

  /**
   * 添加搜索历史到历史列表
   * 去重（不区分大小写）、限制最大数量、存储到localStorage、更新显示
   * @param {string} query - 待添加的搜索关键词
   */
  addToSearchHistory(query) {
    // 去重：将新关键词放在最前，过滤掉相同关键词（不区分大小写），限制最大数量
    this.searchHistory = [
      query, // 新关键词放在首位（最新）
      ...this.searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase()) // 过滤相同关键词
    ].slice(0, this.maxHistoryCount); // 截取前maxHistoryCount个（限制数量）

    // 存储到localStorage（持久化，刷新页面不丢失）
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    // 更新搜索历史的DOM显示
    this.updateHistoryDisplay();
  }

  /**
   * 从localStorage加载搜索历史
   * 处理JSON解析错误，避免程序崩溃
   */
  loadSearchHistory() {
    // 从localStorage获取存储的历史记录（JSON字符串）
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        // 解析JSON字符串为数组，赋值给searchHistory
        this.searchHistory = JSON.parse(saved);
      } catch (e) {
        // 解析错误时（如数据格式异常），打印日志并重置历史数组
        console.error('Failed to parse search history from localStorage:', e);
        this.searchHistory = [];
      }
    }
  }

  /**
   * 更新搜索历史的DOM显示
   * 无历史时显示“暂无搜索历史”，有历史时生成列表项（带删除按钮）
   */
  updateHistoryDisplay() {
    const historyContainer = document.querySelector('.search-history');
    const historyList = document.querySelector('.history-list');
    // 若历史列表DOM不存在，直接返回
    if (!historyList) return;

    // 无搜索历史时，显示提示文本
    if (this.searchHistory.length === 0) {
      historyList.innerHTML = `<p class="no-history">${this.noSearchHistoryText}</p>`;
      historyContainer.classList.add('hidden'); // 隐藏历史区
      return;
    }

    // 有搜索历史：生成列表项HTML（每个项带删除按钮）
    historyList.innerHTML = this.searchHistory.map((item, index) =>
      `<li>${item}
        <button class="remove-history" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </li>`
    ).join('');

    // 绑定单个历史记录的删除事件
    document.querySelectorAll('.remove-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.closest('.remove-history').dataset.index);
        this.searchHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        this.updateHistoryDisplay();
      });
    });
  }

  /**
   * 清空所有搜索历史
   * 重置历史数组、删除localStorage中的记录、更新显示
   */
  clearSearchHistory() {
    this.searchHistory = []; // 重置历史数组
    localStorage.removeItem('searchHistory'); // 删除localStorage中的记录
    this.updateHistoryDisplay(); // 更新历史显示（显示“暂无搜索历史”）
  }

  /**
   * 防抖函数
   */
  debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args); // 透传this和参数
      }, delay);
    };
  }

  /**
   * 静态方法：设置搜索关键词
   * 初始化单例后，赋值查询关键词（供外部调用）
   * @param {string} queryText - 待设置的搜索关键词
   */
  static setQueryText(queryText) {
    SearchService.init(); // 确保单例已初始化
    SearchService.instance.queryText = queryText; // 赋值关键词
  }

  /**
   * 静态方法：执行搜索
   * 初始化单例后，调用实例的search方法（供外部调用）
   * @returns {Promise<void>} 搜索异步过程
   */
  static async search() {
    SearchService.init(); // 确保单例已初始化
    await SearchService.instance.search(); // 调用实例的搜索方法
  }
}

/**
 * 初始化加载
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SearchService());
} else {
  new SearchService();
}

volantis.pjax.push(() => new SearchService(), 'hexo-search');
volantis.pjax.send(() => {
  const searchEl = document.querySelector("#u-search");
  if (searchEl) searchEl.style.display = "none";
}, 'hexo-search');
