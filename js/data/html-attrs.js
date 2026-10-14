/* ==========================================================================
   HTML 属性 词条
   --------------------------------------------------------------------------
   注意：这里只放「写在 HTML 标签里的属性」，比如 <a href="..."> 的 href。
   不要和 CSS 属性（css-props.js）混在一起，也不要和 JS 对象的属性混在一起。
   ========================================================================== */

window.WDT_HTML_ATTRS = [

  {
    id: 'attr-class', name: 'class', zh: '类名',
    purpose: '给元素贴「标签」，用来分类。一个元素可以有多个 class（空格分隔），CSS 和 JS 都靠它来批量选中一组元素。',
    syntax: '<div class="卡片 卡片-大"> … </div>',
    status: 'modern',
    keywords: ['类名', '样式钩子', '分组', '选择器'],
    example: {
      html: '<p class="tag red">红色标签</p>\n<p class="tag blue">蓝色标签</p>\n<p class="tag red big">又红又大</p>',
      css: '.tag { padding: 4px 12px; border-radius: 999px; display: inline-block; font-size: 13px; }\n.red  { background: #ffe2e2; color: #c03a52; }\n.blue { background: #e2ecff; color: #2f6fdd; }\n.big  { font-size: 18px; }',
      js: ''
    },
    errors: [
      'class 名字用空格写成一整个词（class="red big" 是两个名字，不是"red big"这一个名字）',
      '同一个页面里给不同东西起一样但含义不同的 class —— 一个月后自己看不懂',
      '把 class 当成 id 用：class 可以重复，id 必须唯一'
    ],
    related: ['attr-id', 'concept-selector', 'concept-html-attr-vs-css'],
    tip: '<b>class 是 HTML 属性，.类名 是 CSS 选择器。</b>写 HTML 时叫 class，写 CSS 时要加点号，写 JS 时用 classList。三个场景三种写法，别混。'
  },

  {
    id: 'attr-id', name: 'id', zh: '唯一标识',
    purpose: '给元素一个「身份证号」，同一份文档里必须唯一。用于页面内锚点跳转、label 绑定表单控件、JS 精确取元素。',
    syntax: '<div id="标题区"> … </div>',
    status: 'modern',
    keywords: ['id', '唯一', '标识', '锚点'],
    example: {
      html: '<p><a href="#target">跳到下面的方块</a></p>\n<p style="height:200px"></p>\n<div id="target" class="box">我就是目标方块</div>',
      css: '.box { padding: 16px; background: #eef2ff; border-left: 4px solid #2f6fdd; border-radius: 6px; }',
      js: "const el = document.getElementById('target');\nconsole.log('取到了：', el.textContent);"
    },
    errors: [
      '同一个页面出现两个相同 id：CSS 也许还能生效，但 JS 只会拿到第一个，锚点跳转行为也会变得不可预期',
      '用 id 来写样式（#target { … }）：优先级太高，后期改样式到处都要 !important',
      'id 里出现空格：HTML5 允许 id 里放除空格外几乎任何字符，但空格的写法问题极多，别用'
    ],
    related: ['attr-class', 'concept-selector', 'js-getelementbyid', 'html-label'],
    tip: '<b>什么时候用 id，什么时候用 class</b>：这个元素全页只有它一个、而且 JS 要精确抓它 → id；样式、分组、可能会重复 → class。'
  },

  {
    id: 'attr-href', name: 'href', zh: '超链接目标',
    purpose: '指定 <a> 链接到哪儿、<link> 引入哪个文件。是 hypertext reference 的缩写。',
    syntax: '<a href="https://example.com">文字</a>\n<a href="#锚点">文字</a>\n<a href="mailto:a@b.com">发邮件</a>',
    status: 'modern',
    keywords: ['链接', '地址', '目标', '锚点', '邮件', '电话'],
    example: {
      html: '<ul>\n  <li><a href="https://developer.mozilla.org/zh-CN/">外部网页</a></li>\n  <li><a href="#sec">本页锚点</a></li>\n  <li><a href="mailto:hi@example.com">发邮件</a></li>\n  <li><a href="tel:+8613800000000">打电话</a></li>\n</ul>\n<h3 id="sec">锚点位置</h3>',
      css: 'a { color: #2f6fdd; }',
      js: ''
    },
    errors: [
      '拼成 herf / hraf —— 属性名拼错浏览器只是忽略，不会报错，表现为「点了没反应」',
      'href="#" 用来当按钮：会让页面回到顶部，还会污染浏览器历史',
      'href="javascript:void(0)" —— 老教程里的写法，现代做法是用 <button>'
    ],
    related: ['html-a', 'attr-target', 'attr-rel']
  },

  {
    id: 'attr-src', name: 'src', zh: '资源地址',
    purpose: '告诉浏览器去哪里加载资源，用在 <img>、<script>、<iframe>、<video> 等元素上。source 的缩写。',
    syntax: '<img src="图片地址" alt="说明">\n<script src="app.js"></script>',
    status: 'modern',
    keywords: ['资源', '地址', '图片', '脚本', '加载'],
    example: {
      html: '<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%2760%27%3E%3Crect width=%27120%27 height=%2760%27 rx=%278%27 fill=%27%234fd1c5%27/%3E%3C/svg%3E"\n     alt="青色矩形" width="120" height="60">',
      css: 'img { border-radius: 8px; }',
      js: ''
    },
    errors: [
      '和 href 用混：<img href="..."> 不生效，<a src="..."> 也不生效。记法：src = source（内容来源），href = hypertext reference（超文本引用）',
      '路径写错一个字母：图片就变破图，且不报错',
      '在 <a> 上用 src、在 <img> 上用 href —— 这是初学者最高频的错之一'
    ],
    related: ['html-img', 'attr-href', 'html-script'],
    tip: '<b>怎么记</b>：src 是「这个元素本身的内容从哪来」（图片的图、脚本的代码）；href 是「这个元素指向别的什么地方」（链接的目标）。'
  },

  {
    id: 'attr-alt', name: 'alt', zh: '替代文本',
    purpose: '图片加载失败时显示的文字，也是读屏软件朗读的内容。它同时服务三种人：网速差的、用读屏的、搜索引擎。',
    syntax: '<img src="cat.jpg" alt="一只橘猫趴在窗台上">',
    status: 'modern',
    keywords: ['替代文本', '无障碍', '图片说明', '读屏'],
    example: {
      html: '<p>下面这张图的 src 是错的，看看 alt 显示了什么：</p>\n<img src="不存在的图.png" alt="这里应该是一只猫" width="160" height="60">\n<p>故意把它删掉再刷新，你就只看到一个空破图了。</p>',
      css: 'img { border: 1px solid #ddd; }',
      js: ''
    },
    errors: [
      '忘了写 alt：读屏软件可能直接念出整个文件名',
      '纯装饰图片写了无意义的 alt（alt="图片"）—— 这种应该写 alt=""，明确告诉读屏"忽略它"',
      '把一堆关键词塞进 alt 想骗 SEO：会被判作弊，也破坏了可访问性'
    ],
    related: ['html-img', 'attr-src'],
    tip: '<b>alt 的写法</b>：写「这张图在讲什么」，而不是「这是一张图」。如果这张图纯粹是装饰（背景花纹），写 <b>alt=""</b>（空字符串）才是正确做法。'
  },

  {
    id: 'attr-title', name: 'title（全局属性）', zh: '补充说明',
    purpose: '鼠标悬停时弹出的提示文字。注意：它是 HTML 的全局属性，和 <title> 标签、CSS 的 title 都不是一回事。',
    syntax: '<button title="点击后会上传文件">上传</button>',
    status: 'legacy',
    keywords: ['提示', '悬停', 'tooltip', '说明'],
    example: {
      html: '<p>把鼠标停在下面的按钮上：</p>\n<button title="我是悬停提示文字">悬停看看</button>\n<p>手机上没有"悬停"，所以别把重要信息放这里。</p>',
      css: 'button { padding: 8px 16px; }',
      js: ''
    },
    errors: [
      '把关键信息放进 title：手机、触屏、键盘用户都看不到',
      '和 <title> 标签混淆 —— 标签管页面标题，属性管悬停提示'
    ],
    related: ['html-title', 'attr-alt'],
    tip: '<b>同一时刻，一个词在不同圈子里的意思可能完全不同</b>：HTML 属性 title、HTML 标签 &lt;title&gt;、CSS 属性里的文本、JS 里的对象属性 —— 这也是本项目把四大类严格分家的原因。'
  },

  {
    id: 'attr-target', name: 'target', zh: '打开方式',
    purpose: '规定链接在哪里打开：_self 当前页、_blank 新标签页。只对 <a>、<form> 等少数元素有效。',
    syntax: '<a href="网址" target="_blank" rel="noopener">新标签页打开</a>',
    status: 'modern',
    keywords: ['新标签页', 'blank', '打开方式', '窗口'],
    example: {
      html: '<p><a href="https://developer.mozilla.org/zh-CN/" target="_blank" rel="noopener">在新标签页打开 MDN</a></p>\n<p>默认（不写 target）是当前页打开。</p>',
      css: 'a { color: #2f6fdd; }',
      js: ''
    },
    errors: [
      '所有链接都开新标签页：用户满屏都是标签，想回退都难。只在"跳到站外、看资料不会被我们打断"时才用',
      '用 target="_blank" 却不写 rel="noopener"：新页面能通过 window.opener 操纵你的原页面'
    ],
    related: ['attr-rel', 'html-a']
  },

  {
    id: 'attr-rel', name: 'rel', zh: '关系说明',
    purpose: '说明「当前文档」和「目标资源」是什么关系。stylesheet 表示样式表，noopener / noreferrer 用于外链安全。',
    syntax: '<link rel="stylesheet" href="a.css">\n<a href="..." target="_blank" rel="noopener">',
    status: 'modern',
    keywords: ['关系', 'stylesheet', 'noopener', '安全', 'nofollow'],
    example: {
      html: '<p>rel 是给浏览器/搜索引擎的说明，不影响肉眼看到的样子。</p>\n<p>本页的样式表就是用 rel="stylesheet" 接进来的。</p>',
      css: '.box { background: #eef2ff; padding: 12px; border-radius: 8px; }',
      js: ''
    },
    errors: [
      '引入 CSS 时忘了 rel="stylesheet"：浏览器拿到文件但不知道要当样式用，直接忽略',
      '外链新窗口忘记加 noopener'
    ],
    related: ['html-link', 'attr-target'],
    tip: '<b>noopener 在防什么</b>：新打开的页面可以用 window.opener 访问原页面，甚至把你原来的页面偷偷换掉。加了 noopener，reference 被切断，就安全了。'
  },

  {
    id: 'attr-type', name: 'type', zh: '类型',
    purpose: '在不同标签上含义不同：<input> 上是控件种类，<button> 上是按钮行为（button / submit / reset），<script> 上是脚本类型。',
    syntax: '<input type="email">\n<button type="button">\n<script type="module">',
    status: 'modern',
    keywords: ['类型', '输入框', 'email', 'number', 'date', 'submit'],
    example: {
      html: '<p>邮箱：<input type="email" placeholder="you@example.com"></p>\n<p>数字：<input type="number" min="1" max="10" value="3"></p>\n<p>日期：<input type="date"></p>\n<p>范围：<input type="range" min="0" max="100" value="50"></p>',
      css: 'input { padding: 6px 10px; border: 1px solid #ccd2dc; border-radius: 6px; font: inherit; }',
      js: ''
    },
    errors: [
      '在 <form> 里的按钮不写 type：默认 type="submit"，点一下表单就提交/刷新了',
      '用 type="text" 收邮箱：用 type="email" 能白拿浏览器自带的格式校验和手机专用键盘'
    ],
    related: ['html-input', 'html-button', 'attr-required'],
    tip: '<b>type 是 HTML 属性</b>，写在标签里；<b>typeof 是 JS 运算符</b>，用来查数据类型。长得像，完全无关。'
  },

  {
    id: 'attr-placeholder', name: 'placeholder', zh: '占位提示',
    purpose: '输入框为空时显示的灰色提示文字。它只是提示，不是默认值。',
    syntax: '<input type="text" placeholder="请输入手机号">',
    status: 'modern',
    keywords: ['占位', '提示', '灰字', '输入框'],
    example: {
      html: '<p><input type="text" placeholder="试试直接点提交，什么都不会发生" id="p1"></p>\n<p><button type="button" id="p2">看看 value 是什么</button></p>\n<p id="p3"></p>',
      css: 'input { padding: 8px 12px; border: 1px solid #ccd2dc; border-radius: 6px; }\ninput::placeholder { color: #aab2c0; }',
      js: "document.getElementById('p2').addEventListener('click', function () {\n  const v = document.getElementById('p1').value;\n  document.getElementById('p3').textContent = 'value 是：' + JSON.stringify(v) + '（空字符串，不是提示文字）';\n});"
    },
    errors: [
      '把 placeholder 当默认值用：用户不输入的话，它根本不会提交，value 是空字符串',
      '用 placeholder 代替 <label>：填到一半提示就没了，用户忘了这栏要填什么，读屏软件支持也不稳定',
      '提示文字写太长被截断'
    ],
    related: ['attr-value', 'html-label', 'html-input'],
    tip: '<b>placeholder 和 value 的区别</b>：placeholder 是"水印"，不参与提交；value 是真实内容，会被提交。两者长得像，作用完全不同。'
  },

  {
    id: 'attr-value', name: 'value', zh: '值',
    purpose: '控件的当前值。会作为表单数据提交出去，也会被 JS 的 .value 读到。',
    syntax: '<input type="text" value="默认内容">',
    status: 'modern',
    keywords: ['值', '默认值', '内容', '提交'],
    example: {
      html: '<p><input id="v1" type="text" value="我是默认值"></p>\n<p><button type="button" id="v2">读出来</button></p>\n<p id="v3"></p>',
      css: 'input { padding: 8px 12px; border: 1px solid #ccd2dc; border-radius: 6px; }',
      js: "document.getElementById('v2').addEventListener('click', function () {\n  document.getElementById('v3').textContent =\n    'HTML 里写的 value：' + document.getElementById('v1').getAttribute('value') +\n    ' / 现在的 value：' + document.getElementById('v1').value;\n});"
    },
    errors: [
      '以为改了 HTML 的 value 属性就能改输入框内容：用户改过之后，两者会不一致，应该用 JS 的 .value',
      '把 value 和 placeholder 搞混：一个是真的内容，一个是灰字提示'
    ],
    related: ['attr-placeholder', 'html-input'],
    tip: '<b>属性 value 和 JS 属性 .value 不是同一个东西</b>：前者是"初始值"（写在 HTML 里），后者是"当前值"（用户改过的）。这是初学者很常见的一个坑。'
  },

  {
    id: 'attr-disabled', name: 'disabled', zh: '禁用',
    purpose: '让表单控件不可用，呈灰化状态，不能点击也不能提交。布尔属性：写了就是真。',
    syntax: '<button disabled>不能点</button>',
    status: 'modern',
    keywords: ['禁用', '灰化', '不可用', '布尔属性'],
    example: {
      html: '<p><button disabled>我是被禁用的</button></p>\n<p><button id="d1">点我解除禁用</button></p>\n<p><input id="d2" type="text" value="我被禁用了" disabled></p>',
      css: 'button:disabled, input:disabled { opacity: .5; cursor: not-allowed; }',
      js: "document.getElementById('d1').addEventListener('click', function () {\n  const i = document.getElementById('d2');\n  i.disabled = !i.disabled;\n  console.log('现在 disabled =', i.disabled);\n});"
    },
    errors: [
      '写成 disabled="false"：布尔属性只要出现就是"真"，要取消必须整个删掉这个属性',
      '用 disabled 做"提交后再禁用防重复提交"：被禁用的控件不会提交，值会丢，应该用 readonly 或只禁用按钮'
    ],
    related: ['attr-readonly', 'attr-required', 'html-input'],
    tip: '<b>布尔属性</b>（disabled、checked、required、selected）的规则：出现即为真，不管值写什么。<b>要让它变假，得用 JS 删掉整个属性</b>。'
  },

  {
    id: 'attr-readonly', name: 'readonly', zh: '只读',
    purpose: '内容可以选中、可以复制，但不能修改；值仍然会随表单提交。和 disabled 的区别就在这里。',
    syntax: '<input type="text" value="只能看" readonly>',
    status: 'modern',
    keywords: ['只读', '不可编辑', '布尔属性'],
    example: {
      html: '<p>只读（能选中、会提交）：<input type="text" value="我是 readonly" readonly></p>\n<p>禁用（不能选、不提交）：<input type="text" value="我是 disabled" disabled></p>',
      css: 'input { padding: 6px 10px; border: 1px solid #ccd2dc; border-radius: 6px; margin-bottom: 8px; }',
      js: ''
    },
    errors: [
      '用 readonly 代替 disabled 来"锁住"按钮：readonly 对 button 无效',
      '以为 readonly 能防篡改：用户照样能用开发者工具改掉值，安全校验必须在服务器做'
    ],
    related: ['attr-disabled', 'html-input'],
    tip: '<b>readonly vs disabled 一句话</b>：readonly 是「你能看不能改，东西照样交上去」；disabled 是「这东西整个不存在了，连提交都不算它」。'
  },

  {
    id: 'attr-required', name: 'required', zh: '必填',
    purpose: '标记表单控件为必填，浏览器会在提交前自带校验，不填就拦下来并提示。',
    syntax: '<input type="text" required>',
    status: 'modern',
    keywords: ['必填', '校验', '验证', '布尔属性'],
    example: {
      html: '<form>\n  <p><input type="text" placeholder="这里必填" required></p>\n  <p><button type="submit">提交试试</button></p>\n</form>',
      css: 'input { padding: 8px 12px; border: 1px solid #ccd2dc; border-radius: 6px; }\ninput:invalid { border-color: #d64545; }',
      js: ''
    },
    errors: [
      '以为有了 required 就安全了：浏览器校验可以被绕过，服务器端必须再校验一次',
      '在 hidden 或 readonly 的控件上写 required：会直接导致表单永远提交不了'
    ],
    related: ['attr-disabled', 'attr-type', 'html-form']
  },

  {
    id: 'attr-data', name: 'data-*', zh: '自定义数据',
    purpose: '给元素挂自定义数据，名字以 data- 开头。HTML 里随便写，JS 里统一用 dataset 读取。',
    syntax: '<div data-user-id="42"> … </div>\nJS: el.dataset.userId',
    status: 'modern',
    keywords: ['自定义属性', 'data', 'dataset', '数据'],
    example: {
      html: '<button class="buy" data-id="101" data-price="29.9">买 A</button>\n<button class="buy" data-id="102" data-price="59.9">买 B</button>\n<p id="out"></p>',
      css: 'button { padding: 6px 14px; margin-right: 8px; }',
      js: "document.querySelectorAll('.buy').forEach(function (b) {\n  b.addEventListener('click', function () {\n    document.getElementById('out').textContent =\n      '选中商品 id=' + b.dataset.id + '，价格 ' + b.dataset.price;\n  });\n});"
    },
    errors: [
      '用 random 属性名挂数据（比如 userid="42"）：不算错但很乱，规范做法就是 data-*',
      '在 dataset 里找连字符：data-user-id 要读成 dataset.userId（自动转成小驼峰）'
    ],
    related: ['js-dataset', 'js-queryselectorall', 'attr-class'],
    tip: '<b>data-user-id 变成 dataset.userId</b>：HTML 里用连字符，JS 里自动转成小驼峰。这是唯一一个"两边写法不一样"的属性。'
  },

  {
    id: 'attr-lang', name: 'lang', zh: '语言',
    purpose: '声明内容用哪种语言。影响读屏软件用哪种语音朗读，也影响浏览器判断要不要断词、用哪套引号。',
    syntax: '<html lang="zh-CN">\n<p lang="en">Hello</p>',
    status: 'modern',
    keywords: ['语言', '中文', '读音', '无障碍', 'SEO'],
    example: {
      html: '<p>这段是中文，读屏软件会用中文念。</p>\n<p lang="en">This sentence is English, so screen readers switch voice.</p>',
      css: 'p { margin-bottom: 10px; }',
      js: ''
    },
    errors: [
      '在 <html> 上漏写 lang：读屏软件可能用英文发音来念中文，完全听不懂',
      '写 lang="cn" 而不是 "zh-CN"：语言代码用 ISO 标准，中文是 zh'
    ],
    related: ['html-html', 'attr-charset']
  },

  {
    id: 'attr-charset', name: 'charset', zh: '字符编码',
    purpose: '声明文档用哪种字符编码，配合 <meta> 使用。写 UTF-8 就对了，中文页面的必备行。',
    syntax: '<meta charset="utf-8">',
    status: 'modern',
    keywords: ['编码', '乱码', 'utf-8', '中文'],
    example: {
      html: '<p>本页首行写了 &lt;meta charset="utf-8"&gt;，所以中文正常显示。</p>\n<p>如果编码写错或漏写，中文就会变成「锟斤拷」或者一串问号。</p>',
      css: '.box { background: #fff8e1; padding: 12px; border-radius: 8px; }',
      js: ''
    },
    errors: [
      '漏写或写错：中文、emoji 全部乱码',
      '把 <meta charset> 放在 <head> 很靠后的位置：浏览器前 1024 字节里没看到就可能猜错编码',
      '声明了 utf-8，文件却是用 GBK 存的：照样乱码 —— 声明和实际保存格式必须一致'
    ],
    related: ['html-meta', 'attr-lang'],
    tip: '<b>为什么会有乱码</b>：字符在文件里存的是一串字节，得用同一套规则翻译回来。文件用 UTF-8 存、页面声明 GBK 读，翻译错了就成了乱码。'
  },

  {
    id: 'attr-defer', name: 'defer / async', zh: '脚本加载时机',
    purpose: '控制外部脚本什么时候下载、什么时候执行。解决「脚本执行时元素还没生成」的经典问题。布尔属性。',
    syntax: '<script src="app.js" defer></script>',
    status: 'modern',
    keywords: ['延迟', '异步', '加载', '执行顺序', 'defer', 'async'],
    example: {
      html: '<p>下面这个脚本用了 defer，所以它能拿到页面里的元素：</p>\n<p id="t">我被 JS 改过了</p>\n<p id="r"></p>',
      css: 'p { margin-bottom: 8px; }',
      js: "document.getElementById('t').textContent = '✅ 拿到元素了（defer 等到 HTML 解析完才执行）';\ndocument.getElementById('r').textContent = '如果没写 defer 又放在 head 里，这里会报 null 错误。';"
    },
    errors: [
      '把 <script> 放 <head> 又不加 defer，然后去操作 body 里的元素：元素还不存在，得到 null',
      'defer 和 async 同时写：async 生效，defer 被忽略',
      '多个脚本有依赖关系却用 async：执行顺序不保证，可能后面的先跑'
    ],
    related: ['html-script', 'attr-src', 'js-queryselector'],
    tip: '<b>一张表记住</b>：普通 script = 下载并立即执行（会卡住页面解析）；defer = 下载同时继续解析，全部解析完再按顺序执行；async = 下载完就执行，顺序不确定。日常首选 <b>defer</b>。'
  },

  {
    id: 'attr-for', name: 'for', zh: '绑定到哪个控件',
    purpose: '写在 <label> 上，值必须是某个表单控件的 id。绑定后点击文字就等于点击控件，读屏软件也能念出这栏是干什么的。',
    syntax: '<label for="输入框的id">说明文字</label>\n<input id="输入框的id">',
    status: 'modern',
    keywords: ['label', 'for', '绑定', '表单'],
    example: {
      html: '<p><label for="c1">点这几个字，勾选框会跟着切换：</label><input id="c1" type="checkbox"></p>\n<p><label for="c2">点这几个字，光标会跳进输入框：</label><input id="c2" type="text" placeholder="试试"></p>\n<p>也可以省掉 for，把控件直接包在 label 里面：</p>\n<p><label><input type="checkbox"> 这样也能点</label></p>',
      css: 'label { cursor: pointer; }\ninput[type=text] { padding: 5px 9px; border: 1px solid #ccd2dc; border-radius: 6px; }',
      js: ''
    },
    errors: [
      'for 的值和 id 不一致：绑不上，点了没反应，而且不报错',
      'for 里写的是 name 值：for 对应的是 id，不是 name',
      '表单里忘了 label：读屏软件只会念出「编辑框」，用户不知道这栏该填什么'
    ],
    related: ['html-label', 'html-input', 'attr-id', 'attr-value'],
    tip: '<b>for 只认 id</b>，这一点和 CSS 里 . 认 class、# 认 id 的规则是一致的 —— id 在整份文档里唯一，所以能精确指到某一个控件。'
  },

  {
    id: 'attr-action', name: 'action', zh: '表单提交到哪',
    purpose: '写在 <form> 上，指定表单数据提交到哪个地址。不写的话默认提交回当前页面。',
    syntax: '<form action="/api/login" method="post">',
    status: 'modern',
    keywords: ['表单', '提交地址', 'action', '后端'],
    example: {
      html: '<p>这个示例的表单不写 action，提交会回到当前页面 —— 所以我们用 JS 把它拦下来了。</p>\n<form id="f1" method="get">\n  <p><label for="kw">搜索：</label><input id="kw" name="q" type="text" value="测试"></p>\n  <p><button type="submit">提交</button></p>\n</form>\n<p id="out"></p>',
      css: 'form { border: 1px solid #ccd2dc; padding: 12px; border-radius: 8px; max-width: 320px; }\ninput { padding: 6px 10px; border: 1px solid #ccd2dc; border-radius: 6px; }',
      js: "document.getElementById('f1').addEventListener('submit', function (e) {\n  e.preventDefault();\n  const data = new FormData(e.target);\n  document.getElementById('out').textContent =\n    '本来会提交到 action 指定的地址，数据是：q=' + data.get('q');\n});"
    },
    errors: [
      '本地双击打开页面时提交到相对路径：file:// 下表单提交行为很怪，开发表单请起本地服务器',
      '地址写错却看不出来：表单会跳到一个 404 页面，让人以为是自己代码坏了'
    ],
    related: ['html-form', 'attr-method'],
    tip: '<b>现代做法</b>：很多单页应用干脆不写 action，改用 JS 的 fetch 把数据以 JSON 发出去，然后 e.preventDefault() 阻止默认的页面跳转。'
  },

  {
    id: 'attr-method', name: 'method', zh: '提交方式',
    purpose: '写在 <form> 上，决定数据怎么发给服务器：get 拼在网址后面，post 放在请求体里。',
    syntax: '<form method="get">   数据挂在网址上，能被看到、能加书签\n<form method="post">  放在请求体里，适合敏感/大量数据',
    status: 'modern',
    keywords: ['表单', 'get', 'post', '提交方式', '安全'],
    example: {
      html: '<p>下面这个表单用 get，看看提交时网址会变成什么样子 —— 我们拦下来了，只展示拼接结果：</p>\n<form id="g">\n  <p><input name="user" type="text" value="小明"></p>\n  <p><input name="pw" type="text" value="123456"></p>\n  <p><button type="submit">get 提交</button></p>\n</form>\n<p id="out"></p>',
      css: 'form { border: 1px solid #ccd2dc; padding: 12px; border-radius: 8px; max-width: 340px; }\ninput { padding: 6px 10px; border: 1px solid #ccd2dc; border-radius: 6px; margin-bottom: 6px; }',
      js: "document.getElementById('g').addEventListener('submit', function (e) {\n  e.preventDefault();\n  const d = new FormData(e.target);\n  const qs = new URLSearchParams(d).toString();\n  document.getElementById('out').textContent =\n    'get 提交后网址会变成：' + location.pathname + '?' + qs +\n    '\\n\\n看清楚了吗？密码明晃晃挂在网址上 —— 所以登录类表单必须用 post。';\n});"
    },
    errors: [
      '登录、注册表单用 get：密码会出现在网址、浏览器历史和服务器日志里',
      '以为 post 就安全了：post 只是不放在网址里，明文 http 下照样能被抓包，还得靠 https',
      '刷新 post 提交的页面时浏览器弹「是否重新提交」：这是 post 语义的正常表现，用 JS + fetch 可以避免'
    ],
    related: ['html-form', 'attr-action'],
    tip: '<b>一句话选</b>：只是「查询/筛选」用 get（可以收藏、可以前进后退）；「会改变数据」的操作一律用 post。'
  }

];
