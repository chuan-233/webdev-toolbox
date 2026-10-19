/* ==========================================================================
   语法对照 — 四种语言（Python / HTML / CSS / JavaScript）
   --------------------------------------------------------------------------
   这一组和别的词条不一样：它不是「一个标签 / 一个属性」，而是同一件事在
   四种语言里各自怎么写。所以字段多了一个 cmp（四语言对照）：
       cmp.python / cmp.html / cmp.css / cmp.js
   每个语言格子要么是 { code, note }，要么是 { na: '为什么不适用' }。
   不适用的就明确写不适用，不要硬编一个「等价写法」。

   group 用来在侧边栏之外做二级筛选；confuse 是易混程度（1 低 / 2 中 / 3 高）。
   playground 是可选的、真正能在右侧实验区跑起来的 HTML/CSS/JS 示例。
   ========================================================================== */

window.WDT_SYNTAX = (function () {

  function P(code, note) { return { code: code, note: note }; }
  function NA(why) { return { na: why }; }

  return [

    /* ---------------- 符号 ---------------- */
    {
      id: 'syn-paren', name: '小括号 ( )', zh: '圆括号 / 参数列表', group: '符号', confuse: 3,
      purpose: '把内容括起来：函数调用、分组表达式、参数列表都用它。',
      explanation: '四种语言里只有 Python 和 JavaScript 把小括号当语法符号。HTML 里它只是普通文字；CSS 里它只出现在函数式写法中，比如 rgb()、calc()、:not()。',
      syntax: '名字(内容) —— 看到紧跟在名字后面的 ( )，先判断这是不是函数调用。',
      status: 'modern',
      keywords: ['小括号', '圆括号', '括号', 'parentheses', '参数', '函数调用', 'calc'],
      cmp: {
        python: P('print("你好")\nx = (1 + 2) * 3\nt = (1, 2)  # 元组', '函数调用、分组、元组。注意：元组的括号在某些位置可以省，但调用和分组的括号不能省。'),
        html: NA('HTML 没有小括号语法。正文里的 () 就是普通文字；要写样式请放进 style 属性或 CSS 文件。'),
        css: P('.card { width: calc(100% - 20px); color: rgb(30, 30, 30); }\n.card:not(.active) { opacity: .5; }', '只出现在值或选择器的函数式写法里：calc()、rgb()、:not()。CSS 没有「调用自定义函数」。'),
        js: P('const x = (1 + 2) * 3;\nconsole.log("你好");\nconst fn = (a, b) => a + b;', '函数调用、分组、箭头函数参数。不能用小括号取数组元素。')
      },
      errors: [
        '在 CSS 的 calc() 里写 100%-20px：减号两边必须有空格，否则会被解析成一个词。',
        '以为 Python 的小括号能当列表用：[] 才是列表，() 是元组。',
        '在 HTML 正文里想用括号「包住」标签属性：属性必须写在开始标签的尖括号里。'
      ],
      notes: '判断括号是不是语法：看它是否紧跟在函数名、关键字或运算符后面。否则多半只是文本。',
      related: ['syn-bracket', 'syn-brace', 'syn-call', 'syn-css-decl'],
      playground: {
        html: '<p>看控制台：小括号决定先算哪一步。</p>',
        css: '',
        js: 'const x = (1 + 2) * 3;\nconsole.log("(1 + 2) * 3 =", x);\nconsole.log("不加括号：1 + 2 * 3 =", 1 + 2 * 3);'
      }
    },

    {
      id: 'syn-bracket', name: '方括号 [ ]', zh: '中括号 / 下标 / 列表', group: '符号', confuse: 3,
      purpose: '在 Python/JS 里表示列表（数组）和下标；在 CSS 里表示属性选择器。',
      explanation: '同一个 [ ]，在 Python 和 JavaScript 里是数据结构和取值，在 CSS 里却是「按属性筛选元素」。HTML 里没有方括号语法。',
      syntax: '数据[位置] / [元素, 元素] / [属性="值"]',
      status: 'modern',
      keywords: ['方括号', '中括号', 'brackets', '列表', '数组', '下标', '索引', '属性选择器'],
      cmp: {
        python: P('nums = [1, 2, 3]\nprint(nums[0])\nprint(nums[1:3])\nuser["name"]', '列表字面量、下标、切片。Python 没有数组类型，常用 list。'),
        html: NA('HTML 本身没有方括号语法；正文里的 [] 只是文字（Markdown 的链接写法不属于 HTML）。'),
        css: P('input[type="text"] { border: 1px solid #ccc; }\na[href^="https"] { color: green; }', '属性选择器：按属性是否存在、是否等于某个值来选元素。'),
        js: P('const nums = [1, 2, 3];\nconsole.log(nums[0]);\nconst key = "name";\nconsole.log(obj[key]);', '数组字面量、下标、按变量取属性。JS 的对象也可以用 [] 访问。')
      },
      errors: [
        'Python 用 list(0) 想取第一个元素：那是调用函数，不是下标。',
        'JS 写 arr.0：属性访问不能用数字开头，应该写 arr[0]。',
        'CSS 属性选择器的值含空格或特殊字符时忘了加引号，导致选择器无效。'
      ],
      notes: 'Python 的 [] 同时负责「字面量」和「下标」；CSS 的 [] 只用于属性选择器；JS 的 [] 两者都用，还能用变量当键。',
      related: ['syn-paren', 'syn-list', 'syn-index', 'syn-css-selector'],
      playground: {
        html: '<p id="msg">看控制台。</p>',
        css: '#msg { padding: 8px; background: #eef4ff; }',
        js: 'const nums = [1, 2, 3];\nconsole.log("第一项：", nums[0]);\nconsole.log("最后一项：", nums[nums.length - 1]);'
      }
    },

    {
      id: 'syn-brace', name: '花括号 { }', zh: '大括号 / 字典 / 代码块', group: '符号', confuse: 3,
      purpose: '在 Python 里是字典/集合，在 CSS 里是规则块，在 JS 里既可能是代码块也可能是对象。',
      explanation: '花括号是四种语言里「同名不同命」最典型的符号。Python 的代码块靠缩进，{ } 只用来表示数据；CSS 用 { } 包住一组声明；JavaScript 的 { } 既包代码块，也写对象字面量。',
      syntax: '{ 键: 值 } / { 声明; } / { 语句; }',
      status: 'modern',
      keywords: ['花括号', '大括号', 'braces', '字典', '对象', '代码块', '规则块', 'f-string'],
      cmp: {
        python: P('d = {"a": 1}\ns = {1, 2, 3}\nname = "小明"\nprint(f"{name} 你好")', '字典、集合、f-string 占位符。Python 不用 { } 包代码块。'),
        html: NA('HTML 没有花括号语法。正文里的 {} 只是文字；Vue/Handlebars 的 {{ }} 是模板引擎的语法，不是 HTML 本身。'),
        css: P('.card {\n  color: red;\n  padding: 8px;\n}\n@media (max-width: 600px) {\n  .card { padding: 4px; }\n}', '包住一组声明，形成规则块。@media 也用 { } 包住内部规则。'),
        js: P('if (x > 0) {\n  console.log("正数");\n}\nconst obj = { a: 1, b: 2 };\nconst { a } = obj;', '代码块、对象字面量、解构。单独一行的 { a: 1 } 可能被当成代码块。')
      },
      errors: [
        '以为 Python 的 {} 是代码块：Python 的代码块靠缩进，{} 是字典/集合。',
        'JS 里把对象字面量单独写在一行：{ a: 1 } 会被解析成代码块加标签，赋值或包在括号里才明确。',
        'CSS 少写一个右花括号，后面所有规则都会失效。'
      ],
      notes: '同样是 {}：Python = 数据，CSS = 规则块，JS = 代码块或对象。HTML 里没有这个语法。',
      related: ['syn-dict', 'syn-block', 'syn-css-rule', 'syn-var'],
      playground: {
        html: '<p>看控制台里的对象。</p>',
        css: 'p { color: #2f6fdd; }',
        js: 'const user = { name: "小明", age: 20 };\nconsole.log(user);\nif (user.age >= 18) {\n  console.log("成年");\n}'
      }
    },

    {
      id: 'syn-quotes', name: "引号 ' \" `", zh: '单引号 / 双引号 / 反引号', group: '符号', confuse: 3,
      purpose: '界定字符串的边界；不同语言允许的引号种类不同。',
      explanation: 'Python 和 JavaScript 的单引号、双引号基本等价；反引号只有 JavaScript 用来做模板字符串。CSS 只用单/双引号包字符串值，HTML 用引号包属性值。中文弯引号不是任何一种语言的字符串边界。',
      syntax: "'文本' / \"文本\" / `文本`",
      status: 'modern',
      keywords: ['引号', '单引号', '双引号', '反引号', 'quotes', '字符串', '模板字符串'],
      cmp: {
        python: P("a = '单引号'\nb = \"双引号\"\nc = '''多行\n文本'''  # 三引号", '单双引号等价；三引号可跨行。Python 没有反引号字符串。'),
        html: P('<p title="双引号属性">可以</p>\n<p title=\'单引号属性\'>也可以</p>', '属性值用单/双引号都行；正文里的反引号只是文字。'),
        css: P('.note::before { content: "引号里的文字"; }\nbody { font-family: \'Microsoft YaHei\', sans-serif; }', '字符串值用单/双引号；反引号不是合法引号。'),
        js: P('const a = \'单引号\';\nconst b = "双引号";\nconst c = `反引号模板 ${1 + 1}`;', '单双引号等价；反引号是模板字符串，支持多行和 ${} 插值。')
      },
      errors: [
        '在 Python/JS 里用中文弯引号 ‘ ’ “ ” 当字符串边界：直接 SyntaxError。',
        'Python 里写反引号：SyntaxError（那是早已移除的 Python 2 写法）。',
        'HTML 属性值里出现同种引号却没转义，属性会被提前截断。'
      ],
      notes: 'HTML 属性值可以不加引号（只要不含空格、引号、=、<、>），但建议始终加。字符串里的中文标点完全合法。',
      related: ['syn-string', 'syn-attr', 'syn-format', 'syn-topic-punct'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '',
        js: 'const a = \'单引号\';\nconst b = "双引号";\nconst c = `模板 ${1 + 1}`;\nconsole.log(a, b, c);'
      }
    },

    {
      id: 'syn-comma', name: '逗号 ,', zh: '分隔符', group: '符号', confuse: 2,
      purpose: '分隔列表项、参数、属性或选择器。',
      explanation: '逗号在 Python、CSS、JavaScript 里都是分隔符，但分隔的东西不同：Python 分参数/元素，CSS 分选择器和值，JS 分参数/数组项/对象属性。HTML 用空格分隔属性，不用逗号。',
      syntax: 'a, b, c',
      status: 'modern',
      keywords: ['逗号', 'comma', '分隔', '选择器列表', '参数'],
      cmp: {
        python: P('print("a", "b")\nnums = [1, 2, 3]\nt = (1,)  # 一个元素的元组', '分隔参数、列表元素、元组元素。单元素元组的逗号不能省。'),
        html: NA('HTML 用空格分隔属性，不用逗号；正文里的逗号只是文字。'),
        css: P('h1, h2, h3 { margin: 0; }\n.badge { color: rgb(255, 0, 0); }\n.text { font-family: Arial, "Microsoft YaHei", sans-serif; }', '分隔选择器列表、函数参数、字体列表。'),
        js: P('console.log("a", "b");\nconst arr = [1, 2, 3];\nconst obj = { a: 1, b: 2 };', '分隔参数、数组元素、对象属性。对象属性之间不能写分号。')
      },
      errors: [
        '在 Python/JS 的对象或数组里用分号分隔（JS 对象属性之间用逗号）。',
        'CSS 选择器列表漏掉逗号，导致整条规则只匹配最后一个选择器。',
        '在 HTML 开始标签里用逗号分隔属性，浏览器会把逗号当成属性名的一部分。'
      ],
      notes: '尾随逗号：Python/JS 的数组和对象允许，CSS 函数参数不允许多余逗号。',
      related: ['syn-semicolon', 'syn-css-selector', 'syn-param'],
      playground: {
        html: '<p>看控制台。</p>', css: '', js: 'const arr = [1, 2, 3];\nconst obj = { a: 1, b: 2 };\nconsole.log(arr, obj);'
      }
    },

    {
      id: 'syn-colon', name: '冒号 :', zh: '块开始 / 声明 / 键值', group: '符号', confuse: 3,
      purpose: 'Python 用它开始代码块，CSS 用它分隔属性和值，JavaScript 用它写对象键值或三元表达式。',
      explanation: '冒号是跨语言最容易误用的符号之一：Python 的冒号后面必须换行加缩进；CSS 的冒号后面是值；JS 的冒号出现在对象字面量、标签和三元运算符里。HTML 本身不用冒号（只可能出现在属性值里）。',
      syntax: 'if 条件: / 属性: 值; / 键: 值',
      status: 'modern',
      keywords: ['冒号', 'colon', '代码块', '声明', '键值', '三元'],
      cmp: {
        python: P('if x > 0:\n    print("正数")\n\nd = {"a": 1}\nprint(nums[1:3])', '代码块开始、字典键值、切片。行尾冒号不能用全角。'),
        html: NA('HTML 本身不用冒号；它只可能出现在属性值里，比如 style="color:red" 的 CSS 部分或 URL 的 https:。'),
        css: P('.card { color: red; }\n.card:hover { opacity: .8; }\n.card::before { content: ""; }', '声明里的「属性: 值」，以及伪类/伪元素前的冒号。'),
        js: P('const obj = { a: 1 };\nconst msg = ok ? "是" : "否";\nouter: for (;;) { break outer; }', '对象键值、三元运算符、标签语句。JS 不用冒号开始代码块。')
      },
      errors: [
        'Python 忘了行尾冒号，或用了中文全角冒号，都会 SyntaxError。',
        'JS 对象字面量里用 = 代替 :。',
        'CSS 把冒号写成全角「：」，整条声明失效。'
      ],
      notes: 'Python 的冒号 = 代码块开始；CSS 的冒号 = 属性与值；JS 的冒号 = 键与值/三元。三种含义完全不同，不能互抄。',
      related: ['syn-if', 'syn-css-decl', 'syn-dict', 'syn-topic-punct'],
      playground: {
        html: '<p>看控制台。</p>',
        css: 'p { color: #1c7c54; }',
        js: 'const obj = { a: 1, b: 2 };\nconsole.log(obj);\nconsole.log(1 > 0 ? "是" : "否");'
      }
    },

    {
      id: 'syn-semicolon', name: '分号 ;', zh: '语句/声明结束', group: '符号', confuse: 3,
      purpose: '结束一条语句或声明；不同语言对它的要求完全不同。',
      explanation: 'Python 行末不需要分号（加了也能跑，但不规范）；CSS 每条声明必须用分号结束；JavaScript 语句建议总是写分号，虽然引擎会自动补。HTML 不用分号结束标签，只有字符实体以分号结尾。',
      syntax: '语句; / 属性: 值;',
      status: 'modern',
      keywords: ['分号', 'semicolon', '语句结束', '声明结束', 'ASI'],
      cmp: {
        python: P('a = 1\nb = 2\n# 行尾不需要分号；a = 1; b = 2 也能跑，但不推荐', '换行就是语句结束。分号只在同一行写多条简单语句时用。'),
        html: NA('HTML 不用分号结束标签；只有字符实体（如 &amp;）以分号结尾。'),
        css: P('.a {\n  color: red;\n  margin: 0;\n}', '每条声明都要分号；最后一条可省略，但建议写。'),
        js: P('let a = 1;\nconst b = 2;\nconsole.log(a + b);', '语句结束。分号可省略（自动分号插入），但容易踩坑，建议总写。')
      },
      errors: [
        '在 Python 每行末尾加分号：能跑，但不符合 PEP 8，也不像 Python 代码。',
        'CSS 声明之间漏分号，后一条会被当成前一条值的一部分。',
        'JS 依赖自动分号插入，在 return 后换行导致返回 undefined。'
      ],
      notes: '分号在三种语言里地位不同：Python 可选、CSS 必需、JS 建议总写。HTML 里只出现在字符实体末尾。',
      related: ['syn-comma', 'syn-stmt-end', 'syn-css-decl', 'syn-comment-line'],
      playground: {
        html: '<p>看控制台。</p>',
        css: 'p { color: #b34700; }',
        js: 'function f() {\n  return\n  1;\n}\nconsole.log("return 后换行的结果：", f());'
      }
    },

    {
      id: 'syn-dot', name: '点号 .', zh: '属性访问 / 类选择器 / 小数点', group: '符号', confuse: 3,
      purpose: '在 Python/JS 里访问属性，在 CSS 里表示类选择器，也都能表示小数点。',
      explanation: '点号在 Python 和 JavaScript 里是「对象的成员访问」；在 CSS 里是「类选择器」；在 HTML 里没有语法作用，class 属性值本身不带点。小数点在三种语言里都用 .。',
      syntax: '对象.属性 / .类名 / 1.5',
      status: 'modern',
      keywords: ['点号', 'dot', '句点', '属性访问', '类选择器', '小数点', 'className'],
      cmp: {
        python: P('obj.name\n"abc".upper()\n3.14\nfrom math import sqrt', '属性/方法访问、小数点、模块路径。Python 用 + 拼字符串，不用点。'),
        html: NA('点号在 HTML 里没有语法作用；class="a b" 用空格分隔多个类名，点只出现在 CSS 选择器里。'),
        css: P('.btn { padding: 8px; font-size: 1.5rem; }\n.card > .title { font-weight: 700; }', '类选择器、小数点、子代组合里的类选择器。'),
        js: P('obj.name\narr.length\n3.14\nconst copy = { ...obj };', '属性访问、小数点、展开运算符（三个点）。')
      },
      errors: [
        '在 HTML 的 class 属性里写 .btn：类名本身不带点，点只出现在 CSS 选择器里。',
        '用点号拼字符串：Python/JS 都不行，字符串拼接要用 + 或模板字符串。',
        'JS 写 1.toString()：数字后的小点会被当成小数点，应写 (1).toString() 或 1..toString()。'
      ],
      notes: 'CSS 的 . 是类选择器；Python/JS 的 . 是属性访问；HTML 的 class 值不带点。三者只是长得像。',
      related: ['syn-index', 'syn-css-selector', 'syn-class-id', 'syn-attr'],
      playground: {
        html: '<p class="note">这一段有 .note 样式。</p>',
        css: '.note { color: #6b3bb5; font-weight: 600; }',
        js: 'const obj = { name: "小明" };\nconsole.log(obj.name);\nconsole.log((3.14).toFixed(1));'
      }
    },

    {
      id: 'syn-angle', name: '尖括号 < >', zh: '标签定界符 / 比较运算符', group: '符号', confuse: 3,
      purpose: 'HTML 用尖括号包标签；Python/JS 用它们比较大小；CSS 只有 > 子代选择器。',
      explanation: '尖括号是 HTML 的「标签边界」，也是 Python/JavaScript 的「小于/大于」运算符。CSS 里 > 是子代选择器，但没有 < 运算符。同一个符号，三种完全不同的角色。',
      syntax: '<标签> / a < b / 父 > 子',
      status: 'modern',
      keywords: ['尖括号', 'angle', '标签', '比较', '大于', '小于', '子代选择器'],
      cmp: {
        python: P('if a < b and b <= c:\n    print("递增")', '小于/大于/小于等于/大于等于，都是比较运算符。'),
        html: P('<p class="note">文字</p>\n<br>\n<p>1 &lt; 2</p>', '包住标签名和属性。正文里要显示小于号，必须写 &lt;。'),
        css: P('.card > .title { font-weight: 700; }\n/* CSS 没有 < 比较运算符 */', '> 是子代选择器（只选直接子元素），< 不是 CSS 语法。'),
        js: P('if (a < b && b <= c) {\n  console.log("递增");\n}', '比较运算符；没有自动类型转换的「严格小于」。')
      },
      errors: [
        '在 HTML 正文里直接写 <，浏览器会把它当成标签开始；应写 &lt;。',
        '在 CSS 选择器里写 a < b：< 不是 CSS 运算符，选择器无效。',
        '把 HTML 的 <div> 读成「小于号 div 大于号」：尖括号在这里是标签定界符。'
      ],
      notes: 'HTML 的 < > 是标签边界；Python/JS 的 < > 是比较；CSS 只有 > 子代选择器，没有 <。',
      related: ['syn-tag', 'syn-equal', 'syn-css-selector', 'syn-topic-punct'],
      playground: {
        html: '<p>3 &lt; 5 在页面上显示为 3 < 5</p>',
        css: 'p { color: #2f6fdd; }',
        js: 'console.log(3 < 5, 5 <= 5);'
      }
    },

    /* ---------------- 运算符 ---------------- */
    {
      id: 'syn-assign', name: '等号 =（赋值）', zh: 'assignment', group: '运算符', confuse: 3,
      purpose: '把右边的值放进左边的变量；HTML 里则是「属性名 = 属性值」。',
      explanation: '在 Python 和 JavaScript 里，单个 = 是赋值，不是比较。HTML 的 = 用来连接属性名和属性值。CSS 不用 = 赋值，声明用冒号；= 只出现在属性选择器里表示精确匹配。',
      syntax: '变量 = 值 / 属性="值" / [属性="值"]',
      status: 'modern',
      keywords: ['等号', '赋值', 'assignment', '属性值', '属性选择器'],
      cmp: {
        python: P('x = 10\nx += 1\n# 不能写 x === 10', '赋值；增强赋值 +=、-=。比较要用 ==。'),
        html: P('<input value="10">\n<a href="https://example.com">链接</a>', '属性名 = 属性值。这里的 = 不是给变量赋值。'),
        css: P('.card { color: red; }\ninput[type="text"] { border: 1px solid #ccc; }', '声明用冒号赋值；= 只出现在属性选择器的精确匹配里。'),
        js: P('let x = 10;\nx += 1;\nconst same = (x === 11);', '赋值；比较要用 ===。if (x = 1) 是赋值且结果为真，几乎总是 bug。')
      },
      errors: [
        '把 = 当比较：if (x = 1) 在 JS 里是赋值且恒真；Python 里 if x = 1 直接语法错误。',
        'CSS 里写 color = red：无效，声明必须用冒号。',
        'HTML 属性值忘了引号且值里有空格，= 后面的内容会被截断。'
      ],
      notes: '赋值是「把右边放进左边」；比较是「问两边是否相等」。HTML 的 = 两者都不是，只是属性语法。',
      related: ['syn-equal', 'syn-var', 'syn-attr', 'syn-css-decl'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '',
        js: 'let x = 10;\nx += 1;\nconsole.log("x =", x);\nconsole.log("x === 11 ?", x === 11);'
      }
    },

    {
      id: 'syn-equal', name: '比较 == != ===', zh: '相等 / 不等', group: '运算符', confuse: 3,
      purpose: '判断两个值是否相等或不等；JavaScript 还区分宽松比较和严格比较。',
      explanation: 'Python 用 == 和 !=，没有 ===。JavaScript 同时有 ==（会做类型转换）和 ===（严格比较），新代码优先用 === / !==。CSS 没有比较运算符，= 只是属性选择器的匹配符。',
      syntax: 'a == b / a != b / a === b',
      status: 'modern',
      keywords: ['等于', '不等于', '比较', '严格相等', 'strict equality', '==', '==='],
      cmp: {
        python: P('x = None\n1 == 1        # True\n1 != 2        # True\nx is None     # 身份比较\n# 没有 ===', '== 比较值，is 比较是不是同一个对象。没有 ===。'),
        html: NA('HTML 没有比较运算符；属性选择器里的 = 由 CSS 负责。'),
        css: P('[type="text"] { border: 1px solid #ccc; }  /* 精确匹配 */\n[class~="btn"] { font-weight: 700; }       /* 包含单词 */\n[href^="https"] { color: green; }           /* 开头匹配 */', '= 是属性选择器的匹配符，不是比较运算。'),
        js: P('1 == "1"    // true（会转换类型）\n1 === "1"   // false（严格）\n1 != "1"    // false\n1 !== "1"   // true', '== 会做类型转换，=== 不转换。新代码优先 === / !==。')
      },
      errors: [
        'JS 用 == 比较，遇到 "0" == false 这类转换会得到意外结果。',
        'Python 用 ===：直接 SyntaxError。',
        '把 CSS 属性选择器的 = 当成比较运算符，套进 JS 或 Python。'
      ],
      notes: '新代码在 JS 里优先 === / !==；Python 用 == / is；CSS 的 = 是属性选择器的匹配符。',
      related: ['syn-assign', 'syn-logic', 'syn-css-selector', 'syn-if'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'console.log(1 == "1");\nconsole.log(1 === "1");\nconsole.log(1 !== "1");'
      }
    },

    {
      id: 'syn-arith', name: '算术运算符 + - * / // %', zh: '加减乘除 / 取余 / 整除', group: '运算符', confuse: 3,
      purpose: '做数学运算；Python 的 // 和 JS 的 // 意思完全相反。',
      explanation: 'Python 的 // 是整除（向下取整），JavaScript 的 // 是注释。Python 的 / 是浮点除法，JS 也只有一种数字类型。CSS 的 calc() 里 + 和 - 两边必须有空格。',
      syntax: 'a + b / a // b / calc(100% - 20px)',
      status: 'modern',
      keywords: ['算术', '加减乘除', '整除', '取余', '乘方', 'calc', '//'],
      cmp: {
        python: P('7 / 2   # 3.5\n7 // 2  # 3\n7 % 2   # 1\n2 ** 3  # 8', '/ 是浮点除法，// 是整除，** 是乘方。'),
        html: NA('HTML 不做算术；数字只是文字或属性值。'),
        css: P('.box { width: calc(100% - 20px); }\n/* calc 里 + - 两边必须有空格 */', 'calc() 里可以做 + - * /，但 + 和 - 两侧必须有空格。'),
        js: P('7 / 2   // 3.5\n7 % 2   // 1\n2 ** 3  // 8\n// 没有 // 整除运算符（// 是注释）', '/ 是浮点除法，% 取余，** 乘方。没有整除运算符。')
      },
      errors: [
        'Python 以为 / 是整除：Python 3 的 / 得到浮点数。',
        'JS 写 7 // 2 想整除：// 把后面变成注释，结果仍是 7。',
        'CSS 的 calc 写 100%-20px 没有空格，减号被当成负号/连字符。'
      ],
      notes: 'Python 的 // 是整除，JS 的 // 是注释——同一个符号意思完全相反，这是最典型的跨语言陷阱。',
      related: ['syn-comment-line', 'syn-number', 'syn-css-decl', 'syn-topic-confusing'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '#out { padding: 8px; background: #eef4ff; }',
        js: 'console.log(7 / 2);\nconsole.log(7 % 2);\nconsole.log(2 ** 3);'
      }
    },

    {
      id: 'syn-logic', name: '逻辑运算符 and / &&', zh: '与 / 或 / 非', group: '运算符', confuse: 3,
      purpose: '组合多个条件；Python 用单词，JavaScript 用符号。',
      explanation: 'Python 写 and / or / not，JavaScript 写 && / || / !。CSS 只在 @media、@supports 和 :not() 里用 and / or / not 这些单词，没有 && 运算符。HTML 没有逻辑运算，布尔属性靠「出现即真」。',
      syntax: 'a and b / a && b',
      status: 'modern',
      keywords: ['逻辑', '与', '或', '非', 'and', 'or', 'not', '&&', '||', '!'],
      cmp: {
        python: P('if a and b or not c:\n    print("ok")', 'and / or / not。& | 是按位运算，不是逻辑运算。'),
        html: NA('HTML 没有逻辑运算符；布尔属性（disabled、hidden）靠「出现即真」表达。'),
        css: P('@media (min-width: 600px) and (max-width: 900px) {\n  .card { padding: 12px; }\n}\n.card:not(.active) { opacity: .5; }', '只在媒体查询/支持查询/否定伪类里用 and、or、not；没有 &&。'),
        js: P('if (a && b || !c) {\n  console.log("ok");\n}\nconst name = input ?? "匿名";', '&& / || / !；?? 是空值合并，只对 null/undefined 生效。')
      },
      errors: [
        '把 Python 的 and/or 写进 JS：语法错误。',
        '把 JS 的 && 写进 Python：语法错误。',
        '在 CSS 里写 &&：无效，媒体查询用 and。'
      ],
      notes: 'CSS 的 and/not 只出现在特定 at-rule 和 :not() 里，不是通用布尔表达式。',
      related: ['syn-if', 'syn-equal', 'syn-bool', 'syn-topic-same'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'const a = true, b = false, c = false;\nconsole.log(a && !b);\nconsole.log(b || c);\nconsole.log(!a);'
      }
    },

    /* ---------------- 变量与数据类型 ---------------- */
    {
      id: 'syn-var', name: '变量与赋值', zh: 'variable', group: '变量与数据类型', confuse: 3,
      purpose: '给一个值起名字，后面用名字取它。',
      explanation: 'Python 直接写 name = 值，不用声明类型。JavaScript 用 let / const 声明（var 是旧写法）。CSS 的自定义属性（--name: 值）作用类似变量，但只能存 CSS 值、沿 DOM 继承。HTML 没有变量。',
      syntax: 'name = 值 / let name = 值',
      status: 'modern',
      keywords: ['变量', 'variable', '赋值', 'let', 'const', '自定义属性', 'var'],
      cmp: {
        python: P('name = "小明"\nage = 20\n# 变量名区分大小写，不需要声明类型', '直接赋值即创建；变量可以重新绑定到不同类型的值。'),
        html: NA('HTML 没有变量；要存数据得用 JavaScript 或表单元素的值。'),
        css: P(':root { --main-color: #2f6fdd; }\n.card { color: var(--main-color); }', '自定义属性：名字必须以 -- 开头，用 var() 读取，沿 DOM 继承。'),
        js: P('let name = "小明";\nconst age = 20;\nvar old = "不推荐";', 'let 可重新赋值，const 不能重新绑定，var 是旧写法（函数作用域、会提升）。')
      },
      errors: [
        'JS 用未声明的变量：严格模式下 ReferenceError。',
        'Python 变量名拼错：NameError，而不是「自动创建新变量」。',
        'CSS 自定义属性忘了 -- 前缀，或忘了用 var() 读取。'
      ],
      notes: '「变量」在 CSS 里叫自定义属性，作用域沿 DOM 继承；HTML 没有变量这个概念。',
      related: ['syn-assign', 'syn-css-var', 'syn-number', 'syn-string'],
      playground: {
        html: '<p class="card">这段文字的颜色来自 CSS 变量。</p>',
        css: ':root { --main-color: #2f6fdd; }\n.card { color: var(--main-color); font-weight: 600; }',
        js: 'let name = "小明";\nconst age = 20;\nconsole.log(name, age);'
      }
    },

    {
      id: 'syn-number', name: '数字', zh: 'number / int / float', group: '变量与数据类型', confuse: 2,
      purpose: '表示整数、小数；不同语言对「数字」的类型划分不同。',
      explanation: 'Python 区分 int 和 float，整数可以任意大。JavaScript 只有一种 number（双精度浮点），大整数要用 BigInt。CSS 的数字通常要带单位；HTML 属性里的数字仍是字符串。',
      syntax: '42 / 3.14 / 42px',
      status: 'modern',
      keywords: ['数字', '整数', '小数', 'number', 'int', 'float', '单位'],
      cmp: {
        python: P('n = 42\npi = 3.14\nbig = 1_000_000', 'int 和 float 是不同类型；下划线可作千分位分隔。'),
        html: NA('HTML 只有文本；数字要放进属性（如 value="42"）或由 JS 处理。'),
        css: P('.card { width: 42px; line-height: 1.5; opacity: .8; }', '数字常带单位；line-height、opacity 等无单位。'),
        js: P('const n = 42;\nconst pi = 3.14;\nconst big = 1_000_000;\nNumber("42");', '只有一种 number；NaN 也是 number；大整数用 BigInt。')
      },
      errors: [
        '把 "42" 和 42 混用：JS 的 + 会拼接而不是相加。',
        'CSS 长度属性忘了单位：除 0 以外多数情况无效。',
        'Python 用逗号当千分位：1,000 会变成元组 (1, 0)。'
      ],
      notes: 'HTML 属性里的数字仍是字符串；CSS 的数字常带单位；JS 只有一种 number。',
      related: ['syn-var', 'syn-arith', 'syn-css-unit', 'syn-string'],
      playground: {
        html: '<p>看控制台。</p>',
        css: 'p { font-size: 1.25rem; }',
        js: 'console.log(42 + 1);\nconsole.log("42" + 1);\nconsole.log(Number("42") + 1);'
      }
    },

    {
      id: 'syn-bool', name: '布尔值 True / true', zh: 'boolean', group: '变量与数据类型', confuse: 2,
      purpose: '表示真/假；Python 首字母大写，JavaScript 全小写。',
      explanation: 'Python 的布尔值是 True / False，JavaScript 是 true / false。HTML 没有布尔类型，但 disabled、checked 这类布尔属性是「写了就为真」，值写 false 也仍然生效。CSS 没有布尔类型。',
      syntax: 'True / False / true / false',
      status: 'modern',
      keywords: ['布尔', '真', '假', 'boolean', 'True', 'true', 'disabled'],
      cmp: {
        python: P('ok = True\nno = False\nif ok:\n    print("真")', '首字母大写。空列表、0、None 等在条件里为假。'),
        html: NA('HTML 没有布尔值；disabled、checked 这类布尔属性是「写了就为真」。'),
        css: NA('CSS 没有布尔类型；用选择器/媒体查询表达条件，比如 .card.is-open。'),
        js: P('const ok = true;\nconst no = false;\nif (ok) console.log("真");', '全小写。0、""、null、undefined、NaN 在条件里为假。')
      },
      errors: [
        'Python 写 true/false：NameError。',
        'JS 写 True/False：ReferenceError。',
        '以为 HTML 的 disabled="false" 是「不禁用」：它仍然禁用。'
      ],
      notes: 'Python 首字母大写，JS 全小写；HTML 布尔属性只看有没有，不看值。',
      related: ['syn-if', 'syn-logic', 'syn-null', 'syn-attr'],
      playground: {
        html: '<button id="b" disabled>禁用状态</button>',
        css: 'button { padding: 6px 12px; }',
        js: 'console.log(true, false);\nconsole.log(Boolean(0), Boolean(""), Boolean("0"));'
      }
    },

    {
      id: 'syn-null', name: '空值 None / null / undefined', zh: '空 / 未定义', group: '变量与数据类型', confuse: 3,
      purpose: '表示「没有值」；三种语言的用词和含义不同。',
      explanation: 'Python 只有 None。JavaScript 有 null（主动置空）和 undefined（声明了但没赋值、属性不存在等）。CSS 没有 null，用 initial / unset 或干脆不写。HTML 没有空值类型。',
      syntax: 'None / null / undefined',
      status: 'modern',
      keywords: ['空值', 'None', 'null', 'undefined', 'nil', '未定义'],
      cmp: {
        python: P('x = None\nif x is None:\n    print("空")', '只有一个空值 None；判断用 is None，不用 ==。'),
        html: NA('HTML 没有空值类型；属性不写就是「没有」，但空字符串属性仍然存在。'),
        css: P('.card { color: unset; }\n/* 或直接不写这条声明 */', '没有 null；unset / initial / revert 表达「回到默认/继承」。'),
        js: P('let x = null;      // 主动置空\nlet y;             // undefined：声明了但没赋值\nconsole.log(x === null, y === undefined);', 'null 和 undefined 是两个不同的值；== null 会同时匹配两者。')
      },
      errors: [
        'Python 写 null：NameError。',
        'JS 用 == null 同时匹配 null 和 undefined：有时是想要的，但要清楚自己在做什么。',
        'CSS 写 color: null：无效。'
      ],
      notes: 'None/null/undefined 都不是 0 或空字符串；判断时用 is None / === null。',
      related: ['syn-bool', 'syn-var', 'syn-equal', 'syn-dict'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'let x = null;\nlet y;\nconsole.log(x, y);\nconsole.log(x === null, y === undefined);'
      }
    },

    {
      id: 'syn-list', name: '列表 / 数组', zh: 'list / array', group: '变量与数据类型', confuse: 2,
      purpose: '按顺序存一组值；Python 叫 list，JavaScript 叫 Array。',
      explanation: 'Python 的 list 用 []，可以混放不同类型，常用 append。JavaScript 的 Array 也用 []，常用 push。HTML 的 <ul>/<ol> 是页面上的列表元素，不是数据结构；CSS 没有数组。',
      syntax: '[1, 2, 3] / nums.append(x) / nums.push(x)',
      status: 'modern',
      keywords: ['列表', '数组', 'list', 'array', 'append', 'push', 'ul'],
      cmp: {
        python: P('nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))', 'list 字面量、append 添加、len 取长度。'),
        html: NA('HTML 没有列表数据结构；<ul>/<ol> 是页面上的列表元素，不是编程里的数组。'),
        css: NA('CSS 没有数组；多条值用逗号分隔（如 font-family），但那是语法列表，不是数据结构。'),
        js: P('const nums = [1, 2, 3];\nnums.push(4);\nconsole.log(nums.length);', 'Array 字面量、push 添加、length 取长度。')
      },
      errors: [
        '把 HTML 的 <ul> 当成 Python 列表：一个是标签，一个是数据结构。',
        'Python 用 push（没有这个方法）；JS 用 append（没有）。',
        'JS 用 for...in 遍历数组拿到的是下标字符串，不是值。'
      ],
      notes: '三者名字像但层次不同：HTML <ul> 是内容结构，Python list / JS Array 是数据容器。',
      related: ['syn-dict', 'syn-index', 'syn-for', 'syn-bracket'],
      playground: {
        html: '<ul><li>第一项</li><li>第二项</li></ul>',
        css: 'li { padding: 4px 0; }',
        js: 'const nums = [1, 2, 3];\nnums.push(4);\nconsole.log(nums, nums.length);'
      }
    },

    {
      id: 'syn-dict', name: '字典 / 对象', zh: 'dict / object', group: '变量与数据类型', confuse: 3,
      purpose: '按名字（键）存一组值；Python 叫 dict，JavaScript 叫 object。',
      explanation: 'Python 用 {"键": 值}，键可以是字符串、数字、元组等，访问用 d["键"] 或 d.get()。JavaScript 用 { 键: 值 }，键最终是字符串或 Symbol，访问用 obj.键 或 obj["键"]。JSON 是文本格式，键必须用双引号，不等于任何一种语言的源码。',
      syntax: '{"a": 1} / { a: 1 }',
      status: 'modern',
      keywords: ['字典', '对象', 'dict', 'object', '键值', 'JSON', 'get'],
      cmp: {
        python: P('user = {"name": "小明", "age": 20}\nprint(user["name"])\nprint(user.get("city", "未知"))', 'dict 字面量；键要加引号；用 get() 取不存在的键可给默认值。'),
        html: NA('HTML 没有键值对象；属性名/属性值只是标记配置，不是数据字典。'),
        css: NA('CSS 没有字典；自定义属性是一组名字到值的映射，但不能像对象那样遍历。'),
        js: P('const user = { name: "小明", age: 20 };\nconsole.log(user.name);\nconsole.log(user["name"]);', '对象字面量；键通常不加引号；点访问和 [] 访问都行。')
      },
      errors: [
        'Python 用 user.name 访问字典：AttributeError。',
        'JS 用 user[name] 但 name 变量未定义：ReferenceError。',
        '把 JSON 和 JS 对象混为一谈：JSON 的键必须双引号，且不能有函数/注释。'
      ],
      notes: 'Python dict 的键可以是数字/元组等；JS 对象的键最终是字符串或 Symbol；JSON 是文本格式。',
      related: ['syn-list', 'syn-index', 'syn-brace', 'syn-var'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'const user = { name: "小明", age: 20 };\nconsole.log(user.name);\nconsole.log(user["age"]);'
      }
    },

    {
      id: 'syn-index', name: '下标 / 属性访问 [ ] 与 .', zh: 'index / member access', group: '变量与数据类型', confuse: 3,
      purpose: '从列表/数组/对象里取出某一项。',
      explanation: 'Python 和 JavaScript 都用 [] 取下标，用 . 访问对象属性。Python 支持负下标和切片，JS 用 at(-1) 取最后一个。CSS 的 [] 是属性选择器，和「下标」无关；HTML 没有下标语法。',
      syntax: 'nums[0] / obj.name / nums.at(-1)',
      status: 'modern',
      keywords: ['下标', '索引', '属性访问', 'index', 'slice', 'at', 'nth-child'],
      cmp: {
        python: P('nums = [10, 20, 30]\nprint(nums[0])\nprint(nums[-1])\nprint(nums[0:2])\nuser["name"]', '下标从 0 开始；支持负下标和切片；字典用键访问。'),
        html: NA('HTML 没有下标语法；id/class 不是索引。'),
        css: P('li:nth-child(2) { color: red; }\n/* [] 是属性选择器，不是下标 */', '按位置选元素用 :nth-child()，不是 []。'),
        js: P('const nums = [10, 20, 30];\nconsole.log(nums[0]);\nconsole.log(nums.at(-1));\nconsole.log(obj["name"]);', '下标从 0 开始；越界得到 undefined；at(-1) 取最后一个。')
      },
      errors: [
        'Python 下标越界：IndexError；JS 越界得到 undefined，不报错。',
        'CSS 把 [] 当下标用：它只会按属性筛选元素。',
        'JS 用 nums[-1] 想取最后一个：得到 undefined，应该用 at(-1)。'
      ],
      notes: 'Python 支持负下标和切片；JS 用 at(-1) 取最后一个；CSS 的 [] 完全是另一件事。',
      related: ['syn-list', 'syn-dict', 'syn-dot', 'syn-bracket'],
      playground: {
        html: '<ul><li>一</li><li>二</li><li>三</li></ul>',
        css: 'li:nth-child(2) { color: #b34700; font-weight: 700; }',
        js: 'const nums = [10, 20, 30];\nconsole.log(nums[0], nums.at(-1));'
      }
    },

    /* ---------------- 字符串 ---------------- */
    {
      id: 'syn-string', name: '字符串写法', zh: 'string', group: '字符串', confuse: 2,
      purpose: '表示一段文本；边界必须用该语言认可的引号。',
      explanation: 'Python 和 JavaScript 的单/双引号等价，Python 三引号可跨行，JS 反引号可跨行。HTML 的文本直接写在标签之间，属性值才用引号。CSS 的字符串只用在 content、font-family 等值里。',
      syntax: "'文本' / \"文本\" / `文本`",
      status: 'modern',
      keywords: ['字符串', 'string', '文本', '多行', '三引号', '模板字符串'],
      cmp: {
        python: P('s1 = \'单引号\'\ns2 = "双引号"\ns3 = """三引号\n可以多行"""\nprint(len(s1))', '单双引号等价；三引号可跨行；len() 取长度。'),
        html: P('<p>正文里的 "引号" 只是文字</p>\n<p title="属性值用引号包起来">属性</p>', '文本写在标签之间；属性值用引号包。'),
        css: P('.note::before { content: "生成的内容"; }\nbody { font-family: "Microsoft YaHei", sans-serif; }', '字符串用在值里；字体名含空格时必须加引号。'),
        js: P('const s1 = \'单引号\';\nconst s2 = "双引号";\nconst s3 = `模板字符串\n可以多行`;', '单双引号等价；反引号可跨行；长度用 .length。')
      },
      errors: [
        '用中文弯引号当字符串边界：SyntaxError。',
        '把 Python 三引号当注释：它是字符串，只是常被用作文档字符串。',
        'HTML 属性值里出现同种引号没转义，属性被提前截断。'
      ],
      notes: '字符串是值，注释是给人和工具看的；两者写法不要混。',
      related: ['syn-quotes', 'syn-format', 'syn-escape', 'syn-comment-line'],
      playground: {
        html: '<p id="msg">看控制台。</p>',
        css: '',
        js: 'const s = "你好，世界";\nconsole.log(s, s.length);'
      }
    },

    {
      id: 'syn-format', name: '字符串插值 / 拼接', zh: 'f-string / template literal', group: '字符串', confuse: 3,
      purpose: '把变量的值放进字符串里。',
      explanation: 'Python 用 f"..." 或 + 拼接；JavaScript 用模板字符串 `...${}` 或 + 拼接；CSS 的 content 可以拼接字符串和 counter()，但不是通用插值；HTML 没有插值，动态内容要靠 JS 写 DOM 或服务端模板。',
      syntax: 'f"{name}" / `${name}`',
      status: 'modern',
      keywords: ['插值', '拼接', 'f-string', '模板字符串', 'template literal', 'format', 'content'],
      cmp: {
        python: P('name = "小明"\nprint(f"你好，{name}！")\nprint("你好，" + name + "！")', 'f-string 最直观；+ 拼接要求两边都是字符串。'),
        html: NA('HTML 没有字符串插值；动态内容要靠 JavaScript 写入 DOM 或服务端模板。'),
        css: P('li::before { content: "第 " counter(item) " 项"; }', '可以拼接字符串和 counter()，但不是通用表达式插值。'),
        js: P('const name = "小明";\nconsole.log(`你好，${name}！`);\nconsole.log("你好，" + name + "！");', '模板字符串用反引号和 ${}；+ 拼接要注意类型。')
      },
      errors: [
        'JS 模板字符串用了单引号而不是反引号：${} 不会生效。',
        'Python f-string 忘了前面的 f：输出字面量 {name}。',
        '把 ${} 写进普通字符串：它只是四个字符。'
      ],
      notes: 'Python 还有 .format() 和 %；JS 还有字符串拼接。新代码优先 f-string / 模板字符串。',
      related: ['syn-string', 'syn-var', 'syn-dot', 'syn-topic-same'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '',
        js: 'const name = "小明";\nconsole.log(`你好，${name}！`);\nconsole.log("你好，" + name + "！");'
      }
    },

    {
      id: 'syn-escape', name: '转义字符 \\', zh: 'escape', group: '字符串', confuse: 2,
      purpose: '在字符串里表示换行、引号、反斜杠等特殊字符。',
      explanation: 'Python 和 JavaScript 都用反斜杠转义：\\n 换行、\\" 引号、\\\\ 反斜杠。HTML 不用反斜杠，而用字符实体（&lt;、&amp;、&nbsp;）。CSS 的字符串也用反斜杠转义，\\A 表示换行。',
      syntax: '"\\n" / &lt; / "\\A"',
      status: 'modern',
      keywords: ['转义', 'escape', '换行', '反斜杠', '字符实体', '&lt;', '\\n'],
      cmp: {
        python: P('print("第一行\\n第二行")\nprint("他说：\\"你好\\"")\nprint("路径 C:\\\\Users")', '\\n 换行、\\" 引号、\\\\ 反斜杠；也可用 r"" 表示原始字符串。'),
        html: P('<p>换行用 &lt;br&gt; 或 CSS，不是 \\n</p>\n<p>小于号写 &amp;lt;</p>', 'HTML 的转义是字符实体，不是反斜杠。'),
        css: P('.quote::before { content: "\\201C"; }        /* 左双引号 */\n.br::after { content: "\\A"; white-space: pre; }  /* 换行 */', 'CSS 字符串用反斜杠转义，\\A 是换行。'),
        js: P('console.log("第一行\\n第二行");\nconsole.log("他说：\\"你好\\"");\nconsole.log("路径 C:\\\\Users");', '和 Python 类似；模板字符串里反斜杠同样生效。')
      },
      errors: [
        '在 HTML 正文里写 \\n 想换行：它只是两个字符，不会换行。',
        'CSS 的 \\A 后没配合 white-space: pre，看不到换行。',
        'Python 字符串末尾单个反斜杠会续行，导致意外的语法错误。'
      ],
      notes: '转义只在字符串字面量里生效；HTML 的转义是字符实体（&lt;），不是反斜杠。',
      related: ['syn-string', 'syn-attr', 'syn-topic-punct', 'syn-comment-block'],
      playground: {
        html: '<p>第一行<br>第二行</p>',
        css: 'p { line-height: 1.8; }',
        js: 'console.log("第一行\\n第二行");\nconsole.log("他说：\\"你好\\"");'
      }
    },

    /* ---------------- 条件与循环 ---------------- */
    {
      id: 'syn-if', name: '条件判断 if', zh: 'if statement', group: '条件与循环', confuse: 3,
      purpose: '满足条件时执行一段代码。',
      explanation: 'Python 写 if 条件: 然后缩进；JavaScript 写 if (条件) { }。CSS 没有 if，但可以按状态写选择器（.is-active）或用 @media 按屏幕宽度应用规则。HTML 没有条件语句。',
      syntax: 'if 条件: / if (条件) { }',
      status: 'modern',
      keywords: ['条件', '判断', 'if', 'else', '媒体查询', '状态类'],
      cmp: {
        python: P('if score >= 60:\n    print("及格")\nelse:\n    print("不及格")', '条件后必须加冒号；代码块靠缩进；条件不需要括号。'),
        html: NA('HTML 没有 if；条件渲染要靠 JavaScript 或服务端模板。'),
        css: P('/* 没有 if，但可以按状态写选择器 */\n.item.is-active { color: red; }\n@media (min-width: 600px) { .item { padding: 12px; } }', '按类名/状态、媒体查询表达条件，不是 if 语句。'),
        js: P('if (score >= 60) {\n  console.log("及格");\n} else {\n  console.log("不及格");\n}', '条件必须放在括号里；代码块用花括号。')
      },
      errors: [
        'Python 忘冒号或缩进：SyntaxError / IndentationError。',
        'JS 忘了条件括号：SyntaxError。',
        '在 CSS 里写 if：无效；用状态类或媒体查询。'
      ],
      notes: 'Python 的条件不需要括号，但冒号和缩进必需；JS 的括号可省但不建议。',
      related: ['syn-elseif', 'syn-bool', 'syn-logic', 'syn-css-selector'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '#out { padding: 8px; background: #eef4ff; }',
        js: 'const score = 75;\nif (score >= 60) {\n  console.log("及格");\n} else {\n  console.log("不及格");\n}'
      }
    },

    {
      id: 'syn-elseif', name: '多分支 else if / elif', zh: 'else if', group: '条件与循环', confuse: 2,
      purpose: '在多个条件之间选一个执行。',
      explanation: 'Python 写 elif，JavaScript 写 else if。CSS 没有分支语句，不同条件用多条规则/媒体查询叠加。HTML 没有分支。',
      syntax: 'elif 条件: / else if (条件) { }',
      status: 'modern',
      keywords: ['多分支', 'elif', 'else if', 'else', '条件链'],
      cmp: {
        python: P('if score >= 90:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"', 'elif 是一个词，不是 else if。'),
        html: NA('HTML 没有分支语法。'),
        css: NA('CSS 没有 else if；不同条件用多条规则/媒体查询叠加。'),
        js: P('if (score >= 90) {\n  grade = "A";\n} else if (score >= 60) {\n  grade = "B";\n} else {\n  grade = "C";\n}', 'else if 是两个词，中间有空格。')
      },
      errors: [
        'Python 写 else if：语法错误，应为 elif。',
        'JS 写 elif：ReferenceError。',
        '分支顺序写反，导致永远命中第一条。'
      ],
      notes: '多分支从上到下匹配，第一个成立就停；条件要从窄到宽排。',
      related: ['syn-if', 'syn-bool', 'syn-logic', 'syn-topic-same'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'const score = 75;\nlet grade;\nif (score >= 90) grade = "A";\nelse if (score >= 60) grade = "B";\nelse grade = "C";\nconsole.log(grade);'
      }
    },

    {
      id: 'syn-for', name: 'for 循环', zh: 'for loop', group: '条件与循环', confuse: 3,
      purpose: '重复执行一段代码；Python 是遍历，JS 有传统计数循环和遍历循环。',
      explanation: 'Python 的 for 只能遍历可迭代对象，没有 C 风格的 for。JavaScript 有 for (初始化; 条件; 更新)、for...of（遍历值）、for...in（遍历键/下标）。HTML 和 CSS 都没有循环。',
      syntax: 'for x in 可迭代对象: / for (let i=0; i<n; i++)',
      status: 'modern',
      keywords: ['循环', 'for', '遍历', 'range', 'for of', 'for in', 'forEach'],
      cmp: {
        python: P('for i in range(3):\n    print(i)\n\nfor name in ["A", "B"]:\n    print(name)', 'for 遍历可迭代对象；计数用 range()。'),
        html: NA('HTML 没有循环；重复元素只能手写或用 JavaScript 生成。'),
        css: NA('CSS 没有循环；重复样式靠选择器列表或预处理器（Sass 等）。'),
        js: P('for (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n\nfor (const name of ["A", "B"]) {\n  console.log(name);\n}', '传统 for、for...of 遍历值；for...in 遍历键/下标。')
      },
      errors: [
        'Python 写 C 风格 for：语法错误；用 range()。',
        'JS 用 for...in 遍历数组：拿到的是下标字符串，通常应该用 for...of。',
        '在 CSS/HTML 里想写 for：没有这个语法。'
      ],
      notes: 'Python 的 for 是「遍历可迭代对象」；JS 有传统 for、for...of（值）、for...in（键/下标，主要用于对象）。',
      related: ['syn-while', 'syn-break', 'syn-list', 'syn-topic-same'],
      playground: {
        html: '<ul id="list"></ul>',
        css: 'li { padding: 2px 0; }',
        js: 'const list = document.getElementById("list");\nfor (let i = 0; i < 3; i++) {\n  const li = document.createElement("li");\n  li.textContent = "第 " + (i + 1) + " 项";\n  list.appendChild(li);\n}'
      }
    },

    {
      id: 'syn-while', name: 'while 循环', zh: 'while loop', group: '条件与循环', confuse: 2,
      purpose: '条件为真时反复执行；适合次数不确定的循环。',
      explanation: 'Python 写 while 条件:，JavaScript 写 while (条件) { }，还有先执行一次的 do...while。HTML 和 CSS 都没有循环。',
      syntax: 'while 条件: / while (条件) { }',
      status: 'modern',
      keywords: ['while', '循环', '死循环', 'do while'],
      cmp: {
        python: P('n = 3\nwhile n > 0:\n    print(n)\n    n -= 1', '条件后加冒号；别忘了更新条件。'),
        html: NA('HTML 没有循环/条件。'),
        css: NA('CSS 没有 while。'),
        js: P('let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;\n}', '条件放括号里；do...while 至少执行一次。')
      },
      errors: [
        '忘记更新条件导致死循环，浏览器会卡住。',
        'Python 写 n--：没有这个运算符，用 n -= 1。',
        '把 while 用在次数确定的场景：可读性不如 for。'
      ],
      notes: 'while 适合「次数不确定」；次数确定优先 for。',
      related: ['syn-for', 'syn-break', 'syn-bool', 'syn-topic-same'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;\n}\nconsole.log("起飞");'
      }
    },

    {
      id: 'syn-break', name: 'break / continue', zh: '跳出 / 跳过', group: '条件与循环', confuse: 1,
      purpose: 'break 结束整个循环，continue 跳过本次进入下一次。',
      explanation: 'Python 和 JavaScript 的 break/continue 用法基本一致。HTML 和 CSS 没有控制流。',
      syntax: 'break / continue',
      status: 'modern',
      keywords: ['break', 'continue', '跳出循环', '跳过'],
      cmp: {
        python: P('for i in range(5):\n    if i == 2:\n        break\n    print(i)', 'break 跳出整个循环；continue 跳过本次。'),
        html: NA('HTML 没有控制流。'),
        css: NA('CSS 没有 break/continue。'),
        js: P('for (let i = 0; i < 5; i++) {\n  if (i === 2) break;\n  console.log(i);\n}', '用法和 Python 基本一致；只能跳出最近一层循环。')
      },
      errors: [
        '在 forEach 里用 break：无效（forEach 不是循环语句）。',
        '把 break 写在 if 外面，导致循环只跑一次。'
      ],
      notes: 'break 跳出整个循环，continue 跳过本次；两者都只影响最近一层循环。',
      related: ['syn-for', 'syn-while', 'syn-if', 'syn-topic-confusing'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'for (let i = 0; i < 5; i++) {\n  if (i === 2) break;\n  console.log(i);\n}'
      }
    },

    /* ---------------- 函数 ---------------- */
    {
      id: 'syn-func', name: '定义函数 def / function', zh: 'function definition', group: '函数', confuse: 3,
      purpose: '把一段可复用的逻辑起个名字。',
      explanation: 'Python 用 def 名字(参数): 加缩进；JavaScript 用 function 名字(参数) { } 或箭头函数。CSS 不能自定义函数，只能调用 calc()/rgb()/var() 等内置函数。HTML 没有函数。',
      syntax: 'def 名字(参数): / function 名字(参数) { }',
      status: 'modern',
      keywords: ['函数', '定义', 'def', 'function', '方法', '箭头函数'],
      cmp: {
        python: P('def greet(name):\n    return "你好，" + name\n\nprint(greet("小明"))', 'def + 冒号 + 缩进；return 返回值。'),
        html: NA('HTML 没有函数；事件属性里写的是 JavaScript。'),
        css: NA('CSS 没有自定义函数；calc()/rgb()/var() 是内置函数。'),
        js: P('function greet(name) {\n  return "你好，" + name;\n}\n\nconsole.log(greet("小明"));', 'function + 花括号；也可以写成 const greet = (name) => ...。')
      },
      errors: [
        'Python 忘冒号/缩进：SyntaxError。',
        'JS 忘 return：函数返回 undefined。',
        '把 CSS 的 rgb() 当成自己定义的函数。'
      ],
      notes: 'Python 用缩进定义函数体，JS 用花括号；CSS 只能调用内置函数，不能定义。',
      related: ['syn-call', 'syn-param', 'syn-return', 'syn-arrow'],
      playground: {
        html: '<p id="out">看控制台。</p>',
        css: '',
        js: 'function greet(name) {\n  return "你好，" + name;\n}\nconsole.log(greet("小明"));'
      }
    },

    {
      id: 'syn-call', name: '函数调用 ( )', zh: 'function call', group: '函数', confuse: 2,
      purpose: '执行一个函数并拿到结果。',
      explanation: 'Python 和 JavaScript 都用 名字(...) 调用函数。CSS 的 名字(...) 只出现在值里，调用的是内置函数。HTML 里的 onclick="fn()" 是内联 JavaScript，不是 HTML 的函数调用。',
      syntax: '名字(参数)',
      status: 'modern',
      keywords: ['调用', '函数调用', 'call', '括号', 'onclick'],
      cmp: {
        python: P('print("hi")\nlen([1, 2])', '名字后面加括号才是调用；只写名字得到函数对象。'),
        html: P('<button onclick="greet(\'小明\')">点我</button>', '这是 HTML 里嵌 JavaScript，不是 HTML 自己的函数调用。'),
        css: P('.box { width: calc(100% - 20px); color: rgb(0, 0, 0); }', 'CSS 的函数调用只出现在值里，不能调用自定义函数。'),
        js: P('console.log("hi");\ngreet("小明");', '名字后面加括号才是调用；没有括号得到函数本身。')
      },
      errors: [
        'Python 调用时漏括号：拿到函数对象，不执行。',
        'JS 把方法当属性：arr.length() 会报错，length 不是函数。',
        '在 CSS 属性名位置写函数：无效。'
      ],
      notes: '看到 名字(...) 先判断它属于哪种语言：Python/JS 是调用，CSS 是值函数，HTML 里通常是内联 JS。',
      related: ['syn-func', 'syn-paren', 'syn-param', 'syn-dom-event'],
      playground: {
        html: '<button id="btn">点我</button>\n<p id="out">还没点</p>',
        css: 'button { padding: 6px 12px; }',
        js: 'function greet(name) {\n  return "你好，" + name;\n}\ndocument.getElementById("btn").addEventListener("click", function () {\n  document.getElementById("out").textContent = greet("小明");\n});'
      }
    },

    {
      id: 'syn-param', name: '参数与默认值', zh: 'parameter / argument', group: '函数', confuse: 2,
      purpose: '调用函数时把值传进去；默认值让参数可以省略。',
      explanation: 'Python 的默认参数写在参数名后面（name="值"），默认参数必须放在非默认参数之后。JavaScript 也用 = 写默认值。HTML 的属性不是函数参数；CSS 内置函数的参数由规范定义。',
      syntax: 'def f(a, b=1): / function f(a, b = 1) { }',
      status: 'modern',
      keywords: ['参数', '默认值', 'parameter', 'argument', '实参', '形参'],
      cmp: {
        python: P('def greet(name, greeting="你好"):\n    return greeting + "，" + name\n\ngreet("小明")\ngreet("小明", "早安")', '默认参数写在后面；调用时按位置或关键字传。'),
        html: NA('HTML 没有参数；属性是配置，不是函数参数。'),
        css: P('/* 内置函数有参数：rgb(红, 绿, 蓝) */\n.link { color: rgb(47, 111, 221); }', '参数由 CSS 规范定义，不能自定义。'),
        js: P('function greet(name, greeting = "你好") {\n  return greeting + "，" + name;\n}\n\ngreet("小明");\ngreet("小明", "早安");', '默认值用 =；参数按位置传。')
      },
      errors: [
        'Python 默认参数写在非默认参数前面：SyntaxError。',
        'JS 调用时参数顺序错，默认值不生效。',
        '把 HTML 属性当成函数参数。'
      ],
      notes: '参数是「调用时传进去的值」，属性是「写在标签上的配置」。',
      related: ['syn-func', 'syn-call', 'syn-attr', 'syn-return'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'function greet(name, greeting = "你好") {\n  return greeting + "，" + name;\n}\nconsole.log(greet("小明"));\nconsole.log(greet("小明", "早安"));'
      }
    },

    {
      id: 'syn-return', name: '返回值 return', zh: 'return value', group: '函数', confuse: 2,
      purpose: '把函数的结果交回给调用者。',
      explanation: 'Python 和 JavaScript 都用 return。没有 return 时，Python 返回 None，JavaScript 返回 undefined。CSS 没有 return；HTML 没有函数。',
      syntax: 'return 值',
      status: 'modern',
      keywords: ['返回值', 'return', 'None', 'undefined', '结果'],
      cmp: {
        python: P('def add(a, b):\n    return a + b\n\nresult = add(1, 2)', '没有 return 时返回 None。'),
        html: NA('HTML 没有返回值。'),
        css: NA('CSS 没有 return。'),
        js: P('function add(a, b) {\n  return a + b;\n}\n\nconst result = add(1, 2);', '没有 return 时返回 undefined；return 后换行会被 ASI 截断。')
      },
      errors: [
        '忘记 return，得到 None/undefined。',
        'JS 的 return 后换行，自动插入分号，返回值丢失。',
        '把 return 写在循环里但没覆盖所有分支，部分情况返回 undefined。'
      ],
      notes: '没有 return 的函数在 Python 返回 None，在 JS 返回 undefined；两者都不等于 0。',
      related: ['syn-func', 'syn-null', 'syn-call', 'syn-stmt-end'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(1, 2));\n\nfunction bad() {\n  return\n  1;\n}\nconsole.log(bad());'
      }
    },

    {
      id: 'syn-arrow', name: '匿名函数 lambda / =>', zh: 'lambda / arrow function', group: '函数', confuse: 2,
      purpose: '写一个简短的、通常只传给别人用的函数。',
      explanation: 'Python 的 lambda 只能写一个表达式。JavaScript 的箭头函数可以写表达式或代码块，但没有自己的 this。CSS 和 HTML 都没有匿名函数。',
      syntax: 'lambda x: x * 2 / (x) => x * 2',
      status: 'modern',
      keywords: ['匿名函数', 'lambda', '箭头函数', 'arrow', '=>'],
      cmp: {
        python: P('double = lambda x: x * 2\nprint(double(3))\n\n# 多行逻辑用 def，不要硬塞 lambda', '只能写一个表达式；多行逻辑用 def。'),
        html: NA('HTML 没有匿名函数。'),
        css: NA('CSS 没有 lambda；函数是内置的。'),
        js: P('const double = (x) => x * 2;\nconsole.log(double(3));\n\nconst add = (a, b) => {\n  return a + b;\n};', '表达式体自动返回；代码块体要写 return；没有自己的 this。')
      },
      errors: [
        'Python 把 lambda 当多语句函数：只能写一个表达式。',
        'JS 箭头函数返回对象字面量忘了加括号：() => ({ a: 1 })。',
        '在需要 this 的方法里用箭头函数，this 指向外层。'
      ],
      notes: 'Python 的 lambda 能力很窄；JS 的箭头函数常用，但需要 this 时用普通 function。',
      related: ['syn-func', 'syn-return', 'syn-param', 'syn-call'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'const double = (x) => x * 2;\nconsole.log(double(3));\nconst add = (a, b) => a + b;\nconsole.log(add(1, 2));'
      }
    },

    /* ---------------- 代码块 ---------------- */
    {
      id: 'syn-block', name: '代码块', zh: 'block', group: '代码块', confuse: 3,
      purpose: '把几条语句归为一组，一起执行。',
      explanation: 'Python 用「冒号 + 缩进」划分代码块；CSS 和 JavaScript 用 { }；HTML 用标签嵌套表示结构，不是代码块。四者不能互抄。',
      syntax: '缩进 / { } / <div>…</div>',
      status: 'modern',
      keywords: ['代码块', 'block', '缩进', '花括号', '嵌套'],
      cmp: {
        python: P('if True:\n    print("靠缩进")\n    print("同属一个块")\nprint("块外")', '冒号开始，缩进决定归属；缩进结束块就结束。'),
        html: P('<div>\n  <p>HTML 用标签嵌套表示结构</p>\n</div>', 'HTML 的「块」是元素嵌套，不是代码块。'),
        css: P('.card {\n  color: red;\n  padding: 8px;\n}', '花括号包住一组声明。'),
        js: P('if (true) {\n  console.log("靠花括号");\n  console.log("同属一个块");\n}', '花括号包住一组语句；对象字面量也用花括号。')
      },
      errors: [
        'Python 混用空格和 Tab：TabError。',
        'JS/CSS 少右花括号：后面的代码被吞进块里。',
        '把 HTML 的标签嵌套当成代码块。'
      ],
      notes: 'Python 用缩进，CSS/JS 用 {}，HTML 用标签嵌套。四者不能互抄。',
      related: ['syn-indent', 'syn-brace', 'syn-stmt-end', 'syn-topic-same'],
      playground: {
        html: '<div class="box"><p>嵌套的 HTML 结构</p></div>',
        css: '.box { padding: 10px; border: 1px solid #ddd; }',
        js: 'if (true) {\n  console.log("块内");\n}\nconsole.log("块外");'
      }
    },

    {
      id: 'syn-indent', name: '缩进', zh: 'indentation', group: '代码块', confuse: 3,
      purpose: 'Python 的缩进是语法；其他三种语言里缩进只是排版。',
      explanation: 'Python 用缩进表示代码块，同一块内缩进必须一致（推荐 4 个空格）。HTML、CSS、JavaScript 的缩进不影响运行结果，只影响可读性。',
      syntax: '4 个空格 / 仅排版',
      status: 'modern',
      keywords: ['缩进', 'indentation', 'Tab', '空格', 'PEP 8'],
      cmp: {
        python: P('def f():\n    if True:\n        print("两层缩进")', '缩进是语法；同一块必须一致；不要混用 Tab 和空格。'),
        html: P('<!-- 缩进只为可读性，不影响渲染 -->\n<div>\n  <p>缩进两个空格</p>\n</div>', '缩进只是排版。'),
        css: P('/* 缩进只为可读性 */\n.card {\n  color: red;\n}', '缩进只是排版。'),
        js: P('// 缩进只为可读性\nif (true) {\n  console.log("ok");\n}', '缩进只是排版。')
      },
      errors: [
        'Python 同一块内缩进不一致：IndentationError。',
        '复制代码时把 Tab 和空格混在一起。',
        '以为 HTML/CSS/JS 的缩进会影响结果。'
      ],
      notes: '只有 Python 的缩进是语法；其他三种语言的缩进只是排版。',
      related: ['syn-block', 'syn-comment-line', 'syn-stmt-end', 'syn-topic-same'],
      playground: {
        html: '<div>\n  <p>缩进不影响渲染</p>\n</div>',
        css: 'p { color: #2f6fdd; }',
        js: 'if (true) {\n  console.log("缩进只是好看");\n}'
      }
    },

    {
      id: 'syn-stmt-end', name: '语句结束', zh: 'statement terminator', group: '代码块', confuse: 2,
      purpose: '告诉解析器一条语句到哪里结束。',
      explanation: 'Python 用换行结束语句（分号可选）；CSS 用分号结束声明；JavaScript 用分号（可自动插入，但有坑）；HTML 用闭合标签结束元素。',
      syntax: '换行 / ; / </标签>',
      status: 'modern',
      keywords: ['语句结束', '换行', '分号', '闭合标签', 'ASI'],
      cmp: {
        python: P('a = 1\nb = 2\n# 换行就是语句结束；分号可选', '换行结束语句；行末分号不必要。'),
        html: P('<p>第一段</p>\n<p>第二段</p>', '用闭合标签表示结束，不靠分号/换行。'),
        css: P('.a { color: red; }\n.b { color: blue; }', '每条声明用分号结束。'),
        js: P('const a = 1;\nconst b = 2;\n// 分号可省略（ASI），但建议写', '语句用分号结束；省略时靠 ASI。')
      },
      errors: [
        'Python 行末加分号：能跑但不规范。',
        'CSS 漏分号，后一条声明被吞。',
        'JS return 后换行导致 ASI 意外。'
      ],
      notes: '语句结束方式：Python 换行、CSS 分号、JS 分号（可省略但风险多）、HTML 闭合标签。',
      related: ['syn-semicolon', 'syn-block', 'syn-css-decl', 'syn-tag'],
      playground: {
        html: '<p>第一段</p>\n<p>第二段</p>',
        css: 'p { margin: 4px 0; }',
        js: 'const a = 1;\nconst b = 2;\nconsole.log(a + b);'
      }
    },

    /* ---------------- 注释 ---------------- */
    {
      id: 'syn-comment-line', name: '单行注释', zh: 'line comment', group: '注释', confuse: 3,
      purpose: '让一行内容不被执行，用来写说明。',
      explanation: 'Python 用 #，JavaScript 用 //，CSS 没有单行注释（只有 /* */），HTML 用 <!-- -->。注释符号不能跨语言复制。',
      syntax: '# / // / <!-- -->',
      status: 'modern',
      keywords: ['注释', '单行注释', 'comment', '#', '//', '<!--'],
      cmp: {
        python: P('# 这是注释\nx = 1  # 行尾注释', '# 后面到行尾都是注释。'),
        html: P('<!-- 这是 HTML 注释 -->\n<p>正文</p>', '注释可以跨行，但不能嵌套。'),
        css: P('/* CSS 注释 */\n/* 没有 // 单行注释 */\np { color: red; }', '只有 /* */；// 不是 CSS 注释。'),
        js: P('// 这是注释\nconst x = 1; // 行尾注释', '// 到行尾；块注释用 /* */。')
      },
      errors: [
        '在 CSS 里用 //：无效，后续规则可能被吞。',
        '在 Python 里用 <!-- -->：SyntaxError。',
        '在 HTML 里用 #：它只是文字。'
      ],
      notes: '注释符号不能跨语言复制；CSS 只有 /* */。',
      related: ['syn-comment-block', 'syn-topic-comment', 'syn-topic-punct', 'syn-semicolon'],
      playground: {
        html: '<!-- HTML 注释不会显示 -->\n<p>看控制台。</p>',
        css: '/* CSS 注释 */\np { color: #2f6fdd; }',
        js: '// JS 单行注释\nconsole.log("注释不会执行");'
      }
    },

    {
      id: 'syn-comment-block', name: '块注释', zh: 'block comment', group: '注释', confuse: 3,
      purpose: '一次注释掉多行内容。',
      explanation: 'HTML 用 <!-- -->，CSS 用 /* */，JavaScript 用 /* */。Python 没有官方块注释；三引号字符串常被当作文档字符串或多行文本，但它本质是字符串。HTML/CSS/JS 的块注释都不能嵌套。',
      syntax: '<!-- --> / /* */',
      status: 'modern',
      keywords: ['块注释', '多行注释', 'block comment', '三引号', 'docstring'],
      cmp: {
        python: P('"""\n这不是真正的块注释，\n只是一个没被使用的字符串。\n"""\ndef f():\n    """文档字符串（docstring）。"""\n    pass', '没有官方块注释；三引号是字符串。'),
        html: P('<!--\n  多行注释\n  不能嵌套 <!-- 内部 --> 会提前结束\n-->', '不能嵌套。'),
        css: P('/*\n  多行注释\n  不能嵌套 /* 内部 */\n*/', '不能嵌套。'),
        js: P('/*\n  多行注释\n*/\n// 也常用连续多行 //', '/* */ 可以跨行；不能嵌套。')
      },
      errors: [
        '以为 Python 三引号是官方块注释：它是字符串，位置不对会变成无操作表达式。',
        '嵌套 HTML/CSS 注释：内层 --> 或 */ 会提前结束外层。',
        '用 // 注释跨行 CSS：无效。'
      ],
      notes: 'Python 没有真正的块注释；HTML/CSS/JS 的块注释都不能嵌套。',
      related: ['syn-comment-line', 'syn-string', 'syn-topic-comment', 'syn-topic-punct'],
      playground: {
        html: '<!--\n  多行\n  HTML 注释\n-->\n<p>正文</p>',
        css: '/*\n  多行\n  CSS 注释\n*/\np { color: #2f6fdd; }',
        js: '/*\n  多行\n  JS 注释\n*/\nconsole.log("ok");'
      }
    },

    /* ---------------- 模块与导入 ---------------- */
    {
      id: 'syn-import', name: '导入 / 引入', zh: 'import / include', group: '模块与导入', confuse: 3,
      purpose: '把别处的代码或资源拿到当前文件里用。',
      explanation: 'Python 用 import 引入模块；HTML 用 <script src> 和 <link> 引入外部文件；CSS 用 @import 引入样式表；JavaScript 用 import 引入 ES Module。四者的加载方式和作用域都不同。',
      syntax: 'import 模块 / <script src> / @import / import ... from',
      status: 'modern',
      keywords: ['导入', '引入', 'import', 'include', '@import', 'script src', 'link'],
      cmp: {
        python: P('import math\nfrom math import sqrt\nprint(sqrt(9))', '引入整个模块或用 from ... import 引入部分名字。'),
        html: P('<link rel="stylesheet" href="style.css">\n<script src="app.js"></script>\n<script type="module" src="main.js"></script>', '用 link/script 引入外部资源；type="module" 才支持 import。'),
        css: P('@import url("base.css");\n/* 必须放在文件最前面 */', '引入另一个样式表；必须位于所有规则之前。'),
        js: P('import { greet } from "./greet.js";\n// 需要 <script type="module"> 或打包工具', 'ES Module 语法；普通 script 里不能用。')
      },
      errors: [
        '在普通 <script> 里写 import：SyntaxError，需要 type="module"。',
        'CSS 的 @import 写在规则后面：被忽略。',
        'Python 模块名和文件名不一致，导入失败。'
      ],
      notes: 'HTML 的 <script src> 是「引入并执行」，JS 的 import 是「引入模块的导出」；Python 的 import 引入整个模块。三者语义不同。',
      related: ['syn-export', 'syn-tag', 'syn-attr', 'syn-css-rule'],
      playground: {
        html: '<p>这个示例没有外部文件，所以只演示 DOM 引入关系。</p>',
        css: 'p { color: #2f6fdd; }',
        js: 'console.log("真实项目里用 <script type=\\"module\\"> 才能 import");'
      }
    },

    {
      id: 'syn-export', name: '导出 / 暴露', zh: 'export', group: '模块与导入', confuse: 3,
      purpose: '把当前模块里的名字交给别的文件使用。',
      explanation: 'JavaScript 的 ES Module 用 export 暴露名字。Python 没有 export 关键字，模块里的公开名字默认就能被 import，__all__ 只是约定。HTML/CSS 没有导出概念。',
      syntax: 'export ... / __all__',
      status: 'modern',
      keywords: ['导出', '暴露', 'export', '__all__', '模块'],
      cmp: {
        python: P('# Python 没有 export 关键字\n# 模块里的公开名字默认就能被 import\ndef greet():\n    return "hi"\n__all__ = ["greet"]', '没有 export；__all__ 是公开接口的约定。'),
        html: NA('HTML 没有导出；它通过 URL 被浏览器加载。'),
        css: NA('CSS 没有导出；样式是全局作用域（或 @layer 分层）。'),
        js: P('export function greet() {\n  return "hi";\n}\nexport default function main() {}', '命名导出和默认导出；需要模块环境。')
      },
      errors: [
        '以为 Python 需要 export。',
        '在普通脚本里用 export：SyntaxError。',
        'CSS 想直接导出变量给 JS：要用 getComputedStyle 读。'
      ],
      notes: '「导出」是模块系统的概念，只有 ES Module 有；Python 用 __all__ 约定公开接口。',
      related: ['syn-import', 'syn-func', 'syn-var', 'syn-css-var'],
      playground: {
        html: '<p>看控制台。</p>',
        css: '',
        js: 'console.log("export 只能在模块文件里用，这里演示不了");'
      }
    },

    /* ---------------- HTML 元素与属性 ---------------- */
    {
      id: 'syn-tag', name: '标签与元素', zh: 'tag / element', group: 'HTML 元素与属性', confuse: 2,
      purpose: 'HTML 用标签描述页面结构；标签 + 内容 = 元素。',
      explanation: 'Python/CSS/JavaScript 都没有「HTML 标签」这种语法。CSS 用选择器选中标签对应的元素，JS 用 DOM API 创建/修改元素。标签名不是变量，也不是函数。',
      syntax: '<标签 属性="值">内容</标签>',
      status: 'modern',
      keywords: ['标签', '元素', 'tag', 'element', '尖括号', 'createElement'],
      cmp: {
        python: NA('Python 没有标签；字符串里可以包含 HTML，但那只是文本。'),
        html: P('<p class="note">一段文字</p>\n<img src="a.png" alt="图">', '开始标签 + 内容 + 结束标签 = 元素；img 是空元素。'),
        css: P('p { color: #333; }\n.note { background: #fffbe6; }', 'CSS 用选择器「选中」标签，不创建标签。'),
        js: P('const p = document.createElement("p");\np.textContent = "一段文字";\ndocument.body.appendChild(p);', 'JS 创建的是 DOM 元素对象；参数是标签名，不带尖括号。')
      },
      errors: [
        '把 <p> 说成「p 语言」：它是 HTML 标签。',
        '在 CSS 里写 <p>：选择器不带尖括号。',
        'JS 写 document.createElement("<p>")：多写了尖括号。'
      ],
      notes: '标签属于 HTML；CSS 只描述样式；JS 可以创建/修改标签对应的 DOM 元素。',
      related: ['syn-attr', 'syn-void', 'syn-dom-select', 'syn-css-selector'],
      playground: {
        html: '<p class="note">一个带 class 的段落</p>',
        css: '.note { color: #b34700; font-weight: 600; }',
        js: 'const p = document.querySelector(".note");\nconsole.log(p.tagName);'
      }
    },

    {
      id: 'syn-attr', name: 'HTML 属性', zh: 'attribute', group: 'HTML 元素与属性', confuse: 3,
      purpose: '写在开始标签里，配置这个元素的额外信息。',
      explanation: 'HTML 属性（class、href、src）写在开始标签里，用 = 连接值。CSS 属性（color、margin）写在声明块里，用冒号。JavaScript 属性是对象成员，用点访问。三者都叫「属性」，但完全不是一回事。',
      syntax: '<a href="..." class="...">',
      status: 'modern',
      keywords: ['HTML 属性', 'attribute', 'class', 'href', 'src', 'setAttribute'],
      cmp: {
        python: NA('Python 没有 HTML 属性；对象属性 obj.name 是另一回事。'),
        html: P('<a href="https://example.com" class="btn" target="_blank">链接</a>', '属性名 = 属性值，多个属性用空格分隔。'),
        css: P('.btn { color: white; }\n/* CSS 没有 class 属性，只有 .btn 选择器 */', 'CSS 属性是 color、margin 这类；class 只作为选择器。'),
        js: P('const a = document.querySelector("a");\na.setAttribute("target", "_blank");\nconsole.log(a.href);', 'DOM 属性是对象成员；读写用 . 或 setAttribute/getAttribute。')
      },
      errors: [
        '把 CSS 属性（color）和 HTML 属性（class）混为一谈。',
        'JS 用 a.class = "btn"：应为 className 或 classList。',
        'HTML 属性名大小写不敏感，但建议小写；自定义属性用 data- 前缀。'
      ],
      notes: 'HTML 属性写在开始标签里；CSS 属性写在声明块里；JS 属性是对象成员。三者都叫「属性」但不是一回事。',
      related: ['syn-tag', 'syn-css-decl', 'syn-class-id', 'syn-dom-style'],
      playground: {
        html: '<a id="link" href="https://example.com" class="btn">链接</a>',
        css: '.btn { color: #2f6fdd; }',
        js: 'const a = document.getElementById("link");\nconsole.log(a.getAttribute("href"));\na.setAttribute("target", "_blank");\nconsole.log(a.outerHTML);'
      }
    },

    {
      id: 'syn-class-id', name: 'class 与 id', zh: 'class / id', group: 'HTML 元素与属性', confuse: 3,
      purpose: '给元素起「分类名」和「唯一名字」，供 CSS/JS 选中。',
      explanation: 'HTML 的 class 可以重复、一个元素可以有多个；id 全页唯一。CSS 用 . 选 class、# 选 id。JS 用 getElementById 或 querySelector。Python 的 class 是定义类，和 HTML 的 class 毫无关系。',
      syntax: 'class="a b" id="main" / .a / #main',
      status: 'modern',
      keywords: ['class', 'id', '类名', '选择器', 'classList', 'getElementById'],
      cmp: {
        python: NA('Python 没有 class 属性；class 关键字是定义类，和 HTML 的 class 无关。'),
        html: P('<div id="main" class="card wide">…</div>\n<!-- id 全页唯一；class 可重复、可写多个 -->', 'id 唯一，class 可重复且可写多个（空格分隔）。'),
        css: P('#main { padding: 10px; }\n.card { border: 1px solid #ddd; }\n.card.wide { max-width: 420px; }', '# 选 id，. 选 class，.card.wide 表示同时有两个类。'),
        js: P('document.getElementById("main");\ndocument.querySelectorAll(".card");\nel.classList.add("active");', 'getElementById 不带 #；querySelector 用完整选择器；classList 操作类名。')
      },
      errors: [
        '一个页面写多个相同 id。',
        'CSS 用 #main 选 class，或 JS 用 getElementById(".main") 带点。',
        '在 HTML class 属性里写 .card：点不属于类名。'
      ],
      notes: 'id 用 #，class 用 .；JS 的 classList 操作 class 属性；Python 的 class 是定义类，完全是另一件事。',
      related: ['syn-attr', 'syn-css-selector', 'syn-dom-select', 'syn-dot'],
      playground: {
        html: '<div id="main" class="card wide">内容</div>',
        css: '#main { padding: 10px; }\n.card { border: 1px solid #ddd; }\n.card.wide { max-width: 420px; }',
        js: 'const el = document.getElementById("main");\nconsole.log(el.className);\nel.classList.add("active");\nconsole.log(el.className);'
      }
    },

    {
      id: 'syn-void', name: '空元素 / 自闭合', zh: 'void element', group: 'HTML 元素与属性', confuse: 2,
      purpose: '有些 HTML 元素没有内容，也没有结束标签。',
      explanation: 'HTML 的 void 元素（img、br、input、hr、meta、link 等）不需要结束标签；HTML5 里结尾的 /> 可写可不写。但 div 不是 void 元素，写 <div /> 不会自闭合。CSS/JS/Python 没有这个概念。',
      syntax: '<img> / <br> / <input>',
      status: 'modern',
      keywords: ['空元素', '自闭合', 'void', 'img', 'br', 'input', 'XHTML'],
      cmp: {
        python: NA('Python 没有空元素概念。'),
        html: P('<img src="a.png" alt="图">\n<br>\n<input type="text">\n<!-- HTML5 里 /> 可写可不写 -->', 'void 元素没有结束标签；不是所有标签都能自闭合。'),
        css: NA('CSS 没有元素/标签的闭合概念。'),
        js: NA('JavaScript 不创建「空元素」语法；用 DOM API 创建元素。')
      },
      errors: [
        '给 <img> 写结束标签 </img>：无效。',
        '在 HTML 里写 XML 自闭合 <div />：div 不是空元素，浏览器会忽略斜杠并继续找 </div>。',
        '把 XHTML 的严格自闭合习惯当成 HTML 的硬性要求。'
      ],
      notes: '只有 void 元素（img、br、input、hr、meta、link 等）没有结束标签；<div /> 在 HTML 里不是自闭合。',
      related: ['syn-tag', 'syn-attr', 'syn-stmt-end', 'syn-topic-confusing'],
      playground: {
        html: '<p>第一行<br>第二行</p>\n<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2720%27%3E%3Crect width=%2740%27 height=%2720%27 fill=%27%237aa2f7%27/%3E%3C/svg%3E" alt="示例">',
        css: 'p { line-height: 1.8; }',
        js: 'console.log(document.querySelectorAll("img").length);'
      }
    },

    /* ---------------- CSS 选择器与声明 ---------------- */
    {
      id: 'syn-css-rule', name: 'CSS 规则块', zh: 'rule', group: 'CSS 选择器与声明', confuse: 2,
      purpose: '选择器 + 一组声明，描述「哪些元素长什么样」。',
      explanation: '一条 CSS 规则由选择器和声明块组成。HTML 的 style 属性只是把声明内联到元素上；JS 的 el.style 是逐条改内联样式；Python 不参与。三者都不是「CSS 规则块」本身。',
      syntax: '选择器 { 属性: 值; }',
      status: 'modern',
      keywords: ['CSS 规则', '规则块', 'selector', 'declaration', 'style 属性', '内联样式'],
      cmp: {
        python: NA('Python 没有 CSS 规则块。'),
        html: P('<p style="color: red; margin: 0;">内联样式</p>', 'style 属性里装的是 CSS 声明，不是 HTML 语法。'),
        css: P('.card {\n  color: red;\n  margin: 0;\n}', '选择器 + 声明块；声明用分号分隔。'),
        js: P('const el = document.querySelector(".card");\nel.style.color = "red";\nel.style.margin = "0";', 'JS 的 style 是逐条改内联样式，不是写 CSS 规则块。')
      },
      errors: [
        '选择器和声明之间漏 {}。',
        '声明之间漏分号。',
        'JS 的 style 属性名用 camelCase（backgroundColor），CSS 用 kebab-case（background-color）。'
      ],
      notes: '一条 CSS 规则 = 选择器 + 声明块；HTML 的 style 属性只是把声明内联；JS 的 style 是逐条改。',
      related: ['syn-css-selector', 'syn-css-decl', 'syn-dom-style', 'syn-block'],
      playground: {
        html: '<p class="card">一段有样式的文字</p>',
        css: '.card {\n  color: #b34700;\n  background: #fff5e6;\n  padding: 10px;\n  border-radius: 8px;\n}',
        js: 'console.log(getComputedStyle(document.querySelector(".card")).color);'
      }
    },

    {
      id: 'syn-css-selector', name: 'CSS 选择器', zh: 'selector', group: 'CSS 选择器与声明', confuse: 3,
      purpose: '指定样式要作用在哪些元素上。',
      explanation: 'CSS 选择器用标签名、.class、#id、属性、伪类等组合。HTML 只提供 class/id/标签名这些「钩子」；JavaScript 的 querySelector 复用同一套选择器语法；Python 没有选择器。',
      syntax: '标签 / .class / #id / [attr] / :hover',
      status: 'modern',
      keywords: ['选择器', 'selector', '类选择器', 'id 选择器', '属性选择器', '伪类', 'querySelector'],
      cmp: {
        python: NA('Python 没有选择器。'),
        html: P('<div class="card"><h2 id="title">标题</h2></div>', 'class/id 属性是选择器的「钩子」。'),
        css: P('.card { padding: 10px; }\n#title { color: #2f6fdd; }\ndiv > h2 { margin: 0; }\n.card:hover { background: #eee; }', '标签、类、id、子代、伪类组合。'),
        js: P('document.querySelector(".card > h2");\ndocument.querySelectorAll(".card");', 'querySelector 复用 CSS 选择器语法。')
      },
      errors: [
        '在 HTML class 属性里写 .card：点不属于类名。',
        'CSS 用 class="card" 当选择器：CSS 里要写 .card。',
        'JS 的 querySelector 忘了点/井号：".card" / "#title"。'
      ],
      notes: '选择器语法属于 CSS；JS 的 querySelector 复用同一套选择器；HTML 只提供 class/id/标签名。',
      related: ['syn-class-id', 'syn-css-rule', 'syn-dom-select', 'syn-attr'],
      playground: {
        html: '<div class="card"><h2 id="title">标题</h2><p>正文</p></div>',
        css: '.card { padding: 10px; border: 1px solid #ddd; }\n#title { color: #2f6fdd; }\n.card > p { color: #666; }',
        js: 'console.log(document.querySelector(".card > h2").textContent);'
      }
    },

    {
      id: 'syn-css-decl', name: 'CSS 声明', zh: 'declaration', group: 'CSS 选择器与声明', confuse: 2,
      purpose: '写出「哪个属性 = 什么值」。',
      explanation: 'CSS 声明的格式是 属性: 值;，不是 属性 = 值。HTML 的 style 属性里也是这套声明；JS 的 el.style 把属性名转成 camelCase，值仍是字符串。Python 没有声明。',
      syntax: '属性: 值;',
      status: 'modern',
      keywords: ['CSS 声明', 'declaration', '属性值', 'camelCase', 'background-color'],
      cmp: {
        python: NA('Python 没有 CSS 声明。'),
        html: P('<div style="color: red; padding: 8px;">…</div>', 'style 属性里是 CSS 声明。'),
        css: P('p {\n  color: red;\n  padding: 8px 12px;\n}\n/* 属性名: 值; */', '冒号分隔属性和值，分号结束。'),
        js: P('el.style.color = "red";\nel.style.padding = "8px 12px";', 'camelCase 属性名；值是字符串。')
      },
      errors: [
        'CSS 用 = 代替 :。',
        '属性名用 camelCase（background-color 写成 backgroundColor）在 CSS 文件里无效。',
        '值里的单位漏写。'
      ],
      notes: 'CSS 声明 = 属性 + 冒号 + 值 + 分号；JS 的 style 把属性名转成 camelCase，值仍是字符串。',
      related: ['syn-css-rule', 'syn-attr', 'syn-dom-style', 'syn-colon'],
      playground: {
        html: '<p id="msg">文字</p>',
        css: '#msg {\n  color: red;\n  padding: 8px 12px;\n  background: #fff0f0;\n}',
        js: 'const el = document.getElementById("msg");\nel.style.color = "blue";\nel.style.padding = "12px";'
      }
    },

    {
      id: 'syn-css-unit', name: '长度单位', zh: 'px / em / rem / %', group: 'CSS 选择器与声明', confuse: 2,
      purpose: '给长度一个参照系：绝对像素还是相对字号/父容器/视口。',
      explanation: 'CSS 长度必须带单位（0 除外）。px 是绝对单位；em 相对当前元素字号；rem 相对根元素字号；% 相对父容器；vh/vw 相对视口。HTML 的 width 属性是无单位数字（默认像素），JS 的数字也没有单位。',
      syntax: '200px / 1.2rem / 50% / 50vh',
      status: 'modern',
      keywords: ['单位', 'px', 'em', 'rem', '百分比', 'vh', 'vw', '长度'],
      cmp: {
        python: NA('Python 的数字没有 CSS 单位。'),
        html: P('<img width="200" height="100" alt="">', 'HTML 的宽度属性是无单位数字，单位默认像素（不推荐用来做布局）。'),
        css: P('.box {\n  width: 200px;\n  font-size: 1.2rem;\n  margin: 5%;\n  height: 50vh;\n}', '多数长度必须带单位；0 可以不带。'),
        js: P('el.style.width = "200px";\nconst n = 200; // 纯数字没有单位，直接写进 width 是无效值', 'JS 的数字没有单位；写进 style 的长度要自己带单位字符串（opacity 等无单位属性除外）。')
      },
      errors: [
        'CSS 写 width: 200（多数情况无效，0 除外）。',
        'JS 把带单位的字符串当数字运算：parseInt("200px") 只得到 200。',
        'HTML 宽度属性写 200px：无效，应为 200。'
      ],
      notes: 'px 绝对；em 相对当前元素字号；rem 相对根字号；% 相对父容器；vh/vw 相对视口。',
      related: ['syn-number', 'syn-css-decl', 'syn-dom-style', 'syn-attr'],
      playground: {
        html: '<div class="box">相对单位示例</div>',
        css: '.box {\n  width: 50%;\n  max-width: 320px;\n  padding: 1rem;\n  font-size: 1.1rem;\n  background: #eef4ff;\n}',
        js: 'console.log(getComputedStyle(document.querySelector(".box")).width);'
      }
    },

    {
      id: 'syn-css-var', name: 'CSS 变量', zh: 'custom property / --var', group: 'CSS 选择器与声明', confuse: 2,
      purpose: '把颜色、间距等值存起来复用，常用于主题切换。',
      explanation: 'CSS 自定义属性以 -- 开头，用 var() 读取，沿 DOM 继承。Python/JavaScript 的变量是运行时内存里的值，生命周期和作用域都不同。HTML 没有变量。',
      syntax: '--name: 值; / var(--name)',
      status: 'modern',
      keywords: ['CSS 变量', '自定义属性', 'custom property', 'var', '主题', 'setProperty'],
      cmp: {
        python: P('color = "#2f6fdd"\nprint(color)', '普通变量，运行时存在内存里。'),
        html: NA('HTML 没有变量；CSS 变量写在 style 属性里也只是 CSS。'),
        css: P(':root { --main: #2f6fdd; }\n.btn { background: var(--main); }\n.btn:hover { background: var(--main, #000); }', '-- 开头定义，var() 读取，第二个参数是回退值。'),
        js: P('const color = "#2f6fdd";\ndocument.documentElement.style.setProperty("--main", color);\nconsole.log(getComputedStyle(document.documentElement).getPropertyValue("--main"));', 'JS 用 setProperty 写 CSS 变量，用 getComputedStyle 读。')
      },
      errors: [
        'CSS 变量忘了 -- 前缀。',
        '用 var(main) 而不是 var(--main)。',
        '以为 CSS 变量能直接在 JS 里当普通变量用：要通过 getComputedStyle。'
      ],
      notes: 'CSS 自定义属性沿 DOM 继承，适合主题；JS/Python 变量是运行时内存里的值，生命周期不同。',
      related: ['syn-var', 'syn-css-decl', 'syn-dom-style', 'syn-css-rule'],
      playground: {
        html: '<div class="card">主题色来自 CSS 变量</div>',
        css: ':root { --main: #2f6fdd; }\n.card {\n  color: var(--main);\n  border: 2px solid var(--main);\n  padding: 12px;\n  border-radius: 8px;\n}',
        js: 'document.documentElement.style.setProperty("--main", "#b34700");\nconsole.log(getComputedStyle(document.documentElement).getPropertyValue("--main"));'
      }
    },

    /* ---------------- JavaScript DOM 操作 ---------------- */
    {
      id: 'syn-dom-select', name: '选择元素', zh: 'querySelector / getElementById', group: 'JavaScript DOM 操作', confuse: 2,
      purpose: '用 JavaScript 拿到页面上的元素对象。',
      explanation: 'JS 用 document.getElementById、document.querySelector、querySelectorAll 选元素。CSS 用同一套选择器语法匹配元素、施加样式，但不返回对象。HTML 用 id/class 提供钩子。Python 不直接操作浏览器 DOM。',
      syntax: 'document.querySelector("选择器")',
      status: 'modern',
      keywords: ['DOM', '选择元素', 'querySelector', 'getElementById', 'querySelectorAll'],
      cmp: {
        python: NA('Python 不在浏览器里操作 DOM（除非用 Selenium/Playwright 等工具，那是另一层）。'),
        html: P('<div id="app" class="panel">…</div>', 'id/class 是给选择器用的标记。'),
        css: P('#app { padding: 10px; }\n.panel { border: 1px solid #ddd; }', 'CSS 用选择器匹配元素，不「返回」元素对象。'),
        js: P('const app = document.getElementById("app");\nconst panel = document.querySelector(".panel");\nconst all = document.querySelectorAll(".item");', 'getElementById 不带 #；querySelector 用完整选择器；querySelectorAll 返回 NodeList。')
      },
      errors: [
        'getElementById 带 #：找不到元素，返回 null。',
        'querySelector 选择器写错，返回 null，后续访问属性报错。',
        'querySelectorAll 返回的是静态 NodeList，不是数组；需要数组方法时先 Array.from()。'
      ],
      notes: 'querySelector 返回第一个匹配或 null；querySelectorAll 返回静态 NodeList；CSS 选择器语法可直接复用。',
      related: ['syn-css-selector', 'syn-class-id', 'syn-dom-text', 'syn-dom-style'],
      playground: {
        html: '<div id="app" class="panel">内容</div>',
        css: '#app { padding: 10px; background: #eef4ff; }',
        js: 'const app = document.getElementById("app");\nconsole.log(app);\nconsole.log(document.querySelector("#app").textContent);'
      }
    },

    {
      id: 'syn-dom-text', name: '读写文本', zh: 'textContent / innerHTML', group: 'JavaScript DOM 操作', confuse: 3,
      purpose: '读取或替换元素里的文字。',
      explanation: 'JS 用 textContent 读写纯文本，用 innerHTML 读写 HTML 片段。CSS 的 content 只能给伪元素加装饰性内容，改不了真实文本节点。HTML 的文本直接写在标签之间。Python 不操作 DOM。',
      syntax: 'el.textContent / el.innerHTML',
      status: 'modern',
      keywords: ['textContent', 'innerHTML', '文本', 'XSS', 'content'],
      cmp: {
        python: NA('Python 没有 DOM。'),
        html: P('<p id="msg">原来的文字</p>', '文本直接写在标签之间。'),
        css: P('#msg::before { content: "前缀 "; }', 'CSS 的 content 只能加装饰性内容，改不了真实文本节点。'),
        js: P('const el = document.getElementById("msg");\nconsole.log(el.textContent);\nel.textContent = "新的文字";\n// el.innerHTML = "<b>加粗</b>";', 'textContent 安全；innerHTML 会解析 HTML，注意 XSS。')
      },
      errors: [
        '用 innerHTML 插入用户输入：XSS 风险。',
        '用 textContent 读 HTML 标签：得到的是纯文本，不含标签结构。',
        '把 CSS 的 content 当成能改正文。'
      ],
      notes: 'textContent 读写纯文本，安全；innerHTML 解析 HTML，方便但有注入风险；CSS content 只用于伪元素装饰。',
      related: ['syn-dom-select', 'syn-string', 'syn-dom-style', 'syn-escape'],
      playground: {
        html: '<p id="msg">原来的文字</p>\n<button id="btn">改文字</button>',
        css: '#msg { padding: 8px; background: #eef4ff; }',
        js: 'const el = document.getElementById("msg");\ndocument.getElementById("btn").addEventListener("click", function () {\n  el.textContent = "新的文字";\n  console.log(el.textContent);\n});'
      }
    },

    {
      id: 'syn-dom-style', name: '改样式', zh: 'element.style / classList', group: 'JavaScript DOM 操作', confuse: 2,
      purpose: '用 JavaScript 动态改变元素外观。',
      explanation: 'JS 可以直接改 el.style.color，也可以切换 class 让 CSS 生效。CSS 文件负责静态样式；HTML 的 style 属性是内联样式。Python 不参与。',
      syntax: 'el.style.color = "red" / el.classList.add("x")',
      status: 'modern',
      keywords: ['style', 'classList', '内联样式', 'camelCase', 'class 切换'],
      cmp: {
        python: NA('Python 没有 DOM 样式。'),
        html: P('<p id="msg" style="color: red;">文字</p>', '内联样式优先级高，难维护。'),
        css: P('#msg { color: red; font-size: 18px; }', '静态样式写在 CSS 里，便于复用。'),
        js: P('const el = document.getElementById("msg");\nel.style.color = "blue";\nel.style.fontSize = "20px";\nel.classList.add("highlight");', 'style 属性名用 camelCase；切换 class 更推荐。')
      },
      errors: [
        'JS 写 el.style.font-size：语法错误，应为 fontSize 或 setProperty。',
        'CSS 属性名和 JS 属性名混用。',
        '想用 el.style 覆盖 !important：覆盖不了。'
      ],
      notes: '优先用 class 切换样式，少量动态值再用 el.style；JS 的 style 只反映内联样式，读计算样式用 getComputedStyle。',
      related: ['syn-css-decl', 'syn-css-rule', 'syn-dom-select', 'syn-class-id'],
      playground: {
        html: '<p id="msg">这段文字会变色</p>\n<button id="btn">变蓝</button>',
        css: '#msg { color: red; padding: 8px; }',
        js: 'document.getElementById("btn").addEventListener("click", function () {\n  document.getElementById("msg").style.color = "blue";\n});'
      }
    },

    {
      id: 'syn-dom-event', name: '绑定事件', zh: 'addEventListener / onclick', group: 'JavaScript DOM 操作', confuse: 3,
      purpose: '用户点击、输入等动作发生时执行代码。',
      explanation: 'HTML 可以直接写 onclick="..."，但里面是 JavaScript。CSS 的 :hover 等伪类只改样式，不执行逻辑。JS 用 addEventListener 绑定事件，能绑多个、可移除。Python 后端只能接收 HTTP 请求，不处理浏览器点击。',
      syntax: 'addEventListener("click", fn) / onclick="fn()"',
      status: 'modern',
      keywords: ['事件', 'click', 'addEventListener', 'onclick', 'DOMContentLoaded', 'hover'],
      cmp: {
        python: NA('Python 不处理浏览器点击事件；后端只能接收 HTTP 请求。'),
        html: P('<button onclick="alert(\'点了\')">点我</button>', 'onclick 里是 JavaScript，不是 HTML。'),
        css: P('.btn:hover { background: #eee; }', 'CSS 只能表达悬停等状态样式，不能执行逻辑。'),
        js: P('const btn = document.querySelector("button");\nbtn.addEventListener("click", function () {\n  console.log("点了");\n});', 'addEventListener 可以绑多个、可移除；推荐用这个而不是 onclick 属性。')
      },
      errors: [
        '在 HTML 里写 onclick="pythonFunction()"：浏览器只认 JS。',
        'JS 在元素还没加载时绑定：放 script 到 body 末尾或用 DOMContentLoaded。',
        'CSS 想执行点击逻辑：做不到。'
      ],
      notes: 'HTML 的 on* 属性是内联 JS；addEventListener 可以绑多个、可移除；CSS 的 :hover 只改样式。',
      related: ['syn-call', 'syn-attr', 'syn-dom-select', 'syn-if'],
      playground: {
        html: '<button id="btn">点我</button>\n<p id="out">还没点</p>',
        css: 'button { padding: 6px 12px; }\n#out { color: #666; }',
        js: 'document.getElementById("btn").addEventListener("click", function () {\n  document.getElementById("out").textContent = "你点了按钮";\n});'
      }
    },

    /* ---------------- 专题 ---------------- */
    {
      id: 'syn-topic-punct', name: '中英文标点对照', zh: '半角 / 全角', group: '专题', confuse: 3,
      purpose: '分清哪些标点只能写半角，哪些位置用中文全角完全合法。',
      explanation: '中文输入法默认打出全角标点。它们在正文、字符串、注释里都合法；但一旦进入代码的「语法位置」，解析器只认半角符号。判断标准不是「看起来像不像」，而是「这个位置是不是语法要求半角」。',
      syntax: '语法位置用半角；文本内容可用全角',
      status: 'modern',
      keywords: ['全角', '半角', '中文标点', '英文标点', 'SyntaxError', 'invalid character'],
      cmp: {
        python: P('# 字符串里：合法\nprint("你好，世界！")\n\n# 语法位置：必须半角\nif True:\n    print("ok")', '全角冒号/括号/逗号出现在语法位置会 SyntaxError。'),
        html: P('<p>你好，世界！</p>\n<p title="提示：注意">属性值里的中文标点合法</p>', '正文和属性值里的中文标点完全合法；标签本身必须半角。'),
        css: P('/* 注释里：合法 */\n.note::before { content: "你好，世界！"; }\n\n/* 语法位置：必须半角 */\np { color: red; }', 'content 字符串里的中文标点合法；声明位置必须半角。'),
        js: P('// 注释里：合法\nconsole.log("你好，世界！");\n\nif (true) {\n  console.log("ok");\n}', '字符串/注释里合法；括号、分号、点必须半角。')
      },
      errors: [
        '用中文输入法写 if（x > 0）：括号是全角，SyntaxError。',
        'CSS 声明用了全角冒号「：」，整条声明失效。',
        'JS 语句末尾用了全角分号「；」，SyntaxError。'
      ],
      notes: '中文标点在字符串、注释、HTML 正文、CSS content 里合法；在标签名、属性名、选择器、运算符、声明分隔符等语法位置必须半角。',
      related: ['syn-topic-confusing', 'syn-quotes', 'syn-colon', 'syn-semicolon'],
      topic: {
        intro: '下面先看「写进代码就报错」的一批，再看「视上下文而定」的一批。表格里的全角符号不是「错的字符」，只是不能出现在语法位置。',
        tables: [
          {
            title: 'A. 出现在语法位置就会报错',
            head: ['半角（正确）', '全角（中文输入法）', '后果'],
            rows: [
              ['( )', '（ ）', 'Python/JS：SyntaxError: invalid character；CSS：calc（…）无效'],
              [',', '，', 'Python/JS：参数或数组被当成一个整体 / SyntaxError；CSS：选择器列表失效'],
              [':', '：', 'Python：缺代码块冒号；CSS：声明无效；JS：对象字面量 SyntaxError'],
              [';', '；', 'JS：SyntaxError；CSS：声明无效'],
              ["' \"", '‘ ’ “ ”', '字符串边界无效，Python/JS SyntaxError；CSS 字符串/字体名无效'],
              ['[ ]', '【 】', 'Python/JS：下标/数组语法错误；CSS：属性选择器无效'],
              ['=', '＝', '赋值失效；CSS 属性选择器失效'],
              ['#', '＃', 'Python 注释失效；CSS id 选择器失效'],
              ['< >', '＜ ＞', 'HTML 标签无法识别；比较运算失效'],
              ['& | ! ?', '＆ ｜ ！ ？', '逻辑/位运算/三元失效'],
              ['_', '＿', '变量名变成另一个名字，NameError / undefined']
            ]
          },
          {
            title: 'B. 在这些位置用中文标点是合法的',
            head: ['位置', '例子', '说明'],
            rows: [
              ['字符串内容', 'print("你好，世界！")', '字符串里的标点只是文本'],
              ['HTML 正文', '<p>你好，世界！</p>', '浏览器按文本渲染'],
              ['HTML 属性值', '<p title="提示：注意">…</p>', '属性值里的中文标点不影响解析'],
              ['CSS content', 'content: "你好，世界！";', '生成内容里的标点只是文本'],
              ['注释', '# 这里用中文标点没关系', '注释不参与解析'],
              ['中文文件名', '样式表.css', 'URL 会做编码，现代浏览器可用']
            ]
          }
        ],
        notes: [
          '最容易踩的是全角括号、全角冒号、全角分号、中文引号这四类：它们看起来「差不多」，但解析器完全不认。',
          'HTML 字符实体（&nbsp;、&lt;）结尾的分号必须是半角，否则实体不生效。',
          '在编辑器里搜索「（）：；，」或装一个 lint 插件，能在运行前发现大部分问题。',
          '中文标点不是「禁止使用」：写中文内容时它才是正确选择，只是不要写进代码的语法位置。'
        ]
      }
    },

    {
      id: 'syn-topic-comment', name: '注释语法对照', zh: '四种注释写法', group: '专题', confuse: 2,
      purpose: '四种语言的注释符号完全不同，不能互相复制。',
      explanation: 'Python 用 #，HTML 用 <!-- -->，CSS 用 /* */，JavaScript 用 // 和 /* */。把一种语言的注释粘到另一种语言里，轻则注释失效，重则把后面的代码一起吞掉。',
      syntax: '# / <!-- --> / /* */ / //',
      status: 'modern',
      keywords: ['注释对照', 'comment', '注释符号', '跨语言', '块注释'],
      cmp: {
        python: P('# 单行注释\nx = 1  # 行尾注释', '只有 #；三引号是字符串不是注释。'),
        html: P('<!-- 注释 -->\n<!--\n  多行\n-->', '<!-- -->，不能嵌套。'),
        css: P('/* 注释 */\n/*\n  多行\n*/', '只有 /* */；没有 //。'),
        js: P('// 单行\n/*\n  多行\n*/', '// 和 /* */ 都有。')
      },
      errors: [
        '在 CSS 里用 //：无效，可能把下一条规则吞进注释。',
        '在 Python 里用 <!-- -->：SyntaxError。',
        '嵌套 HTML/CSS 块注释：内层结束符提前结束外层。'
      ],
      notes: '注释符号不能跨语言复制；CSS 只有 /* */；Python 没有官方块注释。',
      related: ['syn-comment-line', 'syn-comment-block', 'syn-topic-punct', 'syn-topic-confusing'],
      topic: {
        intro: '先记住一句话：注释符号是「语言的一部分」，不是通用排版符号。下面这张表可以直接当速查。',
        tables: [
          {
            title: '四种语言的注释写法',
            head: ['语言', '单行注释', '多行注释', '备注'],
            rows: [
              ['Python', '# 注释', '没有官方块注释', '三引号字符串常被当文档字符串，但它是字符串'],
              ['HTML', '<!-- 注释 -->', '同一个', '不能嵌套；注释里不要再写 <!-- -->'],
              ['CSS', '没有', '/* 注释 */', '没有 //；块注释不能嵌套'],
              ['JavaScript', '// 注释', '/* 注释 */', '不要用 <!-- 这种老写法']
            ]
          }
        ],
        notes: [
          'HTML 注释会被浏览器下载到客户端，不能用来藏密码或密钥。',
          'CSS 的 /* */ 在 JavaScript 里也合法，但 JS 的 // 在 CSS 里不合法——这就是「看着像就复制」的陷阱。',
          '注释里可以写中文标点，注释不参与解析。'
        ]
      }
    },

    {
      id: 'syn-topic-same', name: '同一功能的四种写法', zh: '字符串 / 判断 / 循环 / 函数 / 按钮', group: '专题', confuse: 3,
      purpose: '用同一批学习主题，横向看四种语言各自怎么写。',
      explanation: '这一页不是「四种语言功能完全对等」的证明。HTML 是标记语言，CSS 是样式语言，它们本来就没有变量、判断、循环、函数这些编程结构。下面只在真正对应的部分做对照，不对应的部分明确写「不适用」。',
      syntax: '横向对照',
      status: 'modern',
      keywords: ['四种写法', '对照', '字符串', '判断', '循环', '函数', '按钮', 'Flask'],
      cmp: {
        python: P('name = "小明"\nif len(name) > 3:\n    print(f"你好，{name}")', '变量、条件、f-string。'),
        html: P('<button id="like">点赞</button>', '只负责结构；行为要交给 JavaScript。'),
        css: P('#like {\n  padding: 8px 16px;\n  background: #2f6fdd;\n  color: #fff;\n}', '只负责外观；不处理点击逻辑。'),
        js: P('const name = "小明";\nif (name.length > 3) {\n  console.log(`你好，${name}`);\n}', '变量、条件、模板字符串。')
      },
      errors: [
        '以为 HTML/CSS 也有 if/for/function：它们没有这些编程结构。',
        '把 JavaScript 的 onclick 逻辑写进 CSS。',
        '把 Python 后端代码直接放进浏览器：浏览器只认 JavaScript。'
      ],
      notes: 'HTML/CSS 不适用编程结构时，页面会明确标注「不适用」，不硬编等价写法。',
      related: ['syn-topic-confusing', 'syn-var', 'syn-if', 'syn-func', 'syn-dom-event'],
      topic: {
        intro: '下面每个主题都先给「四种语言各自的角色」，再给代码。HTML 和 CSS 只在真正参与的主题里出现；没有对应结构的，明确写不适用。',
        blocks: [
          {
            title: '1. 字符串与变量',
            rows: [
              { lang: 'Python', code: 'name = "小明"\ngreeting = f"你好，{name}"\nprint(greeting)', note: '变量直接赋值；f-string 插值。' },
              { lang: 'HTML', code: '<p>你好，小明</p>', note: '没有变量和插值；文字就是文字。动态内容交给 JS 或服务端模板。' },
              { lang: 'CSS', code: '/* 不适用：CSS 没有字符串变量 */', note: 'CSS 只有自定义属性（--name: 值），存的是 CSS 值，不是任意字符串变量。' },
              { lang: 'JavaScript', code: 'const name = "小明";\nconst greeting = `你好，${name}`;\nconsole.log(greeting);', note: 'const 声明；模板字符串插值。' }
            ]
          },
          {
            title: '2. 判断条件',
            rows: [
              { lang: 'Python', code: 'score = 75\nif score >= 60:\n    print("及格")\nelse:\n    print("不及格")', note: '冒号 + 缩进。' },
              { lang: 'HTML', code: '<!-- 不适用：HTML 没有 if -->', note: '条件渲染要用 JS 或服务端模板。' },
              { lang: 'CSS', code: '/* 不适用：CSS 没有 if；用状态类或媒体查询 */\n.item.is-active { color: red; }', note: '按状态/屏幕条件应用样式，不是分支语句。' },
              { lang: 'JavaScript', code: 'const score = 75;\nif (score >= 60) {\n  console.log("及格");\n} else {\n  console.log("不及格");\n}', note: '括号 + 花括号。' }
            ]
          },
          {
            title: '3. 循环',
            rows: [
              { lang: 'Python', code: 'for i in range(3):\n    print(i)', note: '遍历 range()。' },
              { lang: 'HTML', code: '<!-- 不适用：HTML 没有循环 -->', note: '重复元素要手写或用 JS 生成。' },
              { lang: 'CSS', code: '/* 不适用：CSS 没有循环 */', note: '重复样式靠选择器列表或预处理器。' },
              { lang: 'JavaScript', code: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}', note: '传统计数循环；遍历值用 for...of。' }
            ]
          },
          {
            title: '4. 函数或类似结构',
            rows: [
              { lang: 'Python', code: 'def greet(name):\n    return "你好，" + name\n\nprint(greet("小明"))', note: 'def + 缩进。' },
              { lang: 'HTML', code: '<!-- 不适用：HTML 没有函数 -->', note: 'onclick 里写的是 JavaScript。' },
              { lang: 'CSS', code: '/* 不适用：CSS 不能自定义函数 */\nwidth: calc(100% - 20px);', note: '只能调用 calc()/rgb()/var() 等内置函数。' },
              { lang: 'JavaScript', code: 'function greet(name) {\n  return "你好，" + name;\n}\nconsole.log(greet("小明"));', note: 'function + 花括号；也可用箭头函数。' }
            ]
          },
          {
            title: '5. 一个按钮：结构 + 样式 + 点击 + 可选后端',
            rows: [
              { lang: 'HTML', code: '<button id="like">点赞</button>', note: '只负责结构和语义；不要在这里写业务逻辑。' },
              { lang: 'CSS', code: '#like {\n  padding: 8px 16px;\n  background: #2f6fdd;\n  color: #fff;\n  border: 0;\n  border-radius: 8px;\n}\n#like:hover { filter: brightness(1.1); }', note: '只负责外观；:hover 不是点击逻辑。' },
              { lang: 'JavaScript', code: 'const btn = document.getElementById("like");\nlet count = 0;\nbtn.addEventListener("click", function () {\n  count += 1;\n  btn.textContent = "已赞 " + count;\n});', note: '处理点击、更新页面。' },
              { lang: 'Python（可选，需要 Flask）', code: 'from flask import Flask, request, jsonify\n\napp = Flask(__name__)\n\n@app.post("/like")\ndef like():\n    return jsonify(ok=True)', note: '后端只接收 HTTP 请求，不直接处理浏览器点击；需要单独运行服务器。' }
            ]
          }
        ],
        notes: [
          'HTML 和 CSS 不是「功能少的 Python/JS」，它们是标记语言和样式语言，职责不同。',
          '同一个页面里，HTML 管结构、CSS 管外观、JS 管行为、Python 管服务端——这是分工，不是四种语言互相替代。',
          '上面的 Python 后端示例需要 Flask 和服务器环境，不能直接在浏览器里运行。'
        ]
      }
    },

    {
      id: 'syn-topic-confusing', name: '易混淆语法总表', zh: '跨语言陷阱速查', group: '专题', confuse: 3,
      purpose: '把最容易「看着像就抄错」的语法集中列出来，按真实差异记。',
      explanation: '这些条目不是按「四列都要填满」组织的，而是按初学者实际会混的地方组织：同一个符号在不同语言里意思不同、同一个概念在不同语言里写法不同、以及某些语言根本没有这个概念。',
      syntax: '按符号 / 概念速查',
      status: 'modern',
      keywords: ['易混淆', '陷阱', '速查', '跨语言', '符号', '概念'],
      cmp: {
        python: P('a = 7 // 2   # 整除，结果是 3\nok = True\n# 以 # 开头的是注释', '别把 JS 的注释符当整除，也别写小写 true。'),
        html: P('class 属性不带点\n布尔属性写了就为真\n<div /> 不会自闭合', 'HTML 的规则和其他三种都不一样。'),
        css: P('.card { color: red; }    /* . 是类选择器 */\n#main { padding: 8px; }   /* # 是 id 选择器 */\np { color: red; }        /* 声明用冒号，不是等号 */', 'CSS 的符号角色很固定。'),
        js: P('const strict = (1 === "1");  // false，严格比较\n// 以 // 开头的是注释\nconst obj = {};              // 对象字面量', '别把 Python 的 // 抄过来。')
      },
      errors: [
        '看到一个符号就直接跨语言复制，不看它在当前语言里的角色。',
        '把「名字相似」当成「语义相同」，比如 Python list 和 HTML <ul>。',
        '为了填满四列，硬给 HTML/CSS 编一个不存在的等价语法。'
      ],
      notes: '记法：先问「这个符号属于哪种语言」，再问「它在这个位置是什么角色」，最后才看写法。',
      related: ['syn-topic-punct', 'syn-topic-comment', 'syn-topic-same', 'syn-arith'],
      topic: {
        intro: '下面按「符号 / 概念」组织，每一行只比较真正相关的语言。最后一列给记忆钩子。',
        tables: [
          {
            title: '同一个符号，不同角色',
            head: ['符号', 'Python', 'HTML', 'CSS', 'JavaScript', '记忆钩子'],
            rows: [
              ['{}', '字典 / 集合', '无语法作用', '规则块', '代码块 / 对象', 'Python 是数据，CSS 是规则，JS 两者都可能是'],
              ['.', '属性访问 / 小数点', '无语法作用', '类选择器', '属性访问 / 小数点', 'HTML class 值不带点'],
              ['#', '注释', '无语法作用', 'id 选择器', '无（私有字段 #x 是另一回事）', 'Python 注释，CSS id'],
              ['//', '整除', '无', '不是注释', '注释', 'Python 算数，JS 注释'],
              ['=', '赋值', '属性名=值', '属性选择器匹配', '赋值', 'CSS 声明用冒号'],
              ['==', '比较', '无', '无', '宽松比较', 'JS 优先 ==='],
              [':', '代码块开始', '无（属性值里可能有）', '声明分隔', '对象键值 / 三元', '三种含义'],
              ['()', '调用 / 分组 / 元组', '正文文字', '函数值 / 伪类参数', '调用 / 分组', '跟不跟函数名'],
              ['[]', '列表 / 下标', '正文文字', '属性选择器', '数组 / 下标', 'HTML 没有'],
              ['<>', '比较', '标签边界', '只有 > 子代', '比较', 'HTML 是标签'],
              [';', '可选', '字符实体结尾', '声明必需', '语句结束（可省略）', 'CSS 必需，Python 可选']
            ]
          },
          {
            title: '同一个概念，不同写法',
            head: ['概念', 'Python', 'JavaScript', 'HTML / CSS', '注意'],
            rows: [
              ['布尔真/假', 'True / False', 'true / false', '无布尔类型', '大小写不同'],
              ['空值', 'None', 'null / undefined', '无', 'JS 有两个空值'],
              ['列表/数组', 'list []', 'Array []', 'HTML <ul> 是结构', '层次不同'],
              ['字典/对象', 'dict {}', 'object {}', '无', 'JSON 键必须双引号'],
              ['函数定义', 'def f():', 'function f() {}', 'CSS 只有内置函数', 'HTML 没有函数'],
              ['逻辑与', 'and', '&&', 'CSS 用 and 关键字', '不能互抄'],
              ['注释', '#', '// 和 /* */', 'HTML <!-- --> / CSS /* */', 'CSS 没有 //'],
              ['导入', 'import', 'import（模块）', '<script src> / @import', '语义不同'],
              ['实例引用', 'self', 'this', '无', 'Python 显式，JS 隐式'],
              ['类', 'class 定义类', 'class 语法', 'HTML class 是属性', '完全不同的东西']
            ]
          }
        ],
        notes: [
          '这张表不是「四列必须填满」的对照表：HTML/CSS 没有编程结构的地方就写「无」。',
          '真正要记的不是符号长什么样，而是「它在当前语言里是什么角色」。',
          '遇到不确定的写法，先回到对应分类的单项页面看适用条件和常见错误。'
        ]
      }
    }

  ];
})();
