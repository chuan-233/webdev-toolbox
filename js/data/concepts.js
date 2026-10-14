/* ==========================================================================
   基础概念 词条
   --------------------------------------------------------------------------
   这一组不是「某个具体语法」，而是把最容易混的几个词摆在一起讲清楚：
   标签 / 元素 / HTML 属性 / CSS 属性 / 选择器 / 变量 / 函数 / 方法 / 参数 / 对象 …
   如果你总觉得「这几个词好像差不多又不太一样」，先看这一组。
   ========================================================================== */

window.WDT_CONCEPTS = [

  {
    id: 'concept-tag', name: '标签 Tag', zh: 'element type',
    purpose: 'HTML 里用尖括号写出来的「名字」，比如 <p>、<img>。它规定这一块是什么东西，但不包含具体内容。',
    syntax: '<p>          ← 开始标签\n</p>         ← 结束标签\n<img>        ← 空元素，没有结束标签',
    status: 'modern',
    keywords: ['标签', 'tag', '尖括号', '开始标签', '结束标签', '空元素'],
    example: {
      html: '<p>这里 <strong>p</strong> 是标签，中间的文字是内容。</p>\n<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2720%27%3E%3Crect width=%2740%27 height=%2720%27 fill=%27%23ff9e64%27/%3E%3C/svg%3E" alt="示例">\n<p>上面的 img 是空元素，不写结束标签。</p>',
      css: '',
      js: ''
    },
    errors: [
      '把 <img>、<br>、<input>、<meta>、<link> 写成有结束标签的形式',
      '标签名拼错：浏览器会把不认识的标签当成一个普通的行内元素，不报错但样式全乱'
    ],
    related: ['concept-element', 'concept-html-attr'],
    tip: '<b>标签管「是什么」，属性管「怎么样的」，中间的文字管「说什么」。</b>&lt;p class="hi"&gt;你好&lt;/p&gt; —— p 是标签，class="hi" 是属性，你好是内容。'
  },

  {
    id: 'concept-element', name: '元素 Element', zh: 'tag + content',
    purpose: '「开始标签 + 内容 + 结束标签」合起来才叫一个元素。<p>这是文字</p> 整体是一个 p 元素。',
    syntax: '<p class="hi">这是文字</p>\n└────── 一个完整的 p 元素 ──────┘',
    status: 'modern',
    keywords: ['元素', 'element', '节点', 'node'],
    example: {
      html: '<p id="demo">我整个是一个元素，包含标签、属性和文字。</p>',
      css: '#demo { background: #fff3cd; padding: 8px; }',
      js: "const el = document.getElementById('demo');\nconsole.log('这是元素对象：', el);\nconsole.log('它的标签名是：', el.tagName);\nconsole.log('它里面的文字是：', el.textContent);"
    },
    errors: [
      '把「标签」和「元素」当同义词：日常聊天混着说没关系，但看文档时需要分清 —— 「p 标签」通常指 &lt;p&gt; 这个名，而「p 元素」指的是带内容的那一整块'
    ],
    related: ['concept-tag', 'concept-dom'],
    tip: '<b>在 JS 里，元素是一个对象</b>。所以 document.getElementById() 拿到的是一个元素对象，可以读它的 .textContent、调它的 .appendChild()。'
  },

  {
    id: 'concept-html-attr', name: 'HTML 属性 Attribute', zh: '写在开始标签里',
    purpose: '写在开始标签的尖括号里，用来配置这个元素：href 给链接指定目标、class 给它分类、src 给图片指定来源。',
    syntax: '<a href="https://example.com" class="btn" target="_blank">文字</a>\n   └──────────── 这些是 HTML 属性 ────────────┘',
    status: 'modern',
    keywords: ['属性', 'attribute', '标签属性', 'class', 'href', 'src'],
    example: {
      html: '<a href="https://example.com" class="btn" title="提示文字">一个配了三种属性的链接</a>',
      css: '.btn { display: inline-block; padding: 8px 18px; background: #2f6fdd; color: #fff; border-radius: 8px; text-decoration: none; }',
      js: ''
    },
    errors: [
      '属性名拼错：不报错、不提示，只是这个配置静默失效',
      '把 CSS 的写法混进 HTML：写 <p style="margin: 0"> 属于"内联样式"，偶尔应急可以，长期应该搬到 CSS 文件里',
      '以为所有属性都能加在任何标签上：href 加在 <img> 上没有任何作用（<img> 用的是 src）'
    ],
    related: ['concept-css-prop', 'concept-html-attr-vs-css', 'concept-tag'],
    tip: '<b>HTML 属性和 CSS 属性是两套东西</b>：写在 HTML 标签里的是 HTML 属性；写在 CSS 花括号里的是 CSS 属性。点击下面的「相关概念」看详细区别。'
  },

  {
    id: 'concept-css-prop', name: 'CSS 属性 Property', zh: '写在花括号里',
    purpose: '写在 CSS 规则的花括号里，用「属性: 值;」的形式描述外观。颜色、大小、间距、布局都归它管。',
    syntax: '选择器 {\n  属性: 值;\n}\n\np {\n  color: #333;\n  font-size: 16px;\n}',
    status: 'modern',
    keywords: ['css属性', 'property', '样式', '花括号'],
    example: {
      html: '<p class="demo">我的颜色、字号、间距全都由 CSS 属性控制。</p>',
      css: '.demo {\n  color: #2f6fdd;\n  font-size: 18px;\n  padding: 12px 16px;\n  background: #eef2ff;\n  border-radius: 8px;\n}',
      js: ''
    },
    errors: [
      '属性名写成驼峰：fontSize 在 CSS 里要写 font-size（带连字符）；但在 JS 里设置时又要写驼峰 el.style.fontSize —— 两边写法不一样',
      '漏写冒号或分号：整条声明被浏览器丢弃 —— CSS 出问题时不报错，只是"没生效"，很难查',
      '给同一个元素同时设 width 和 padding 却忘了 box-sizing：总宽超出预期'
    ],
    related: ['concept-html-attr', 'concept-html-attr-vs-css', 'css-box-sizing'],
    tip: '<b>CSS 的容错方式是「跳过」</b>：写错一条声明，浏览器只是忽略它，不报错。所以 CSS 调试的第一件事是打开开发者工具看那条属性有没有被划掉。'
  },

  {
    id: 'concept-html-attr-vs-css', name: 'HTML 属性 vs CSS 属性', zh: '最容易混的一对',
    purpose: '两个都叫「属性」，但一个写在 HTML 标签里管结构，一个写在 CSS 花括号里管外观。这是初学者最先混的地方。',
    syntax: '<p class="big">文字</p>       ← class 是 HTML 属性\n\n.big { font-size: 24px; }   ← font-size 是 CSS 属性',
    status: 'modern',
    keywords: ['区别', '混淆', 'html属性', 'css属性', '对比'],
    example: {
      html: '<p class="big">这一段的字号由 CSS 属性 font-size 控制。</p>\n<p style="font-size: 24px">这一行用的是内联样式 —— 也能用，但不推荐长期这么写。</p>',
      css: '.big {\n  font-size: 24px;      /* ← CSS 属性 */\n  color: #1a6f8f;\n}',
      js: ''
    },
    errors: [
      '在 HTML 标签里写 font-size：<p font-size="24px"> 完全不生效',
      '在 CSS 里写 href：p { href: "..." } 不存在这个 CSS 属性',
      '把 HTML 的 class 属性名和 CSS 的 .类名选择器当成一个东西'
    ],
    related: ['concept-html-attr', 'concept-css-prop', 'concept-selector', 'attr-class'],
    tip: '<b>三句话分清</b>：<br>① <b>HTML 属性</b>写在标签尖括号里，管"这个元素是什么/连到哪"；<br>② <b>CSS 属性</b>写在花括号里，管"长什么样"；<br>③ <b>选择器</b>用来"选中要改外观的元素"，就是 CSS 花括号前面那部分。'
  },

  {
    id: 'concept-selector', name: '选择器 Selector', zh: '选中元素的方式',
    purpose: 'CSS 花括号前面那一部分，用来指定「这条样式要作用在哪些元素上」。JS 的 querySelector 也用同一套语法。',
    syntax: 'p            { }   标签选择器\n.card        { }   类选择器（点号）\n#header      { }   id 选择器（井号）\n.card .title { }   后代（空格）\n.card:hover  { }   伪类（冒号）',
    status: 'modern',
    keywords: ['选择器', 'selector', '类名', 'id', '伪类', 'css选择器'],
    example: {
      html: '<p>我是标签选择器选中的</p>\n<p class="card">我有 card 类</p>\n<p id="only">我有唯一 id</p>\n<div class="card"><span class="title">我是 card 里面的 title</span></div>',
      css: 'p { color: #8b93a1; }\n.card { color: #2f6fdd; }\n#only { color: #c03a52; font-weight: 700; }\n.card .title { background: #fff3cd; padding: 2px 6px; border-radius: 4px; }',
      js: "console.log('CSS 选择器语法也能直接给 JS 用：');\nconsole.log(document.querySelector('.card .title').textContent);"
    },
    errors: [
      '类选择器忘了点号：写 card { } 是在找 card 标签，不是 class="card"',
      'id 选择器写成 .：.only { } 是在找 class="only"，不是 id="only"',
      '优先级搞不清：id 选择器 > 类选择器 > 标签选择器。样式不生效先查这个，别急着加 !important'
    ],
    related: ['attr-class', 'attr-id', 'js-queryselector', 'concept-html-attr-vs-css'],
    tip: '<b>这套语法学一次，三处都能用</b>：CSS 里用它写样式、JS 里用它取元素（querySelector）、调试时在控制台用它临时验证。所以它是前端最值得先练熟的东西之一。'
  },

  {
    id: 'concept-variable', name: '变量 Variable', zh: '给值起个名字',
    purpose: '把值存起来并起个名字，后面用名字引用它。JS 里用 let（会变的）和 const（不会重新赋值的）声明。',
    syntax: "let count = 0;          // 以后还会变\nconst name = '小明';    // 不再重新赋值",
    status: 'modern',
    keywords: ['变量', 'variable', 'let', 'const', 'var', '赋值'],
    example: {
      html: '<button id="b">点一次加一</button>\n<p id="out">还没点</p>',
      css: 'p { font-size: 16px; }',
      js: "let count = 0;                        // 会变的，用 let\nconst btn = document.getElementById('b');   // 不会换的，用 const\n\nbtn.addEventListener('click', function () {\n  count = count + 1;\n  document.getElementById('out').textContent = '点了 ' + count + ' 次';\n});"
    },
    errors: [
      '给 const 声明的变量重新赋值：直接报 "Assignment to constant variable"',
      '用 var：它是旧写法，作用域规则反直觉（会"提升"、不受块级限制），新代码用 let/const',
      '起名太随意（a、b、x1）：过两天自己都看不懂',
      '"还没声明就用"：let/const 有暂时性死区，在声明之前访问会直接报错，而不是得到 undefined'
    ],
    related: ['concept-function', 'concept-object'],
    tip: '<b>let 还是 const 怎么选</b>：默认写 const，只有确实需要重新赋值时才改成 let。这样别人读代码时一眼就知道"这个名字不会变"。'
  },

  {
    id: 'concept-function', name: '函数 Function', zh: '一段可复用的代码',
    purpose: '把一段代码包起来起个名字，需要时调用它。接收输入（参数），可以给出输出（返回值）。',
    syntax: 'function 名字(参数) {\n  return 结果;\n}\n\n名字(实参);',
    status: 'modern',
    keywords: ['函数', 'function', '调用', '返回', '参数'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "// 定义：接收两个参数，返回计算结果\nfunction add(a, b) {\n  return a + b;\n}\n\n// 调用：传入具体的值\ndocument.getElementById('out').textContent =\n  'add(2, 3) = ' + add(2, 3) + '\\n' +\n  'add(10, 20) = ' + add(10, 20) + '\\n' +\n  '定义了一次，可以调用无数次。';"
    },
    errors: [
      '函数里忘了 return：调用结果会是 undefined',
      '以为 return 之后的代码还会执行：return 会立刻结束函数',
      '定义在调用之后（用 function 声明是可以的，但用 const f = () => {} 就不行，会报错）',
      '搞混参数和实参：定义时写的是「形参」，调用时传进去的是「实参」'
    ],
    related: ['concept-method', 'concept-param', 'js-parseint'],
    tip: '<b>函数 vs 方法</b>：独立的叫函数（parseInt、setTimeout）；挂在某个对象上的叫方法（arr.map、el.addEventListener）。<b>方法本质就是"属于某个对象的函数"。</b>'
  },

  {
    id: 'concept-method', name: '方法 Method', zh: '属于对象的函数',
    purpose: '挂在某个对象上的函数。用「对象.方法名()」调用，比如 arr.push()、el.addEventListener()。',
    syntax: '对象.方法名(参数)\n\narr.push(值)\nel.addEventListener("click", fn)',
    status: 'modern',
    keywords: ['方法', 'method', '点号', '调用', '对象'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const arr = [1, 2, 3];\n\n// push 是「数组对象」上的方法\narr.push(4);\n\n// toUpperCase 是「字符串对象」上的方法\nconst up = 'hello'.toUpperCase();\n\ndocument.getElementById('out').textContent =\n  'arr.push(4) 之后：' + JSON.stringify(arr) + '\\n' +\n  \"'hello'.toUpperCase() → \" + up + '\\n' +\n  '↑ 都是「某个对象上的方法」，用点号调用。';"
    },
    errors: [
      '把方法当属性用：arr.length 是属性（不加括号），arr.push() 是方法（要加括号）',
      '对数字用字符串方法：123.toUpperCase() 会报错，因为数字对象上没有这个方法',
      '以为方法能随便跨类型用：每个方法只属于特定类型的对象'
    ],
    related: ['concept-function', 'concept-param', 'js-length', 'js-push'],
    tip: '<b>一眼分辨属性和方法</b>：后面有括号 → 方法（会执行一段代码）；没括号 → 属性（读一个已经存在的值）。'
  },

  {
    id: 'concept-param', name: '参数与返回值', zh: 'parameter / return',
    purpose: '参数是「喂进去的东西」，返回值是「吐出来的结果」。函数靠这两样和外界交换数据。',
    syntax: 'function 加(a, b) {   ← a、b 是参数（形参）\n  return a + b;    ← 返回值\n}\n\n加(2, 3)            ← 2、3 是实参',
    status: 'modern',
    keywords: ['参数', '实参', '形参', '返回值', 'return', 'argument'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "function greet(name) {        // name 是形参\n  return '你好，' + name;      // 返回值\n}\n\nconsole.log(greet('小明'));     // '小明' 是实参\nconsole.log(greet('小红'));\n\n// 有些方法不返回东西，只做事\nconst arr = [1];\narr.push(2);                    // 有返回值，但要看清是什么\nconsole.log(JSON.stringify(arr));\n\ndocument.getElementById('out').textContent =\n  greet('小明') + '\\n' +\n  '注意：arr.push() 返回的是新长度，不是数组本身';"
    },
    errors: [
      '以为参数名必须和外面一致：参数名只在函数内部有效，叫什么都行',
      '数错参数个数：多传会被忽略，少传会得到 undefined（不报错，静默出错）',
      '把方法的返回值当成了别的东西：push 返回长度、forEach 返回 undefined、map 返回新数组 —— 这几个最容易记反'
    ],
    related: ['concept-function', 'concept-method', 'js-push', 'js-foreach'],
    tip: '<b>查文档时先看两个地方</b>：这个函数要什么参数（括号里）、它返回什么（Return value）。大多数"用了没效果"的问题都出在这两处。'
  },

  {
    id: 'concept-object', name: '对象 Object', zh: '一堆键值对',
    purpose: '把相关的数据打包在一起，用「键: 值」的形式，用点号或方括号读取。',
    syntax: "const user = {\n  name: '小明',\n  age: 17\n};\n\nuser.name        // '小明'\nuser['age']      // 17",
    status: 'modern',
    keywords: ['对象', 'object', '键值对', '属性', 'json'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "const user = {\n  name: '小明',\n  age: 17,\n  tags: ['读者', '会员']\n};\n\nconsole.log(user.name);\nconsole.log(user['age']);\nuser.age = 18;                       // 改一个值\nuser.city = '重庆';                  // 加一个新键\n\ndocument.getElementById('out').textContent =\n  JSON.stringify(user, null, 2);"
    },
    errors: [
      '把对象和 JSON 混为一谈：对象是 JS 里的东西，JSON 是一种文本格式（键必须双引号、不能有函数）',
      '读不存在的键：返回 undefined，不报错，然后你会在下一步出错',
      '把对象属性叫成"方法"：user.name 是属性，user.sayHi() 才是方法'
    ],
    related: ['js-json-stringify', 'concept-variable', 'concept-method'],
    tip: '<b>对象属性也常被叫「属性」，这是第三个「属性」</b>：HTML 属性、CSS 属性、对象属性。看上下文就能分清 —— 在 HTML 标签里、在 CSS 花括号里、在 JS 对象的键里。'
  },

  {
    id: 'concept-expression', name: '表达式 vs 语句', zh: '有值 vs 要做的事',
    purpose: '表达式是「能算出一个值的片段」（1 + 2、a > b）；语句是「让程序做一件事的指令」（let x = 1、if (...)）。',
    syntax: '1 + 2              ← 表达式（有值）\nlet x = 1 + 2;     ← 语句（做了一件事）\nconsole.log(x);    ← 语句',
    status: 'modern',
    keywords: ['表达式', '语句', 'expression', 'statement'],
    example: {
      html: '<p id="out"></p>',
      css: 'p { font: 15px/1.7 monospace; white-space: pre-wrap; }',
      js: "// 表达式可以直接放进 console.log 里\nconsole.log(1 + 2);\nconsole.log(10 > 3);\n\n// 语句不能\n// console.log(let x = 1);   ← 这会报错\n\n// if 的条件位置要放表达式\nif (10 > 3) {\n  document.getElementById('out').textContent =\n    '在 if(...) 和 console.log(...) 的括号里，你写的都是「表达式」（有值的东西）。';\n}"
    },
    errors: [
      '在需要表达式的地方写了语句：比如 console.log(let x = 1) 或 if (let y = 2)',
      '箭头函数的简写只能用于表达式：() => { return 1 } 可以简写成 () => 1，但里面是语句就不能省花括号'
    ],
    related: ['concept-variable', 'concept-function']
  },

  {
    id: 'concept-dom', name: 'DOM', zh: '页面在 JS 里的样子',
    purpose: '浏览器把 HTML 解析成一棵「节点树」并把它们变成 JS 对象，这棵树就叫 DOM。JS 通过 DOM 读写页面。',
    syntax: 'HTML 文本  →（浏览器解析）→  DOM 对象树  →（JS 操作）\n\ndocument.getElementById()\nel.textContent = …',
    status: 'modern',
    keywords: ['dom', '文档对象模型', '节点', 'document', '操作页面'],
    example: {
      html: '<div id="box"><p>原来的第一段</p></div>\n<button id="b">用 JS 改这个盒子</button>',
      css: '#box { border: 1px solid #ccd2dc; padding: 12px; border-radius: 8px; }',
      js: "const box = document.getElementById('box');\nconsole.log('通过 DOM 读到的对象：', box);\nconsole.log('它的子元素个数：', box.children.length);\n\ndocument.getElementById('b').addEventListener('click', function () {\n  const p = document.createElement('p');\n  p.textContent = '这是 JS 新加的一段（' + new Date().toLocaleTimeString() + '）';\n  box.appendChild(p);\n});"
    },
    errors: [
      '以为改了 HTML 文件页面就会变：页面已经在内存里了，改文件要刷新才生效；想动态改就得操作 DOM',
      '用 JS 大段拼接字符串然后 innerHTML：能跑，但效率低且有注入风险，优先用 createElement + appendChild',
      '把 DOM 操作写在元素出现之前：拿到 null'
    ],
    related: ['concept-element', 'js-queryselector', 'js-createelement', 'html-script'],
    tip: '<b>一句话理解 DOM</b>：HTML 是「说明书」，DOM 是「浏览器照着说明书搭好的实物」，JS 控制的是那个实物。你改 HTML 文件不会自动改实物，得刷新。'
  }

];
