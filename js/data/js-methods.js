/* ==========================================================================
   JavaScript 方法 / 函数 / 常用属性 词条
   --------------------------------------------------------------------------
   注意区分（这也是「基础概念」那几篇在讲的事）：
     · 方法   = 挂在某个对象上的函数，用点号调用：arr.map(...)、el.addEventListener(...)
     · 函数   = 独立存在、直接调用：parseInt(...)、setTimeout(...)
     · 属性   = 不是函数，不用括号：arr.length、el.textContent
   本文件把常用的都收进来，每条都注明了它属于哪一种。
   ========================================================================== */

window.WDT_JS_METHODS = [

  {
    id: 'js-queryselector', name: 'document.querySelector()', zh: '查询单个元素',
    purpose: '用 CSS 选择器语法找到「第一个」匹配的元素，找不到返回 null。取元素的万能入口。',
    syntax: "document.querySelector('CSS选择器')",
    status: 'modern',
    keywords: ['选择器', '取元素', '查找', 'querySelector'],
    example: {
      html: '<div class="card"><h3>标题</h3><p class="desc">正文</p></div>\n<p id="out"></p>',
      css: '.card { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }',
      js: "const p = document.querySelector('.card .desc');\nconsole.log('找到的文字：', p.textContent);\ndocument.querySelector('#out').textContent = '用选择器取到了：' + p.textContent;"
    },
    errors: [
      '选择器忘了加点或井号：querySelector("card") 是在找叫 card 的标签，不是 class',
      '拿到 null 就直接用：元素不存在时返回 null，必须先判断再用，否则报 "Cannot read properties of null"',
      '脚本写在元素之前执行：那时元素还没生成，只会拿到 null（加 defer 或把脚本放最后）'
    ],
    related: ['js-queryselectorall', 'js-getelementbyid', 'concept-selector'],
    tip: '参数用的是 <b>CSS 选择器语法</b>，这点很关键 —— 你会的每一个 CSS 选择器都能直接拿来选元素。'
  },

  {
    id: 'js-queryselectorall', name: 'document.querySelectorAll()', zh: '查询多个元素',
    purpose: '找到「所有」匹配的元素，返回一个 NodeList（类数组，不是真数组）。用 forEach 可以遍历。',
    syntax: "document.querySelectorAll('CSS选择器')",
    status: 'modern',
    keywords: ['选择器', '多个元素', '列表', 'querySelectorAll', 'NodeList'],
    example: {
      html: '<ul>\n  <li class="item">苹果</li>\n  <li class="item">香蕉</li>\n  <li class="item">橘子</li>\n</ul>\n<button id="btn">全部变红</button>',
      css: '.item { padding: 4px 0; }\n.item.on { color: #d64545; font-weight: 700; }',
      js: "const items = document.querySelectorAll('.item');\nconsole.log('找到', items.length, '个，类型是', items.constructor.name);\ndocument.getElementById('btn').addEventListener('click', function () {\n  items.forEach(function (el) { el.classList.toggle('on'); });\n});"
    },
    errors: [
      '以为它返回数组：它是 NodeList，没有 map/filter/reduce。要转数组用 [...items] 或 Array.from(items)',
      '在循环里反复调用 querySelectorAll：性能差，先存到变量里',
      '只取第一个就直接用：querySelectorAll 的结果也是要用下标或 forEach 的'
    ],
    related: ['js-queryselector', 'js-foreach', 'concept-selector']
  },

  {
    id: 'js-getelementbyid', name: 'document.getElementById()', zh: '按 id 取元素',
    purpose: '按 id 精确取一个元素。比 querySelector 快一点点，代码也更直白。',
    syntax: "document.getElementById('id名')",
    status: 'modern',
    keywords: ['id', '取元素', 'getElementById'],
    example: {
      html: '<p id="hello">原始文字</p>\n<button id="change">改名</button>',
      css: '#hello { font-size: 18px; }',
      js: "document.getElementById('change').addEventListener('click', function () {\n  document.getElementById('hello').textContent = '被 JS 改过了';\n});"
    },
    errors: [
      '参数里加了 # 号：getElementById("#hello") 找不到，它只要纯 id 名（这是和 querySelector 最大的区别）',
      'id 拼错：返回 null 而不是报错，然后你会在下一行看到 null 相关的报错'
    ],
    related: ['js-queryselector', 'attr-id'],
    tip: '<b>querySelector("#hello")</b> 要带井号，<b>getElementById("hello")</b> 不带 —— 两个函数对参数格式的要求不一样，混用会得到 null。'
  },

  {
    id: 'js-createelement', name: 'document.createElement()', zh: '创建元素',
    purpose: '凭空造一个新元素。刚创建时它还在内存里，没被放进页面，要用 appendChild 之类插进去。',
    syntax: "document.createElement('标签名')",
    status: 'modern',
    keywords: ['创建', '新元素', '动态添加', 'createElement'],
    example: {
      html: '<button id="add">添加一条</button>\n<ul id="list"></ul>',
      css: 'li { padding: 6px 10px; background: #f7f8fa; border-radius: 6px; margin-top: 6px; list-style: none; }',
      js: "let i = 0;\ndocument.getElementById('add').addEventListener('click', function () {\n  const li = document.createElement('li');\n  i++;\n  li.textContent = '第 ' + i + ' 条';\n  document.getElementById('list').appendChild(li);\n});"
    },
    errors: [
      '创建完就以为它出现了：必须插进页面（appendChild / append / insertBefore）',
      '用 createElement("div.class") 想带样式：标签名只能写标签名，class 要另外用 el.className 设',
      '在循环里反复操作 DOM：每次都会触发页面重排，可以先用文档片段攒起来再一次性插入'
    ],
    related: ['js-appendchild', 'js-textcontent', 'js-innerhtml']
  },

  {
    id: 'js-appendchild', name: 'element.appendChild()', zh: '追加子元素',
    purpose: '把一个节点放到指定元素的末尾，成为它的最后一个子元素。',
    syntax: '父元素.appendChild(新节点)',
    status: 'modern',
    keywords: ['追加', '插入', '添加', 'appendChild', 'dom'],
    example: {
      html: '<button id="b">加一行</button>\n<div id="box"></div>',
      css: '#box div { background: #e9f7ec; padding: 8px; border-radius: 6px; margin-top: 6px; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const d = document.createElement('div');\n  d.textContent = '新的一行 ' + new Date().toLocaleTimeString();\n  document.getElementById('box').appendChild(d);\n});"
    },
    errors: [
      '同一个节点 appendChild 两次：它会被"移动"过去，而不是复制两份。要复制得用 cloneNode(true)',
      '往 null 上 appendChild：父元素没取到，报错',
      '以为 appendChild 会返回插入的节点：它返回的是父元素，不是子元素'
    ],
    related: ['js-createelement', 'js-queryselector'],
    tip: '<b>append() 和 appendChild() 的区别</b>：appendChild 只能接节点，append 还能直接接字符串，而且能一次接多个。日常用 append 更省事。'
  },

  {
    id: 'js-setattribute', name: 'element.setAttribute()', zh: '设置属性',
    purpose: '给元素设置 HTML 属性。属性名和值都是字符串。',
    syntax: "el.setAttribute('属性名', '值')",
    status: 'modern',
    keywords: ['属性', '设置属性', 'setAttribute'],
    example: {
      html: '<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%2750%27%3E%3Crect width=%27100%27 height=%2750%27 fill=%27%23bb9af7%27/%3E%3C/svg%3E" alt="占位图">\n<button id="b">换 alt 文字</button>\n<p id="out"></p>',
      css: 'img { border-radius: 6px; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const img = document.querySelector('img');\n  img.setAttribute('alt', '紫色矩形（alt 被改过了）');\n  document.getElementById('out').textContent = '现在的 alt = ' + img.getAttribute('alt');\n});"
    },
    errors: [
      '想改输入框内容却用 setAttribute("value", ...)：用户改过之后属性值和当前值就分家了，应该改 el.value',
      '想改文字却用 setAttribute("textContent", ...)：那不是 HTML 属性，该用 el.textContent',
      '以为 setAttribute 能设样式：设 class 用 className 或 classList 更合适'
    ],
    related: ['js-getattribute', 'js-classlist', 'js-dataset', 'concept-html-attr-vs-css'],
    tip: '<b>属性 vs JavaScript 属性</b>：setAttribute 改的是"HTML 上写的那种属性"；而 el.value、el.textContent 是 JS 对象上的属性。<b>它们有时会同步，有时会分家</b>，所以各有各的用法。'
  },

  {
    id: 'js-getattribute', name: 'element.getAttribute()', zh: '读取属性',
    purpose: '读出元素上某个 HTML 属性写的是什么。没写这个属性就返回 null。',
    syntax: "el.getAttribute('属性名')",
    status: 'modern',
    keywords: ['读属性', '获取属性', 'getAttribute'],
    example: {
      html: '<a id="link" href="https://example.com" title="示例站点">一个链接</a>\n<p id="out"></p>',
      css: 'a { color: #2f6fdd; }',
      js: "const a = document.getElementById('link');\nconsole.log('href =', a.getAttribute('href'));\nconsole.log('title =', a.getAttribute('title'));\nconsole.log('data-x =', a.getAttribute('data-x'));   // 没写，返回 null\ndocument.getElementById('out').textContent = 'href 是 ' + a.getAttribute('href');"
    },
    errors: [
      '和 el.href 混：el.href 会返回"解析后的完整绝对地址"，getAttribute("href") 返回"你写的原文"。两个结果不一样、用途也不一样',
      '用 getAttribute("class") 后又去分开处理：多个 class 时用 el.classList 更方便'
    ],
    related: ['js-setattribute', 'js-dataset', 'attr-href'],
    tip: '<b>想验证这句话</b>：把示例里的 <b>a.getAttribute("href")</b> 改成 <b>a.href</b> 再运行，看看 console 里的结果有什么不同。'
  },

  {
    id: 'js-classlist', name: 'element.classList', zh: '类名操作',
    purpose: '增删切换元素的 class，比直接拼 className 字符串安全得多。常用 add / remove / toggle / contains。',
    syntax: "el.classList.add('类名')\nel.classList.remove('类名')\nel.classList.toggle('类名')\nel.classList.contains('类名')",
    status: 'modern',
    keywords: ['class', '类名', '添加', '删除', '切换', 'classList'],
    example: {
      html: '<div id="card" class="card">点下面的按钮</div>\n<button id="b">切换高亮</button>',
      css: '.card { padding: 14px 18px; border: 1px solid #ccd2dc; border-radius: 10px; transition: all .15s ease; }\n.card.hi { background: #fff3cd; border-color: #e0af68; }',
      js: "const card = document.getElementById('card');\ndocument.getElementById('b').addEventListener('click', function () {\n  card.classList.toggle('hi');\n  console.log('现在有 hi 吗？', card.classList.contains('hi'));\n});"
    },
    errors: [
      '用 el.className = "hi" 直接赋值：会把原有的所有 class 冲掉，应该用 classList.add',
      '类名前面加点号：classList.add(".hi") 加进去的就是一个叫 ".hi" 的怪名字，CSS 匹配不上',
      '用 contains 判断时写了多个类名：contains 一次只判断一个'
    ],
    related: ['attr-class', 'js-setattribute', 'concept-selector'],
    tip: '<b>为什么推荐 classList</b>：用 className 拼字符串很容易手滑（少个空格就连成一个类名），classList 帮你处理了这些细节。'
  },

  {
    id: 'js-dataset', name: 'element.dataset', zh: '读自定义数据',
    purpose: '读写 HTML 里 data-* 挂的数据。属性：不是方法，不用加括号。',
    syntax: "el.dataset.userId      // 对应 data-user-id",
    status: 'modern',
    keywords: ['data', 'dataset', '自定义属性', '数据'],
    example: {
      html: '<button class="item" data-id="7" data-name="苹果">点我看数据</button>\n<p id="out"></p>',
      css: 'button { padding: 8px 16px; }',
      js: "document.querySelector('.item').addEventListener('click', function (e) {\n  const d = e.target.dataset;\n  document.getElementById('out').textContent = 'id=' + d.id + '，name=' + d.name;\n});"
    },
    errors: [
      '用 dataset["user-id"]：JS 里要写成小驼峰 dataset.userId',
      '把敏感数据放 data-* 里：前端代码用户都能看到，不能放密钥'
    ],
    related: ['attr-data', 'js-setattribute']
  },

  {
    id: 'js-textcontent', name: 'element.textContent', zh: '纯文本内容',
    purpose: '读写元素的纯文字，不会解析 HTML。属性：不是方法。',
    syntax: 'el.textContent',
    status: 'modern',
    keywords: ['文字', '文本', '内容', 'textContent'],
    example: {
      html: '<div id="t">原始文字</div>\n<p id="out"></p>',
      css: '#t { background: #f7f8fa; padding: 10px; border-radius: 6px; }',
      js: "const t = document.getElementById('t');\nt.textContent = '我把 <b>标签</b> 当普通文字写进去，不会被解析成粗体';\ndocument.getElementById('out').textContent = '结果就是原样显示，很安全。';"
    },
    errors: [
      '以为它会解析 HTML：不会，&lt;b&gt; 会原样显示。要插入 HTML 得用 innerHTML（但有安全风险）',
      '读隐藏元素的内容：textContent 读得到，但它不反映屏幕上的换行和空白折叠（那是 innerText）'
    ],
    related: ['js-innerhtml', 'js-createelement'],
    tip: '<b>写文字一律优先用 textContent</b>。它不会执行代码、不会解析标签，天然免疫一类注入攻击。'
  },

  {
    id: 'js-innerhtml', name: 'element.innerHTML', zh: 'HTML 内容',
    purpose: '读写元素内部的 HTML，读写都会被浏览器当成标签解析。方便，但有一类安全风险。',
    syntax: 'el.innerHTML',
    status: 'modern',
    keywords: ['html', '内容', '插入标签', 'innerHTML', 'XSS'],
    example: {
      html: '<div id="box">原来的内容</div>\n<button id="b1">插入 HTML</button>\n<button id="b2">安全地插入</button>',
      css: '#box { padding: 12px; background: #f7f8fa; border-radius: 8px; margin-bottom: 10px; }\nbutton { margin-right: 8px; }',
      js: "document.getElementById('b1').addEventListener('click', function () {\n  document.getElementById('box').innerHTML = '这是 <b>粗体</b>，还有 <a href=\"#\">链接</a>';\n});\ndocument.getElementById('b2').addEventListener('click', function () {\n  const box = document.getElementById('box');\n  box.textContent = '';\n  const b = document.createElement('b');\n  b.textContent = '粗体';\n  box.appendChild(b);\n  box.appendChild(document.createTextNode('，但用 DOM 方式创建，安全'));\n});"
    },
    errors: [
      '把用户输入直接塞进 innerHTML：如果输入里有 <script> 或 onerror=，就会执行 —— 这就是 XSS 攻击',
      '用 innerHTML 往循环里反复追加（+=）：每次都会重建整个子树的 DOM，很慢',
      '以为 innerHTML 里写的 <script> 会执行：用 innerHTML 插入的 script 不会自动运行，这是另一类容易误解的点'
    ],
    related: ['js-textcontent', 'js-createelement'],
    tip: '<b>记住一句就够</b>：内容来自"你自己写死的字符串" → innerHTML 没问题；内容来自"用户输入或接口数据" → 用 textContent 或 DOM 创建方式，不要用 innerHTML。'
  },

  {
    id: 'js-addeventlistener', name: 'element.addEventListener()', zh: '绑定事件',
    purpose: '给元素绑定事件处理函数。一个元素可以绑多个，互不覆盖。',
    syntax: "el.addEventListener('事件名', 处理函数)",
    status: 'modern',
    keywords: ['事件', '监听', '点击', 'click', 'addEventListener'],
    example: {
      html: '<button id="b">点我</button>\n<p id="out">等点击…</p>',
      css: 'button { padding: 8px 18px; }',
      js: "const out = document.getElementById('out');\ndocument.getElementById('b').addEventListener('click', function () {\n  out.textContent = '第一次处理：被点了 ' + Date.now();\n});\ndocument.getElementById('b').addEventListener('click', function () {\n  out.textContent += ' ｜ 第二次处理也跑了（两个监听互不覆盖）';\n});"
    },
    errors: [
      '在循环里给每个元素都绑同一个函数又需要区分它们：用 event.target 或闭包，别指望下标能在回调里直接用 var 拿到',
      '给不存在的元素绑定（null.addEventListener）：报错',
      '用 onclick = fn 覆盖掉了之前绑的：addEventListener 不会覆盖，这是它比 onclick 好的地方',
      '忘了第三个参数：默认只在冒泡阶段触发；想让父元素也能捕获要写 { capture: true }'
    ],
    related: ['js-queryselectorall', 'html-button', 'html-form'],
    tip: '<b>为什么推荐 addEventListener 而不是 onclick 属性</b>：onclick 只能挂一个、还把 JS 混进了 HTML；addEventListener 能挂多个，而且代码和结构分得开。'
  },

  {
    id: 'js-foreach', name: 'array.forEach()', zh: '遍历数组',
    purpose: '把数组每一项都过一遍，主要用来「做点什么」（打印、改 DOM）。它不返回新数组。',
    syntax: 'arr.forEach(function (item, index) { … })',
    status: 'modern',
    keywords: ['遍历', '循环', 'forEach'],
    example: {
      html: '<ul id="list"></ul>',
      css: 'li { padding: 6px 10px; background: #eef2ff; border-radius: 6px; margin-top: 6px; list-style: none; }',
      js: "const fruits = ['苹果', '香蕉', '橘子'];\nfruits.forEach(function (name, i) {\n  console.log(i, name);\n  const li = document.createElement('li');\n  li.textContent = (i + 1) + '. ' + name;\n  document.getElementById('list').appendChild(li);\n});"
    },
    errors: [
      '用它来"生成新数组"：它返回 undefined，要生成新数组用 map',
      '在回调里 return 想中断循环：forEach 不能 break/continue，要中断得用 for 或 .some()/.find()'
    ],
    related: ['js-map', 'js-filter', 'js-queryselectorall']
  },

  {
    id: 'js-map', name: 'array.map()', zh: '映射成新数组',
    purpose: '把每一项「变换」成另一个值，返回一个长度相同的新数组。原数组不动。',
    syntax: 'const newArr = arr.map(item => 新值)',
    status: 'modern',
    keywords: ['映射', '转换', 'map', '新数组'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);\nconsole.log('原数组', nums);       // 没变\nconsole.log('新数组', doubled);\ndocument.getElementById('out').textContent =\n  '原数组：' + JSON.stringify(nums) + '\\n新数组：' + JSON.stringify(doubled);"
    },
    errors: [
      '以为 map 会改原数组：不会，它返回新的',
      '在 map 里只做副作用（打印/改 DOM）不用返回值：那是 forEach 的场景，用 map 会得到一堆 undefined',
      '忘了 return（用花括号写函数体时）：会得到 undefined 数组'
    ],
    related: ['js-foreach', 'js-filter', 'js-reduce'],
    tip: '<b>map 和 forEach 怎么选</b>：要「得到一个新数组」用 map；只是「遍历做点什么」用 forEach。'
  },

  {
    id: 'js-filter', name: 'array.filter()', zh: '筛选',
    purpose: '按条件挑出符合条件的项，返回新数组（长度可能变短，也可能是空数组）。',
    syntax: 'const arr2 = arr.filter(item => 条件)',
    status: 'modern',
    keywords: ['筛选', '过滤', 'filter', '条件'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const users = [\n  { name: '小明', age: 17 },\n  { name: '小红', age: 24 },\n  { name: '小刚', age: 31 }\n];\nconst adults = users.filter(u => u.age >= 18);\nconsole.log(adults);\ndocument.getElementById('out').textContent = JSON.stringify(adults.map(u => u.name));"
    },
    errors: [
      '过滤条件写成赋值（u.age = 18）而不是比较：永远是 truthy，全过',
      '想找"第一个"符合的却用 filter：filter 会遍历整个数组，找第一个应该用 find'
    ],
    related: ['js-find', 'js-map', 'js-includes']
  },

  {
    id: 'js-find', name: 'array.find()', zh: '找第一个符合的',
    purpose: '返回第一个符合条件的元素本身；没找到返回 undefined。找到就停，不会遍历完。',
    syntax: 'const item = arr.find(x => 条件)',
    status: 'modern',
    keywords: ['查找', '第一个', 'find', '定位'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const items = [{ id: 1, n: '笔' }, { id: 2, n: '本' }, { id: 3, n: '尺' }];\nconst hit = items.find(x => x.id === 2);\nconst miss = items.find(x => x.id === 99);\nconsole.log('找到：', hit);\nconsole.log('没找到：', miss);\ndocument.getElementById('out').textContent =\n  '找到 ' + hit.n + '\\n没找到时返回：' + miss;"
    },
    errors: [
      '没找到时不判断就取属性：undefined.n 会报错，要先判断',
      '找"所有"符合的却用 find：那要用 filter',
      '把 find 和 filter 的返回值当成一种东西：find 返回单个元素（或 undefined），filter 永远返回数组'
    ],
    related: ['js-filter', 'js-includes']
  },

  {
    id: 'js-reduce', name: 'array.reduce()', zh: '归并成一个值',
    purpose: '把整个数组「累积」成单个结果：求和、求最大值、按条件分组、拼字符串。',
    syntax: 'arr.reduce((累计值, 当前项) => 新累计值, 初始值)',
    status: 'modern',
    keywords: ['归并', '累加', '求和', 'reduce', '汇总'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const cart = [\n  { name: '书', price: 45 },\n  { name: '笔', price: 8 },\n  { name: '本', price: 12 }\n];\nconst total = cart.reduce((sum, item) => sum + item.price, 0);\nconsole.log('总价', total);\ndocument.getElementById('out').textContent = '购物车总价：¥' + total;"
    },
    errors: [
      '忘了写初始值：没有初始值时，第一次循环会拿数组第一项当初值，容易算错（尤其是求和的场景）',
      '忘了 return：累加值会变成 undefined，最后结果是 NaN',
      '把简单的事写成 reduce：如果 forEach 或 map 更清楚，就别用 reduce 炫技'
    ],
    related: ['js-map', 'js-filter', 'js-foreach'],
    tip: '<b>reduce 是最容易写错、也最容易用错的方法</b>。判断标准：如果你自己隔一周看这段代码要想三秒，就换成 for 循环 + 普通变量。'
  },

  {
    id: 'js-includes', name: 'array.includes() / string.includes()', zh: '是否包含',
    purpose: '判断数组里有没有某个值、或字符串里有没有某段文字，返回 true / false。',
    syntax: 'arr.includes(值)\nstr.includes("文字")',
    status: 'modern',
    keywords: ['包含', '存在', 'includes', '查找'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const roles = ['读者', '作者', '管理员'];\nconst text = '今天重庆在下雨';\nconsole.log(roles.includes('作者'));       // true\nconsole.log(roles.includes('游客'));       // false\nconsole.log(text.includes('下雨'));        // true\ndocument.getElementById('out').textContent =\n  'roles 里有\"作者\"？' + roles.includes('作者') + '\\n' +\n  '文本里有\"下雨\"？' + text.includes('下雨') + '\\n' +\n  '文本里有\"下雪\"？' + text.includes('下雪');"
    },
    errors: [
      '对 null / undefined 调 includes：会报错，先确保有值',
      '用它判断"包含某个对象"：对象比较的是引用，内容一样也不算包含，要按某个字段用 some/find'
    ],
    related: ['js-indexof', 'js-find', 'js-filter']
  },

  {
    id: 'js-indexof', name: 'array.indexOf() / string.indexOf()', zh: '找位置',
    purpose: '返回某个值第一次出现的位置（从 0 开始）；找不到返回 -1。',
    syntax: 'arr.indexOf(值)   // 找不到返回 -1',
    status: 'legacy',
    keywords: ['位置', '下标', 'indexOf', '查找'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const arr = ['a', 'b', 'c'];\nconsole.log(arr.indexOf('b'));    // 1\nconsole.log(arr.indexOf('z'));    // -1\ndocument.getElementById('out').textContent =\n  '\"b\" 下标是 ' + arr.indexOf('b') + '\\n' +\n  '\"z\" 下标是 ' + arr.indexOf('z') + '（-1 表示没有）';"
    },
    errors: [
      '判空写成 if (arr.indexOf(x))：0 也是 falsy！必须写 !== -1。这是经典 bug',
      '只想知道"有没有"却用 indexOf：现在直接写 includes 更清楚'
    ],
    related: ['js-includes'],
    tip: '<b>状态是 legacy（旧写法）</b>：想知道"有没有"用 <b>includes</b>；真的需要下标才用 indexOf，并且判断要写 <b>!== -1</b>，不要直接当布尔值用。'
  },

  {
    id: 'js-slice', name: 'array.slice() / string.slice()', zh: '截取片段',
    purpose: '截取一段，返回新数组/新字符串，原数据不动。也支持负数下标（从末尾数）。',
    syntax: 'arr.slice(开始, 结束)   // 不含"结束"那一位',
    status: 'modern',
    keywords: ['截取', '切片', '片段', 'slice'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const arr = ['a', 'b', 'c', 'd', 'e'];\nconsole.log(arr.slice(1, 3));    // ['b','c']\nconsole.log(arr.slice(-2));      // ['d','e']\nconsole.log(arr);                // 原数组没变\ndocument.getElementById('out').textContent =\n  'slice(1,3) → ' + JSON.stringify(arr.slice(1, 3)) + '\\n' +\n  'slice(-2) → ' + JSON.stringify(arr.slice(-2)) + '\\n' +\n  '原数组 → ' + JSON.stringify(arr);"
    },
    errors: [
      '以为结束位置也算进去：slice(1, 3) 拿到的是下标 1、2，不含 3',
      '和 splice 混：slice 不动原数组，splice 会改原数组'
    ],
    related: ['js-splice', 'js-join'],
    tip: '<b>slice 和 splice 一字之差，行为完全不同</b>：<b>slice</b> = 切一段出来（原样不动）；<b>splice</b> = 动手术（会改原数组）。'
  },

  {
    id: 'js-splice', name: 'array.splice()', zh: '删除/插入',
    purpose: '直接改动原数组：从某位置删掉几个，并可在该处插入新项。返回被删掉的项。',
    syntax: 'arr.splice(开始, 删几个, 要插入的…)',
    status: 'modern',
    keywords: ['删除', '插入', '替换', 'splice'],
    example: {
      html: '<button id="b">删掉第 2 个</button>\n<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const list = ['苹果', '香蕉', '橘子', '葡萄'];\nfunction show(tip) {\n  document.getElementById('out').textContent = tip + '\\n现在：' + JSON.stringify(list);\n}\nshow('初始状态');\ndocument.getElementById('b').addEventListener('click', function () {\n  const removed = list.splice(1, 1);\n  show('删掉了 ' + removed.join('、') + '（原数组已被改动）');\n});"
    },
    errors: [
      '以为它和 slice 一样安全：splice 会改原数组，如果不想要副作用得先复制一份（[...arr]）',
      '在循环里 splice 又同时递增下标：会跳过元素，这类 bug 很难查'
    ],
    related: ['js-slice', 'js-push']
  },

  {
    id: 'js-push', name: 'array.push() / pop()', zh: '尾部增删',
    purpose: 'push 在数组末尾加一项并返回新的长度；pop 删掉最后一项并返回被删的元素。都是改原数组。',
    syntax: 'arr.push(值)\narr.pop()',
    status: 'modern',
    keywords: ['添加', '删除', '末尾', 'push', 'pop', '栈'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const stack = ['第一层'];\nconst len = stack.push('第二层');\nconsole.log('push 返回的是长度：', len);   // 2\nconst last = stack.pop();\nconsole.log('pop 返回的是被删的元素：', last);\ndocument.getElementById('out').textContent =\n  'push 返回 ' + len + '（长度，不是数组）\\n' +\n  'pop 返回 \"' + last + '\"（被删掉的元素）\\n' +\n  '现在数组：' + JSON.stringify(stack);"
    },
    errors: [
      '把 push 的返回值当成新数组用：它返回的是长度这个数字',
      '对空数组 pop：返回 undefined，不会报错，所以很容易静默出错',
      '在 Vue/React 里直接 push 却发现界面没更新：某些框架不侦测这种原地修改'
    ],
    related: ['js-splice', 'js-slice', 'js-join']
  },

  {
    id: 'js-join', name: 'array.join()', zh: '拼成字符串',
    purpose: '把数组所有项用一个分隔符连成一个字符串。想反过来（字符串变数组）用 split。',
    syntax: "arr.join('分隔符')\narr.join('')      // 不要分隔符",
    status: 'modern',
    keywords: ['拼接', '连接', '字符串', 'join'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const tags = ['HTML', 'CSS', 'JS'];\ndocument.getElementById('out').textContent =\n  \"join(', ') → \" + tags.join(', ') + '\\n' +\n  \"join(' / ') → \" + tags.join(' / ') + '\\n' +\n  \"join('') → \" + tags.join('') + '\\n' +\n  '不写参数 → ' + tags.join();"
    },
    errors: [
      '数组里含 null / undefined：join 会转成空字符串，不会显示 "null"',
      '想拼 HTML 列表时用了 join 又没转义内容：如果项里含特殊字符可能出事'
    ],
    related: ['js-split', 'js-map']
  },

  {
    id: 'js-split', name: 'string.split()', zh: '字符串切分',
    purpose: '按分隔符把字符串切成数组。和 join 正好是一对反操作。',
    syntax: "str.split('分隔符')",
    status: 'modern',
    keywords: ['切分', '拆分', '字符串', '数组', 'split'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const s = '苹果,香蕉,橘子';\nconsole.log(s.split(','));          // 三个元素\ndocument.getElementById('out').textContent =\n  \"split(',') → \" + JSON.stringify(s.split(',')) + '\\n' +\n  \"split('') → \" + JSON.stringify(s.split('')) + '\\n' +\n  '连起来再切：' + s.split(',').join(' + ');"
    },
    errors: [
      '分隔符写错：切不开就得到只有一个元素的数组',
      '以为 split 会去掉空白：每一项的前后空格还在，要配合 trim',
      '对非字符串用 split：数字没有这个方法，会报错'
    ],
    related: ['js-join', 'js-trim']
  },

  {
    id: 'js-trim', name: 'string.trim()', zh: '去掉首尾空白',
    purpose: '去掉字符串两端的空格、换行、制表符。校验用户输入时几乎必用。',
    syntax: 'str.trim()',
    status: 'modern',
    keywords: ['去空格', '首尾', 'trim', '输入校验'],
    example: {
      html: '<input id="in" type="text" value="   前后都有空格   ">\n<button id="b">判断是否为空</button>\n<p id="out"></p>',
      css: 'input { padding: 6px 10px; width: 220px; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const raw = document.getElementById('in').value;\n  document.getElementById('out').textContent =\n    '原始长度 ' + raw.length + '，trim 之后长度 ' + raw.trim().length + '\\n' +\n    'trim 后是空字符串吗？' + (raw.trim() === '');\n});"
    },
    errors: [
      '校验输入时忘了 trim：用户打几个空格就能"通过"必填校验',
      '以为 trim 会去掉中间的空格：只去首尾，中间的要 replace'
    ],
    related: ['js-split', 'attr-required']
  },

  {
    id: 'js-sort', name: 'array.sort()', zh: '排序',
    purpose: '给数组排序。**默认按字符串比较**，所以排序数字时必须自己提供比较函数 —— 这是新手最常翻车的地方之一。',
    syntax: 'arr.sort()                    // 按字符串排，数字会出错\narr.sort((a, b) => a - b)      // 数字升序\narr.sort((a, b) => b - a)      // 数字降序',
    status: 'modern',
    keywords: ['排序', 'sort', '比较函数', '升序', '降序'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const nums = [10, 9, 100, 1];\nconst bad = [...nums].sort();                     // 默认排序（按字符串）\nconst good = [...nums].sort((a, b) => a - b);     // 正确做法\ndocument.getElementById('out').textContent =\n  '原始：      ' + JSON.stringify(nums) + '\\n' +\n  '默认排序：  ' + JSON.stringify(bad) + '   ← 100 跑到前面了\\n' +\n  '数字排序：  ' + JSON.stringify(good);"
    },
    errors: [
      '排数字不写比较函数：它会把数字转成字符串比，"10" < "9" 于是 100 排到了最前面',
      '以为 sort 返回新数组：它改的是原数组，而且返回的也是同一个数组。要保留原顺序先复制',
      '比较函数忘记 return：会按 undefined 处理，排序结果随机'
    ],
    related: ['js-map', 'js-filter', 'js-foreach'],
    tip: '<b>为什么默认会出错</b>：sort 默认把元素转成字符串再按字典序比。"100" 和 "9" 比，先比第一个字符 "1" 和 "9"，1 更小，所以 100 排在前面。<b>排数字永远要写 (a, b) =&gt; a - b</b>。'
  },

  {
    id: 'js-json-parse', name: 'JSON.parse()', zh: '字符串转对象',
    purpose: '把符合 JSON 格式的字符串解析成 JS 对象/数组。常用于读接口返回的数据或本地存储。',
    syntax: 'const obj = JSON.parse(字符串)',
    status: 'modern',
    keywords: ['json', '解析', '转换', '对象', 'parse'],
    example: {
      html: '<button id="b">解析两个字符串</button>\n<p id="out"></p>',
      css: 'p { font: 14px/1.7 monospace; white-space: pre-wrap; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const ok = '{ \"name\": \"小明\", \"age\": 17 }';\n  const bad = \"{ 'name': '小明', }\";        // 单引号 + 尾逗号，不是合法 JSON\n  let msg = '正常那个：' + JSON.stringify(JSON.parse(ok)) + '\\n';\n  try {\n    JSON.parse(bad);\n  } catch (e) {\n    msg += '出错那个：' + e.message;\n  }\n  document.getElementById('out').textContent = msg;\n});"
    },
    errors: [
      'JSON 里用单引号或尾逗号：JS 对象可以，JSON 不行，会抛 "Unexpected token"',
      '不写 try/catch：数据格式一旦不对就整个脚本崩掉',
      'JSON 里的键必须用双引号：{ name: "x" } 不是合法 JSON'
    ],
    related: ['js-json-stringify'],
    tip: '<b>JSON 不是 JavaScript 对象</b>：它是"文本格式"，规则更严 —— 键必须双引号、不能有注释、不能有尾逗号、不能是 undefined。'
  },

  {
    id: 'js-json-stringify', name: 'JSON.stringify()', zh: '对象转字符串',
    purpose: '把 JS 值转成 JSON 字符串。常用于存本地、发请求，以及调试时打印对象全貌。',
    syntax: 'const s = JSON.stringify(对象, null, 2)',
    status: 'modern',
    keywords: ['json', '序列化', '转字符串', 'stringify', '调试'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 14px/1.7 monospace; white-space: pre-wrap; }',
      js: "const user = { name: '小明', age: 17, tags: ['a', 'b'] };\nconsole.log('直接打印对象看不全：', user);\nconsole.log('转成字符串就完整了：', JSON.stringify(user));\ndocument.getElementById('out').textContent =\n  JSON.stringify(user, null, 2);"
    },
    errors: [
      '以为能转所有东西：函数、undefined、Symbol 会被丢掉，循环引用的对象会直接报错',
      '存本地存储时忘了转字符串：localStorage 只能存字符串，存对象会变成 "[object Object]"',
      '滥用它做深拷贝：会把 Date 变成字符串、丢掉 undefined，要深拷贝用 structuredClone'
    ],
    related: ['js-json-parse'],
    tip: '<b>调试时的小技巧</b>：console.log 打印对象时展开很麻烦，写 <b>console.log(JSON.stringify(obj, null, 2))</b> 能一次看到完整内容。'
  },

  {
    id: 'js-parseint', name: 'parseInt() / parseFloat()', zh: '字符串转数字',
    purpose: '把字符串开头的数字部分解析成整数或小数。输入框里的值都是字符串，计算前得转。',
    syntax: 'parseInt(字符串, 10)\nparseFloat(字符串)',
    status: 'modern',
    keywords: ['转换', '数字', '整数', 'parseInt', 'parseFloat'],
    example: {
      html: '<input id="a" type="text" value="12">\n<input id="b" type="text" value="5">\n<button id="go">相加</button>\n<p id="out"></p>',
      css: 'input { width: 70px; padding: 6px 8px; }',
      js: "document.getElementById('go').addEventListener('click', function () {\n  const a = document.getElementById('a').value;\n  const b = document.getElementById('b').value;\n  const wrong = a + b;                      // 字符串相加 = 拼接\n  const right = parseInt(a, 10) + parseInt(b, 10);\n  document.getElementById('out').textContent =\n    '直接 a + b = ' + wrong + '   ← 变成了拼接！\\n' +\n    'parseInt 之后 = ' + right;\n});"
    },
    errors: [
      '忘了写第二个参数 10：老式写法可能把 "08" 当八进制解析，永远显式写 10',
      '对非数字字符串用：parseInt("abc") 返回 NaN，而 NaN 参与运算会污染整个结果',
      '以为 parseFloat("1.2.3") 会报错：它返回 1.2，后面的直接忽略'
    ],
    related: ['js-number', 'concept-function'],
    tip: '<b>输入框的 .value 永远是字符串</b>。这就是为什么 "1" + "1" 得到 "11" 而不是 2 —— 做算术前必须先转数字。'
  },

  {
    id: 'js-setTimeout', name: 'setTimeout() / setInterval()', zh: '定时器',
    purpose: 'setTimeout 延迟一段时间后执行一次；setInterval 每隔一段时间反复执行。两者都返回一个 id，用来取消。',
    syntax: 'const id = setTimeout(函数, 毫秒)\nclearTimeout(id)',
    status: 'modern',
    keywords: ['定时', '延迟', '延时', '循环', 'setTimeout', 'setInterval'],
    example: {
      html: '<p id="out">等着…</p>\n<button id="stop">取消（趁 2 秒内点）</button>',
      css: 'p { font-size: 16px; }',
      js: "const out = document.getElementById('out');\nlet n = 0;\nconst timer = setInterval(function () {\n  n++;\n  out.textContent = '已经过了 ' + n + ' 秒';\n  if (n >= 5) clearInterval(timer);\n}, 1000);\n\ndocument.getElementById('stop').addEventListener('click', function () {\n  clearInterval(timer);\n  out.textContent = '被取消了';\n});"
    },
    errors: [
      '忘了 clearInterval：定时器会一直跑，离开页面也不停（内存泄漏）',
      '以为 setTimeout(fn, 0) 是"立刻执行"：它是"尽快插入队列"，仍然会等当前同步代码跑完',
      'setInterval 里做耗时操作：上一次还没跑完下一次就来了，会堆积。耗时任务应该用 setTimeout 递归'
    ],
    related: ['concept-function', 'js-consolelog']
  },

  {
    id: 'js-consolelog', name: 'console.log()', zh: '控制台输出',
    purpose: '把内容打印到浏览器开发者工具的控制台。调试的第一件工具。',
    syntax: 'console.log(值1, 值2, …)',
    status: 'modern',
    keywords: ['控制台', '打印', '调试', 'log', 'console'],
    example: {
      html: '<p id="out">按 F12 或右键→检查，切到「控制台」标签看看</p>',
      css: 'p { font-size: 15px; }',
      js: "console.log('普通信息');\nconsole.warn('警告信息');\nconsole.error('错误信息');\nconsole.log('多个值', 1, 2, { a: 3 });\nconsole.table([{ n: 'A', v: 1 }, { n: 'B', v: 2 }]);"
    },
    errors: [
      '调试完忘了删：上线后满屏日志，还可能把内部数据打出来',
      '打印对象看到的是"当前值"：控制台里展开的对象是实时更新的，想定格要用 JSON.stringify 或 console.log(JSON.parse(JSON.stringify(o)))',
      '以为 console 是标准 API：它不在 ECMAScript 标准里，是浏览器/Node 提供的宿主对象'
    ],
    related: ['js-json-stringify', 'js-setTimeout']
  },

  {
    id: 'js-fetch', name: 'fetch()', zh: '发起网络请求',
    purpose: '向服务器要数据（拿到的是 Promise）。现代浏览器里替代老的 XMLHttpRequest。',
    syntax: "fetch('地址').then(res => res.json()).then(data => …)",
    status: 'modern',
    keywords: ['请求', '接口', 'ajax', '网络', 'fetch', 'promise'],
    example: {
      html: '<button id="b">试着请求一下</button>\n<p id="out"></p>',
      css: 'p { font: 14px/1.7 monospace; white-space: pre-wrap; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const out = document.getElementById('out');\n  out.textContent = '请求中…';\n  fetch('https://example.com/api')\n    .then(function (res) { return res.json(); })\n    .then(function (data) { out.textContent = '成功：' + JSON.stringify(data); })\n    .catch(function (err) {\n      out.textContent = '失败了：' + err.message +\n        '\\n\\n如果你是用双击 index.html 的方式打开，这个失败是正常的 ——' +\n        '浏览器的安全策略禁止 file:// 页面发跨域请求。';\n    });\n});"
    },
    errors: [
      '以为网络错误会被 then 捕获：服务器返回 404 / 500 时 fetch 仍然算"成功"，要自己判断 res.ok',
      '在 file:// 打开的页面里用 fetch：会被浏览器直接拦掉，必须起本地服务器',
      '忘了 .catch：请求失败时静默无反应，用户只看到页面一直转圈'
    ],
    related: ['js-promise', 'js-json-parse'],
    tip: '<b>这条示例故意演示了一种常见困惑</b>：如果你双击打开本页（地址栏是 file://），点按钮会失败；起个本地服务器用 http://localhost 打开就会是"网络其实不通但请求发出去了"。这不是代码 bug，是浏览器的安全机制。'
  },

  {
    id: 'js-promise', name: 'Promise', zh: '承诺对象',
    purpose: '表示"一件以后才会有结果的事"。fetch、定时器、读写文件都用它。用 then 处理成功、catch 处理失败，或者用 async/await 写得更像同步代码。',
    syntax: 'Promise.resolve(值).then(值 => …)\nasync function f() { const x = await 某个Promise; }',
    status: 'modern',
    keywords: ['异步', 'promise', 'then', 'async', 'await'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 14px/1.7 monospace; white-space: pre-wrap; }',
      js: "function wait(ms, value) {\n  return new Promise(function (resolve) {\n    setTimeout(function () { resolve(value); }, ms);\n  });\n}\n\nasync function main() {\n  const out = document.getElementById('out');\n  out.textContent = '开始…';\n  const a = await wait(400, '第一步好了');\n  out.textContent += '\\n' + a;\n  const b = await wait(400, '第二步也好了');\n  out.textContent += '\\n' + b;\n  out.textContent += '\\n（注意：代码是「等」出来的顺序，但没有卡住页面）';\n}\nmain();"
    },
    errors: [
      '忘了 await：拿到的是 Promise 对象而不是结果，后面会得到 undefined',
      'await 写在普通函数里：await 只能在 async 函数里用，否则语法错误',
      '忘了 try/catch：await 一个失败的 Promise 会抛异常，没接住就变成未捕获错误'
    ],
    related: ['js-fetch', 'concept-function'],
    tip: '<b>如果这块看不懂，先跳过</b>。异步是 JS 里最难的部分，等你写过几次 fetch 再回来看会豁然开朗。'
  },

  {
    id: 'js-length', name: 'length', zh: '长度',
    purpose: '字符串有几个字符、数组有几项。属性不是方法，所以不加括号。',
    syntax: 'str.length\narr.length',
    status: 'modern',
    keywords: ['长度', '个数', 'length', '属性'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const s = 'hello';\nconst arr = [1, 2, 3, 4];\nconsole.log(s.length);\nconsole.log(arr.length);\ndocument.getElementById('out').textContent =\n  '\"hello\".length = ' + s.length + '\\n' +\n  '[1,2,3,4].length = ' + arr.length + '\\n' +\n  '注意：不加括号，它不是函数';"
    },
    errors: [
      '写成 arr.length()：length 是属性不是方法，加括号会报 "not a function"',
      '用它判断空数组：length === 0 可以，但别写 if (arr.length) 来判空（0 是 falsy，其实这样写也对，但可读性差）',
      '字符串的 length 按 UTF-16 码元算：emoji 和部分生僻字会计成 2'
    ],
    related: ['concept-method', 'js-indexof'],
    tip: '<b>属性 vs 方法</b>：<b>length</b> 是属性（不加括号），<b>slice()</b> 是方法（要加括号）。看到括号就是"要执行一段代码"，没有括号就是"读一个已经存在的值"。'
  },

  {
    id: 'js-number', name: 'Number() / toFixed()', zh: '数字转换与小数位',
    purpose: 'Number() 把值转成数字；toFixed(n) 把数字保留 n 位小数（返回的是字符串）。',
    syntax: 'Number("12")      // 12\ntoFixed(2)        // "12.00"（字符串）',
    status: 'modern',
    keywords: ['数字', '小数', '保留位数', 'number', 'toFixed', 'NaN'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const price = 19.9788;\nconst s = price.toFixed(2);\nconsole.log(typeof s);        // string！\ndocument.getElementById('out').textContent =\n  '原值：' + price + '\\n' +\n  'toFixed(2)：' + s + '（类型是 ' + typeof s + '）\\n' +\n  '想再算数要转回来：' + (Number(s) * 2) + '\\n' +\n  'Number(\"abc\") = ' + Number('abc') + '   ← 转不了就是 NaN';"
    },
    errors: [
      '拿 toFixed 的结果直接做运算：它是字符串，"12" + 1 会变成 "121"',
      '用 toFixed 算钱：它有舍入误差，金额计算应该用整数分或专门的库',
      '不判断 NaN：NaN === NaN 是 false，要用 Number.isNaN() 判断'
    ],
    related: ['js-parseint'],
    tip: '<b>toFixed 返回字符串</b>，这是很常见的坑。要小数位又要继续算，得再包一层 Number()。'
  },

  {
    id: 'js-document-write', name: 'document.write()', zh: '写入文档（不推荐）',
    purpose: '往页面里写内容。在页面加载完成后调用它，会清空整个页面。',
    syntax: 'document.write(内容)   ← 不要再用',
    status: 'deprecated',
    keywords: ['写入', '输出', '不推荐', '过时', 'write'],
    example: {
      html: '<p>这个示例不会真的调用 document.write —— 因为页面加载完之后调用它，会把整页清空，示例就没法看了。</p>\n<button id="b">显示正确做法</button>\n<p id="out"></p>',
      css: 'p { font-size: 15px; }',
      js: "document.getElementById('b').addEventListener('click', function () {\n  const out = document.getElementById('out');\n  out.textContent =\n    '❌ 旧写法：document.write(\"文字\") —— 页面加载完再调用会清空整页\\n' +\n    '✅ 正确做法：先用 document.createElement 造元素，再 appendChild 插进去';\n});"
    },
    errors: [
      '在页面加载完之后调用：会把整个文档替换掉，用户看到空白页',
      '看到老教程里的 document.write 就照抄 —— 那是 2005 年前后的写法',
      '想"输出调试信息"却用 document.write：应该用 console.log'
    ],
    related: ['js-createelement', 'js-appendchild', 'js-consolelog'],
    tip: '<b>为什么它还存在</b>：有些老网站的统计脚本还在用，浏览器为了兼容不敢删。但你写新代码时没有理由用它。'
  },

  {
    id: 'js-substr', name: 'string.substr()', zh: '截取子串（已废弃）',
    purpose: '按「起点 + 长度」截取字符串。因为参数含义容易和 slice 搞混，规范已不推荐使用。',
    syntax: 'str.substr(起点, 长度)   ← 已被废弃，请改用 slice',
    status: 'deprecated',
    keywords: ['截取', '子串', '废弃', '过时', 'substr', 'substring'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const s = 'ABCDEFG';\nconst a = s.slice(1, 4);        // 起点 1，结束 4（不含）\ndocument.getElementById('out').textContent =\n  '原字符串：' + s + '\\n' +\n  '✅ s.slice(1, 4) = ' + a + '   （从 1 到 4，不含 4）\\n' +\n  '❌ s.substr(1, 4) 也能用，但第二个参数是「长度」而不是「结束位置」，\\n' +\n  '   两个函数太像、含义不同，规范已经不推荐 substr。\\n' +\n  '   而且 substr 处理负数参数的行为各浏览器不一致，踩过一次坑就懂了。';"
    },
    errors: [
      '把 substr 和 substring 和 slice 混着用：三者参数含义都不同，最容易出错',
      '用 substr 处理负数起点：行为不统一，别依赖'
    ],
    related: ['js-slice', 'js-indexof'],
    tip: '<b>统一用 slice 就好</b>：slice(起点, 结束位置)，结束位置不含。数组和字符串都用同一个规则，记一次就够。'
  }

];
