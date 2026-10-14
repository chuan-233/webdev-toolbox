/* ==========================================================================
   HTML 标签 词条
   --------------------------------------------------------------------------
   加词条：往下面的数组里加一个对象就行，界面上会自动出现。
   字段说明看 README「如何扩展词条库」。
   注意：本文件只放「标签」，HTML 属性放 html-attrs.js，不要混在一起。
   ========================================================================== */

window.WDT_HTML_TAGS = [

  {
    id: 'html-html', name: '<html>', zh: '文档根元素',
    purpose: '整个 HTML 文档的根元素，其他所有元素都必须放在它里面。每个页面只能有一个。',
    syntax: '<html lang="zh-CN"> … </html>',
    status: 'modern',
    keywords: ['根元素', '根标签', '文档', 'lang'],
    example: {
      html: '<!-- 结构示意：<html> 包住 head 和 body -->\n<p>页面真正显示出来的部分，都在 &lt;body&gt; 里。</p>',
      css: '',
      js: ''
    },
    errors: [
      '写了两个 <html>：一个页面只允许一个根元素',
      '忘了写 lang 属性：屏幕阅读器读不出该用哪种语言发音，搜索引擎也不容易判断语种'
    ],
    related: ['html-head', 'html-body', 'attr-lang']
  },

  {
    id: 'html-head', name: '<head>', zh: '文档头部',
    purpose: '放「给浏览器和搜索引擎看」的信息：字符编码、页面标题、样式表、脚本等。里面的内容不会直接显示在页面上。',
    syntax: '<head> … </head>',
    status: 'modern',
    keywords: ['头部', '元数据', 'meta', 'title', '信息'],
    example: {
      html: '<p>&lt;head&gt; 里的东西一个字都不会显示在页面上。</p>\n<p>页面顶部那个标签页文字，来自 &lt;title&gt;。</p>',
      css: '',
      js: ''
    },
    errors: [
      '把要显示的文字写进 <head> 里 —— 看不见，还会被浏览器纠正到 body',
      '把 <title> 写在 <head> 外面'
    ],
    related: ['html-html', 'html-body', 'html-title', 'html-meta']
  },

  {
    id: 'html-body', name: '<body>', zh: '文档主体',
    purpose: '页面所有「看得见」的内容都放在这里：文字、图片、按钮、表单……',
    syntax: '<body> 页面内容 </body>',
    status: 'modern',
    keywords: ['主体', '内容', '可见'],
    example: {
      html: '<h1>标题</h1>\n<p>段落文字。</p>\n<p>这些全都在 &lt;body&gt; 里。</p>',
      css: 'body { font-family: system-ui, sans-serif; padding: 16px; }',
      js: ''
    },
    errors: [
      '把 <body> 写成 <boby>：浏览器虽然会猜，但不要指望它'
    ],
    related: ['html-head', 'html-html']
  },

  {
    id: 'html-title', name: '<title>', zh: '页面标题',
    purpose: '页面标题。显示在浏览器标签页上，也是收藏夹默认名称和搜索结果里的蓝色标题。每个页面必须有，且要唯一。',
    syntax: '<title>页面标题</title>',
    status: 'modern',
    keywords: ['标题', '标签页', '收藏', 'SEO'],
    example: {
      html: '<p>看看浏览器标签页上的文字 —— 那就是 &lt;title&gt; 的内容。</p>\n<p>它不是 &lt;h1&gt;：&lt;h1&gt; 是页面里给读者看的大标题。</p>',
      css: '',
      js: "document.title = '标题被 JS 改过了';"
    },
    errors: [
      '把 <title> 当成页面大标题用 —— 应该用 <h1>',
      '所有页面用同一个 title，收藏夹里分不清'
    ],
    related: ['html-head', 'html-h1h6'],
    tip: '<b>title 和 h1 是两回事</b>：title 在浏览器外框上，h1 在页面内容里。一个页面可以有多个 h1，但只能有一个 title。'
  },

  {
    id: 'html-meta', name: '<meta>', zh: '元数据',
    purpose: '声明无法用其他标签表达的文档级信息：字符编码、移动端视口、页面描述等。空元素，没有结束标签。',
    syntax: '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">',
    status: 'modern',
    keywords: ['编码', 'charset', '视口', 'viewport', '描述', 'SEO'],
    example: {
      html: '<p>charset 和 viewport 这两行几乎是每个页面的标配。</p>\n<p>少了 viewport，手机上页面会整页缩小成"缩略图"。</p>',
      css: '.note { color: #666; }',
      js: ''
    },
    errors: [
      '忘了写 <meta charset="utf-8">：中文变成乱码（锟斤拷）',
      'charset 写在第 1024 字节之后：浏览器可能来不及识别，规范要求它在最前面'
    ],
    related: ['html-head', 'attr-charset', 'html-link'],
    tip: '<b>空元素</b>指没有内容、也没有结束标签的元素。类似的还有 &lt;img&gt;、&lt;br&gt;、&lt;input&gt;、&lt;link&gt;。'
  },

  {
    id: 'html-link', name: '<link>', zh: '外部资源链接',
    purpose: '把外部文件接进当前页面，最常用是引入 CSS 样式表、网站图标。空元素。',
    syntax: '<link rel="stylesheet" href="style.css">',
    status: 'modern',
    keywords: ['样式表', 'css', '图标', 'favicon', 'rel'],
    example: {
      html: '<p>本页的样式就是用 &lt;link&gt; 接进来的。</p>\n<p>注意它和 &lt;a&gt; 完全不同：&lt;a&gt; 给人点，&lt;link&gt; 给浏览器用。</p>',
      css: '.demo { padding: 8px; background: #eef2ff; border-radius: 6px; }',
      js: ''
    },
    errors: [
      'rel 写错或漏写：浏览器不知道这是什么资源，直接忽略',
      '想引入自己写的 CSS 文件，却用了 <script>'
    ],
    related: ['html-script', 'attr-rel', 'attr-href']
  },

  {
    id: 'html-script', name: '<script>', zh: '脚本',
    purpose: '在页面里放 JavaScript：可以内嵌写在标签中间，也可以用 src 引入外部文件。',
    syntax: '<script src="app.js"></script>\n<script> console.log(1); </script>',
    status: 'modern',
    keywords: ['脚本', 'js', 'javascript', '引入'],
    example: {
      html: '<button id="b">点我</button>',
      css: 'button { padding: 8px 16px; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  console.log('被点了');\n});"
    },
    errors: [
      '用 src 引入外部文件时，标签中间又写了代码 —— 中间的代码会被直接忽略',
      '把 <script> 写在 <head> 里，然后立刻去拿 body 里的元素：那时元素还不存在，得到 null'
    ],
    related: ['attr-src', 'attr-defer', 'js-addeventlistener'],
    tip: '<b>html 里的 script 标签</b>是「怎么把 JS 接进页面」；<b>js-methods 里的方法</b>是「JS 本身能干什么」。两回事。'
  },

  {
    id: 'html-h1h6', name: '<h1> – <h6>', zh: '标题层级',
    purpose: '表示内容大纲的层级。h1 是最高级（通常整页只一个），h6 是最低级。按层级使用，不要跳级。',
    syntax: '<h1>一级标题</h1>\n<h2>二级标题</h2>',
    status: 'modern',
    keywords: ['标题', 'h1', '层级', '大纲', '结构'],
    example: {
      html: '<h1>文章标题</h1>\n<h2>第一节</h2>\n<p>正文……</p>\n<h2>第二节</h2>\n<h3>2.1 小节</h3>\n<p>正文……</p>',
      css: 'h1 { font-size: 24px; margin: 0 0 10px; }\nh2 { font-size: 18px; margin: 18px 0 6px; }\nh3 { font-size: 15px; color: #555; margin: 12px 0 4px; }',
      js: ''
    },
    errors: [
      '为了「字大」而用 h1 包所有文字 —— 字号该由 CSS 负责，标题负责的是结构',
      '跳过层级，h1 后面直接 h4：屏幕阅读器会以为漏了内容'
    ],
    related: ['html-p', 'html-section', 'css-font-size'],
    tip: '<b>内容负责结构，CSS 负责外观。</b>想让一段普通文字变大，用 CSS；想表达「这是本节的标题」，才用 h2。'
  },

  {
    id: 'html-p', name: '<p>', zh: '段落',
    purpose: '表示一个段落。浏览器会自动在段落之间加空白，这是排版而不是样式。',
    syntax: '<p>一段文字</p>',
    status: 'modern',
    keywords: ['段落', '文本', '文字'],
    example: {
      html: '<p>第一个段落。</p>\n<p>第二个段落 —— 中间的空隙是浏览器自动加的。</p>',
      css: 'p { line-height: 1.8; }',
      js: ''
    },
    errors: [
      '把 <p> 嵌套在另一个 <p> 里：浏览器会自动帮你闭合外层，结构就乱了',
      '在 <p> 里放块级元素（如 <div>、<p>）'
    ],
    related: ['html-br', 'html-div', 'html-h1h6']
  },

  {
    id: 'html-a', name: '<a>', zh: '超链接',
    purpose: '创建链接：可以跳到别的页面、跳到当前页的某个位置（锚点）、下载文件、发起邮件或电话。',
    syntax: '<a href="目标地址">可点击的文字</a>',
    status: 'modern',
    keywords: ['链接', '跳转', 'href', '锚点', '超链接', '下载'],
    example: {
      html: '<p>去 <a href="https://developer.mozilla.org/zh-CN/">MDN</a> 查文档</p>\n<p><a href="#bottom">跳到本页底部</a></p>\n<p style="margin-top: 120px" id="bottom">这里就是底部。</p>',
      css: 'a { color: #2f6fdd; }\na:hover { text-decoration: none; }',
      js: ''
    },
    errors: [
      '把 href 拼成 herf / hraf —— 属性名拼错不报错，只是「点了没反应」',
      '用 <a> 当按钮却忘了 href：没有 href 的 <a> 键盘不可聚焦、不能回车触发，该用 <button>',
      '外链用 target="_blank" 时忘了 rel="noopener"'
    ],
    related: ['attr-href', 'attr-target', 'html-button'],
    tip: '<b>&lt;a&gt; 是标签，href 是属性，中间的文字是内容。</b>初学者最容易把这三个说成一个东西。'
  },

  {
    id: 'html-img', name: '<img>', zh: '图片',
    purpose: '嵌入图片。空元素，靠 src 指定图片来源，alt 提供文字替代。',
    syntax: '<img src="图片地址" alt="图片说明">',
    status: 'modern',
    keywords: ['图片', '图像', 'alt', 'src', '插图'],
    example: {
      html: '<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2790%27 height=%2790%27%3E%3Crect width=%2790%27 height=%2790%27 rx=%2712%27 fill=%27%237aa2f7%27/%3E%3Ccircle cx=%2745%27 cy=%2745%27 r=%2724%27 fill=%27white%27/%3E%3C/svg%3E"\n     alt="蓝色方块图标" width="90" height="90">\n<p>上面这张图其实是几行代码画出来的，所以断网也能显示。</p>',
      css: 'img { border-radius: 8px; }',
      js: ''
    },
    errors: [
      '忘了 alt：图片加载失败时用户只看到一个空白破图，读屏软件也无从朗读',
      '只改 width 不写 height：图片没加载完时页面会跳动',
      '给 <img> 加结束标签 </img>：它是空元素，没有结束标签'
    ],
    related: ['attr-alt', 'attr-src', 'css-width', 'html-meta'],
    tip: '示例里的 src 是一段 <b>data: URI</b> —— 它把图片内容直接写进了代码，所以不联网也能显示。平时我们写的是文件路径或网址。'
  },

  {
    id: 'html-br', name: '<br>', zh: '换行',
    purpose: '在文字中间强制换行。只用于「换行本身就是内容」的场合，比如诗歌、地址、歌词。空元素。',
    syntax: '第一行<br>第二行',
    status: 'modern',
    keywords: ['换行', '折行'],
    example: {
      html: '<p>床前明月光，<br>疑是地上霜。</p>\n<p>地址：重庆市渝中区<br>XX 路 1 号</p>',
      css: 'p { line-height: 2; }',
      js: ''
    },
    errors: [
      '用一堆 <br> 来「撑开间距」—— 间距是 CSS 的 margin 该干的事',
      '用 <br> 来分段 —— 分段要用 <p>'
    ],
    related: ['html-p', 'css-margin'],
    tip: '<b>判断标准</b>：换行删掉后文字意思变了吗？变了（诗歌）就用 &lt;br&gt;，没变（只是想要间距）就用 CSS。'
  },

  {
    id: 'html-strong', name: '<strong>', zh: '重要强调',
    purpose: '表示内容是「重要的」。浏览器默认显示为粗体，但它的本职是语义，不是加粗。',
    syntax: '<strong>重要内容</strong>',
    status: 'modern',
    keywords: ['加粗', '重要', '强调', 'bold'],
    example: {
      html: '<p><strong>警告：</strong>本操作不可撤销。</p>\n<p>想单纯变粗？那也是用这个标签，但要知道你同时表达了"重要"。</p>',
      css: 'strong { color: #c03a52; }',
      js: ''
    },
    errors: [
      '为了「字粗一点」而满页用 <strong>：其实想要的是 CSS 的 font-weight',
      '用 <b> 和 <strong> 混着用 —— 前者只是视觉加粗，后者是语义重要'
    ],
    related: ['html-em', 'css-font-weight']
  },

  {
    id: 'html-em', name: '<em>', zh: '着重强调',
    purpose: '表示语气上的着重，默认显示为斜体。读屏软件会改变语调来体现它。',
    syntax: '<em>着重的词</em>',
    status: 'modern',
    keywords: ['斜体', '强调', 'italic', '着重'],
    example: {
      html: '<p>我<em>没有</em>说过这句话。</p>\n<p>斜起来的是 &lt;em&gt;，粗起来的是 &lt;strong&gt;。</p>',
      css: 'em { color: #1a6f8f; font-style: normal; font-weight: 700; }',
      js: ''
    },
    errors: [
      '想显示斜体却用 <i>：<i> 只是视觉斜体，不表示强调',
      '中文排版里斜体不好看，常用「加粗」或「变色」代替 —— 但语义标签可以照用，外观交给 CSS'
    ],
    related: ['html-strong', 'css-font-weight']
  },

  {
    id: 'html-code', name: '<code>', zh: '行内代码',
    purpose: '表示一小段代码。默认用等宽字体显示。多行代码要配合 <pre>。',
    syntax: '<code>console.log(1)</code>',
    status: 'modern',
    keywords: ['代码', '等宽', '行内代码'],
    example: {
      html: '<p>用 <code>console.log()</code> 打印调试信息。</p>\n<pre><code>for (let i = 0; i &lt; 3; i++) {\n  console.log(i);\n}</code></pre>',
      css: 'code { background: #eef1f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }\npre code { display: block; padding: 12px; line-height: 1.6; overflow-x: auto; }',
      js: ''
    },
    errors: [
      '在 HTML 里直接写 < > 当代码内容：必须写成 &amp;lt; &amp;gt;，否则浏览器会当成标签解析',
      '多行代码只用 <code> 不用 <pre>：所有换行和空格会被浏览器压成一行'
    ],
    related: ['html-pre', 'html-p'],
    tip: 'HTML 里 <b>&amp;lt;</b> 表示一个「小于号」字符本身。要显示标签文字又不想被当成标签，就得这样转义。'
  },

  {
    id: 'html-pre', name: '<pre>', zh: '预格式化文本',
    purpose: '保留原文里的空格和换行。适合放代码块、ASCII 图、终端输出。',
    syntax: '<pre> 原样  保留   空 格 </pre>',
    status: 'modern',
    keywords: ['预格式化', '代码块', '保留空格', '换行'],
    example: {
      html: '<pre>\n  对齐  测试\n  第一列   第二列\n  内容     内容\n</pre>',
      css: 'pre { background: #f5f7fa; padding: 12px; border-radius: 8px; font-size: 13px; overflow-x: auto; }',
      js: ''
    },
    errors: [
      '在 <pre> 里写 HTML 标签文字却不转义',
      '用 <pre> 排版整个页面布局 —— 那是 CSS 该做的'
    ],
    related: ['html-code']
  },

  {
    id: 'html-ul', name: '<ul>', zh: '无序列表',
    purpose: '一组顺序不重要的项目，默认显示为圆点列表。子项必须是 <li>。',
    syntax: '<ul>\n  <li>项目</li>\n</ul>',
    status: 'modern',
    keywords: ['列表', '无序', '圆点', 'ul'],
    example: {
      html: '<p>准备材料：</p>\n<ul>\n  <li>鸡蛋</li>\n  <li>面粉</li>\n  <li>牛奶</li>\n</ul>',
      css: 'ul { padding-left: 22px; list-style: disc; }',
      js: ''
    },
    errors: [
      '把 <ul> 的直接子元素写成 <div> 或 <p>：内容应该是 <li>',
      '为了去掉小圆点而删掉 <ul> 换成 <div>：用 CSS 的 list-style 控制就行'
    ],
    related: ['html-ol', 'html-li', 'css-margin']
  },

  {
    id: 'html-ol', name: '<ol>', zh: '有序列表',
    purpose: '一组有先后顺序的项目，默认显示为 1. 2. 3.，顺序本身就是信息。',
    syntax: '<ol>\n  <li>第一步</li>\n</ol>',
    status: 'modern',
    keywords: ['列表', '有序', '编号', '步骤', 'ol'],
    example: {
      html: '<p>开机步骤：</p>\n<ol>\n  <li>插电源</li>\n  <li>按开机键</li>\n  <li>等系统启动</li>\n</ol>',
      css: 'ol { padding-left: 22px; }',
      js: ''
    },
    errors: [
      '步骤用 <ul> 写 —— 顺序重要就该用 <ol>，读屏软件会读出"第几步"'
    ],
    related: ['html-ul', 'html-li']
  },

  {
    id: 'html-li', name: '<li>', zh: '列表项',
    purpose: '列表里的一项，只能作为 <ul>、<ol>、<menu> 的直接子元素。',
    syntax: '<li>一项内容</li>',
    status: 'modern',
    keywords: ['列表项', '条目', 'li'],
    example: {
      html: '<ul>\n  <li>第一项</li>\n  <li>第二项</li>\n</ul>',
      css: 'li { margin-bottom: 6px; }',
      js: ''
    },
    errors: [
      '把 <li> 直接放在 <div> 里 —— 它必须是列表的子元素',
      '在想嵌套时把子列表放到 <li> 外面：子列表应写在某个 <li> 内部'
    ],
    related: ['html-ul', 'html-ol']
  },

  {
    id: 'html-div', name: '<div>', zh: '块级容器',
    purpose: '通用的块级容器，自己没有任何语义，纯粹用来「把东西装在一起」，方便用 CSS 排版或 JS 操作。',
    syntax: '<div class="卡片"> … </div>',
    status: 'modern',
    keywords: ['容器', '盒子', 'div', '块级', '布局'],
    example: {
      html: '<div class="card">\n  <h3>卡片标题</h3>\n  <p>卡片里的说明文字。</p>\n</div>',
      css: '.card { border: 1px solid #ddd; border-radius: 10px; padding: 16px; max-width: 280px; }',
      js: ''
    },
    errors: [
      '整页都用 <div>：有更合适的语义标签时应该用 <header> / <nav> / <section> / <footer>',
      '拿 <div> 装文字就以为能当段落用 —— 该用 <p>'
    ],
    related: ['html-span', 'html-section', 'css-display'],
    tip: '<b>div 没有语义</b>。当你想表达"这里是头部/导航/正文段落"时，用对应的语义标签，对读屏软件和搜索引擎都更友好。'
  },

  {
    id: 'html-span', name: '<span>', zh: '行内容器',
    purpose: '通用的行内容器，没有语义。用来给一小段文字单独上样式或挂 JS 行为。',
    syntax: '<span class="高亮">几个字</span>',
    status: 'modern',
    keywords: ['容器', '行内', 'span', '文字'],
    example: {
      html: '<p>价格：<span class="price">¥ 128</span>（含税）</p>',
      css: '.price { color: #c03a52; font-weight: 700; }',
      js: ''
    },
    errors: [
      '在 <span> 里放块级元素（<div>、<p>）：行内元素不能包块级元素',
      '用 <span> 包一大段文字并设宽高 —— 行内元素不吃 width/height，得改成 display: inline-block'
    ],
    related: ['html-div', 'css-display'],
    tip: '<b>div 和 span 的区别</b>：div 是块级（独占一行），span 是行内（跟着文字走）。两者都没有语义。'
  },

  {
    id: 'html-button', name: '<button>', zh: '按钮',
    purpose: '可点击的按钮。默认就带键盘支持（Tab 聚焦、回车/空格触发），比用 <div> 模拟要好得多。',
    syntax: '<button type="button">点我</button>',
    status: 'modern',
    keywords: ['按钮', '点击', '提交', 'button'],
    example: {
      html: '<button id="b1" type="button">点我</button>\n<p id="out">还没点</p>',
      css: 'button { padding: 8px 18px; border: 0; border-radius: 8px; background: #2f6fdd; color: #fff; }',
      js: "let n = 0;\ndocument.getElementById('b1').addEventListener('click', function () {\n  n++;\n  document.getElementById('out').textContent = '被点了 ' + n + ' 次';\n});"
    },
    errors: [
      '把按钮写成 <div onclick="...">：键盘用户按不到，读屏软件也读不出这是按钮',
      '在 <form> 里的按钮忘了写 type：默认是 type="submit"，会意外提交表单'
    ],
    related: ['html-input', 'html-form', 'js-addeventlistener'],
    tip: '用 &lt;button&gt; 不用 div 做按钮，白送键盘可访问性 —— 这是「不用写一行额外代码就能做对」的例子。'
  },

  {
    id: 'html-input', name: '<input>', zh: '输入控件',
    purpose: '表单里最万能的输入控件。靠 type 决定长相和行为：text、password、checkbox、radio、date、file、color……空元素。',
    syntax: '<input type="text" name="用户名">',
    status: 'modern',
    keywords: ['输入', '输入框', '表单', 'type', '复选框', '单选框'],
    example: {
      html: '<p>文字：<input type="text" placeholder="请输入昵称"></p>\n<p>密码：<input type="password" value="123456"></p>\n<p>同意条款：<input type="checkbox" id="ok"> <label for="ok">我已阅读</label></p>\n<p>颜色：<input type="color" value="#7aa2f7"></p>',
      css: 'input { padding: 6px 10px; border: 1px solid #ccd2dc; border-radius: 6px; font: inherit; }',
      js: ''
    },
    errors: [
      '给 <input> 加结束标签 </input>：它是空元素',
      'checkbox 和 radio 忘了配 <label>：点击区域太小，用户体验很差',
      'value 和 placeholder 用混：placeholder 是灰字提示，value 是真正的值'
    ],
    related: ['attr-type', 'attr-placeholder', 'attr-value', 'html-label', 'html-form']
  },

  {
    id: 'html-label', name: '<label>', zh: '表单标签',
    purpose: '给表单控件起个说明文字，并用 for 绑定到控件。绑定后点文字等于点控件，对鼠标和读屏都友好。',
    syntax: '<label for="id名">说明</label>\n<input id="id名">',
    status: 'modern',
    keywords: ['表单标签', 'label', 'for', '说明'],
    example: {
      html: '<p><label for="name">昵称：</label>\n   <input id="name" type="text"></p>\n<p>点上面那两个字"昵称"，光标会自己跳到输入框里。</p>',
      css: 'label { font-weight: 600; }',
      js: ''
    },
    errors: [
      'for 的值和 input 的 id 不一致：绑不上，点了没反应',
      'for 里写 name 值：for 对应的是 id，不是 name',
      '把 input 包在 label 里同时又写了 for：重复绑定，虽然能用但别绕'
    ],
    related: ['html-input', 'attr-for', 'attr-id'],
    tip: '<b>id 和 name 不一样</b>：id 是这一份文档里的唯一编号（给 label、JS、锚点用）；name 是提交表单时那个字段的名字（给服务器看）。'
  },

  {
    id: 'html-form', name: '<form>', zh: '表单',
    purpose: '把一组控件打包起来，负责「提交」这件事：按 action 送到哪、按 method 怎么送。',
    syntax: '<form action="/submit" method="post"> … </form>',
    status: 'modern',
    keywords: ['表单', '提交', 'form', 'action', 'method'],
    example: {
      html: '<form id="f">\n  <p><label for="u">用户名：</label><input id="u" name="user" type="text"></p>\n  <p><button type="submit">提交</button></p>\n</form>\n<p id="msg"></p>',
      css: 'form { display: grid; gap: 8px; max-width: 280px; }',
      js: "document.getElementById('f').addEventListener('submit', function (e) {\n  e.preventDefault();            // 阻止真的跳转，只是演示\n  document.getElementById('msg').textContent = '提交事件被拦下来了';\n});"
    },
    errors: [
      '控件没写 name：提交时该字段根本不会被发送',
      '忘了 e.preventDefault()，一提交页面就刷新，JS 里存的状态全没了',
      '用 method="get" 传密码：内容明晃晃挂在网址上'
    ],
    related: ['attr-action', 'attr-method', 'html-input', 'html-button', 'js-addeventlistener']
  },

  {
    id: 'html-section', name: '<section>', zh: '语义分区',
    purpose: '表示文档中一个独立的主题区块，通常自带一个标题。比 <div> 更有语义。',
    syntax: '<section>\n  <h2>小节标题</h2>\n  …\n</section>',
    status: 'modern',
    keywords: ['语义', '分区', '章节', 'section'],
    example: {
      html: '<section>\n  <h2>关于我们</h2>\n  <p>这家店开了十年。</p>\n</section>\n<section>\n  <h2>联系方式</h2>\n  <p>邮箱：hi@example.com</p>\n</section>',
      css: 'section { border-top: 2px solid #e5e8ee; padding-top: 12px; margin-bottom: 18px; }',
      js: ''
    },
    errors: [
      '用 <section> 纯粹当样式容器 —— 用 <div> 更合适',
      '里面没有标题：<section> 这个标签暗示"这里有一个主题"，最好配 <h2>/<h3>'
    ],
    related: ['html-div', 'html-h1h6']
  },

  {
    id: 'html-table', name: '<table>', zh: '表格',
    purpose: '展示「行列关系」的数据，比如成绩单、价格表。用 tr 表示行、th 表示表头格、td 表示数据格。',
    syntax: '<table>\n  <tr><th>表头</th></tr>\n  <tr><td>数据</td></tr>\n</table>',
    status: 'modern',
    keywords: ['表格', '行列', '数据', 'tr', 'td', 'th'],
    example: {
      html: '<table>\n  <thead>\n    <tr><th>城市</th><th>温度</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>重庆</td><td>22℃</td></tr>\n    <tr><td>昆明</td><td>18℃</td></tr>\n  </tbody>\n</table>',
      css: 'table { border-collapse: collapse; }\nth, td { border: 1px solid #ccd2dc; padding: 6px 14px; text-align: left; }\nth { background: #f1f3f7; }',
      js: ''
    },
    errors: [
      '用 <table> 排版整个页面：这是上世纪的做法，现在用 flex / grid',
      '把 <td> 直接放在 <table> 下：必须先有 <tr>',
      '忘了 <th>：数据表用 <td> 当表头，读屏软件无法区分表头和内容'
    ],
    related: ['css-display', 'html-section'],
    tip: '<b>表格只有一种正确用途：数据本身是二维的。</b>如果只是想「左右分栏」，用 CSS 布局。'
  },

  {
    id: 'html-center', name: '<center>', zh: '居中（已废弃）',
    purpose: '把内容居中。在 HTML4 时代很常用，如今已被标准废弃。',
    syntax: '<center>内容</center>   ← 不要再用了',
    status: 'deprecated',
    keywords: ['居中', '过时', '废弃', 'align'],
    example: {
      html: '<p class="wrong">❌ 旧写法：&lt;center&gt;文字&lt;/center&gt;</p>\n<p class="right">✅ 现在：给元素加 CSS 的 text-align: center</p>',
      css: '.wrong { text-decoration: line-through; color: #c03a52; }\n.right { text-align: center; background: #e9f7ec; padding: 8px; border-radius: 6px; }',
      js: ''
    },
    errors: [
      '<center> 仍在所有浏览器里能用，所以「看起来没问题」—— 但它不保证长期有效，也不受 CSS 控制',
      '同类废弃写法还有 <font>、<big>、<strike>、bgcolor 属性、align 属性'
    ],
    related: ['html-font', 'css-text-align'],
    tip: '<b>为什么废弃</b>：这些标签把「长什么样」写死在 HTML 里。现在统一由 CSS 掌管外观，HTML 只负责结构，改版时不用动内容。'
  },

  {
    id: 'html-font', name: '<font>', zh: '字体（已废弃）',
    purpose: '直接指定文字的颜色、字号、字体。HTML4 时代的做法，现已废弃。',
    syntax: '<font color="red" size="5">文字</font>   ← 不要再用了',
    status: 'deprecated',
    keywords: ['字体', '颜色', '字号', '过时', '废弃'],
    example: {
      html: '<p class="wrong">❌ 旧写法：&lt;font color="red" size="5"&gt;红字&lt;/font&gt;</p>\n<p class="right">✅ 现在：<span class="red">用 CSS 的 color 和 font-size</span></p>',
      css: '.wrong { text-decoration: line-through; color: #c03a52; }\n.red { color: #d64545; font-size: 20px; font-weight: 600; }',
      js: ''
    },
    errors: [
      '看到网上老教程里的 <font> 就直接抄 —— 那可能是十几年前的文章',
      '想改颜色却去改 HTML：颜色归 CSS 的 color 管'
    ],
    related: ['html-center', 'css-color', 'css-font-size'],
    tip: '<b>判断一条教程是否过时</b>：如果它用 &lt;font&gt;、&lt;center&gt;、&lt;table&gt; 排版页面，或者到处写 align=，基本可以直接关掉。'
  }

];
