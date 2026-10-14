/* ==========================================================================
   CSS 属性 词条
   --------------------------------------------------------------------------
   注意：这里只放「CSS 属性」，比如 color、display。
   不要和 HTML 属性（html-attrs.js）混在一起 —— 两者长得像但写法、位置完全不同。
   ========================================================================== */

window.WDT_CSS_PROPS = [

  {
    id: 'css-color', name: 'color', zh: '文字颜色',
    purpose: '设置文字（和文字装饰线）的颜色。只影响前景色，不管背景。',
    syntax: 'color: #333;\ncolor: rgb(255 0 0);\ncolor: hsl(210 80% 50%);',
    status: 'modern',
    keywords: ['颜色', '文字色', '前景色'],
    example: {
      html: '<p class="a">十六进制写法</p>\n<p class="b">rgb 写法</p>\n<p class="c">hsl 写法（最好调明暗）</p>',
      css: '.a { color: #2f6fdd; }\n.b { color: rgb(192 58 82); }\n.c { color: hsl(160 60% 35%); }\np { font-size: 16px; }',
      js: ''
    },
    errors: [
      '忘了写 # 号：color: 2f6fdd 是无效值，整条声明被丢弃',
      '以为 color 会改背景：改背景要用 background-color',
      '颜色对比度太低（浅灰字配白底），长时间看很累，也过不了无障碍检查'
    ],
    related: ['css-background-color', 'css-opacity'],
    tip: '<b>别写颜色名</b>（red、blue）：只有 140 来个且不好微调。用十六进制或 hsl —— hsl 的第三个数字控制明暗，调深浅最直观。'
  },

  {
    id: 'css-background-color', name: 'background-color', zh: '背景色',
    purpose: '设置元素的背景颜色。和 color 正好是一对：一个管底，一个管字。',
    syntax: 'background-color: #f5f7fa;\nbackground-color: transparent;',
    status: 'modern',
    keywords: ['背景色', '底色', '背景'],
    example: {
      html: '<div class="box">有背景色的盒子</div>\n<div class="box hi">高亮背景</div>',
      css: '.box { background-color: #f1f3f7; padding: 10px 14px; border-radius: 8px; margin-bottom: 10px; }\n.hi { background-color: #fff3cd; }',
      js: ''
    },
    errors: [
      '写成 background-color: 红色 —— CSS 不认识中文颜色名',
      '以为 background-color 会连文字一起变色：它是背景，文字色是 color'
    ],
    related: ['css-color', 'css-padding', 'css-border-radius']
  },

  {
    id: 'css-font-family', name: 'font-family', zh: '字体',
    purpose: '指定文字用哪套字体。写一串候选，浏览器从左往右找第一个装了的。结尾一定要给通用族名兜底。',
    syntax: 'font-family: "Microsoft YaHei", sans-serif;',
    status: 'modern',
    keywords: ['字体', '字型', 'font', 'sans-serif'],
    example: {
      html: '<p class="sans">无衬线：适合屏幕阅读</p>\n<p class="serif">衬线：适合长文印刷</p>\n<p class="mono">等宽：适合代码</p>',
      css: '.sans  { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; }\n.serif { font-family: Georgia, "Songti SC", serif; }\n.mono  { font-family: Consolas, "Courier New", monospace; }',
      js: ''
    },
    errors: [
      '字体名带空格却不加引号：font-family: Microsoft YaHei 会解析失败，要写 "Microsoft YaHei"',
      '结尾不写通用族名：候选字体都没装时浏览器只能自己乱猜',
      '指望用户电脑上一定有某个字体：字体是本地资源，装了才有'
    ],
    related: ['css-font-size', 'css-font-weight']
  },

  {
    id: 'css-font-size', name: 'font-size', zh: '字号',
    purpose: '设置文字大小。浏览器默认约 16px。正文一般 15–18px 比较舒服。',
    syntax: 'font-size: 16px;\nfont-size: 1rem;\nfont-size: 1.25em;',
    status: 'modern',
    keywords: ['字号', '文字大小', 'px', 'rem', 'em'],
    example: {
      html: '<p class="s">14px 偏小</p>\n<p class="m">16px 正文常用</p>\n<p class="l">1.5rem（= 24px，跟随根字号缩放）</p>',
      css: '.s { font-size: 14px; }\n.m { font-size: 16px; }\n.l { font-size: 1.5rem; }',
      js: ''
    },
    errors: [
      '正文用 12px：屏幕上过小，斜视/老花的人根本看不清',
      '到处用 px：用户把浏览器默认字号调大时，px 不会跟着变，用 rem 会',
      '用 em 层层嵌套：会父子相乘，很容易算错，一般只在需要"相对父元素"时用'
    ],
    related: ['css-font-family', 'css-line-height'],
    tip: '<b>px / rem / em 怎么选</b>：px 是死值；rem 相对根元素（&lt;html&gt;）字号，最推荐；em 相对父元素字号，会累积。'
  },

  {
    id: 'css-font-weight', name: 'font-weight', zh: '字重',
    purpose: '设置字体粗细。100–900，也可以写 normal（400）和 bold（700）。前提是这套字体真的提供了对应粗细。',
    syntax: 'font-weight: 400 / 700;\nfont-weight: normal / bold;',
    status: 'modern',
    keywords: ['粗细', '加粗', 'bold', '字重'],
    example: {
      html: '<p class="w1">400 正常</p>\n<p class="w2">500 中等</p>\n<p class="w3">700 粗</p>\n<p class="w4">900 特粗</p>',
      css: '.w1 { font-weight: 400; }\n.w2 { font-weight: 500; }\n.w3 { font-weight: 700; }\n.w4 { font-weight: 900; }',
      js: ''
    },
    errors: [
      '给没有 900 字重的字体写 900：浏览器会自己"描粗"变难看，或者直接退回 700',
      '用 font-weight 代替 <strong>：一个管外观，一个表语义。只想视觉加粗就用 font-weight'
    ],
    related: ['css-font-size', 'html-strong']
  },

  {
    id: 'css-line-height', name: 'line-height', zh: '行高',
    purpose: '行与行之间的距离。这个属性对「读起来累不累」的影响，比字体本身还大。',
    syntax: 'line-height: 1.7;\nline-height: 24px;',
    status: 'modern',
    keywords: ['行高', '行距', '可读性', 'leading'],
    example: {
      html: '<p class="tight">行高 1.2 —— 中文长文这样会挤在一起，读两行就串行了。</p>\n<p class="loose">行高 1.8 —— 中文正文推荐 1.6 到 1.8，眼睛不容易跳行。</p>',
      css: 'p { font-size: 16px; background: #f7f8fa; padding: 10px 14px; border-radius: 8px; }\n.tight { line-height: 1.2; margin-bottom: 12px; }\n.loose { line-height: 1.8; }',
      js: ''
    },
    errors: [
      '写无单位数值时其实是"倍数"，写 px 是死高度 —— 推荐用无单位倍数（1.6），会跟着字号自动缩放',
      '给中文正文用 1.2：拉丁字母还有余量，中文字面大，会显得挤'
    ],
    related: ['css-font-size', 'concept-selector']
  },

  {
    id: 'css-text-align', name: 'text-align', zh: '水平对齐',
    purpose: '让行内内容在水平方向上怎么排：left / center / right / justify。注意它对块级元素本身的位置无效，只影响里面的行内内容。',
    syntax: 'text-align: center;',
    status: 'modern',
    keywords: ['对齐', '居中', '对齐方式'],
    example: {
      html: '<div class="box c">居中</div>\n<div class="box l">左对齐</div>\n<div class="box r">右对齐</div>',
      css: '.box { background: #eef2ff; padding: 10px; margin-bottom: 8px; border-radius: 6px; }\n.c { text-align: center; }\n.l { text-align: left; }\n.r { text-align: right; }',
      js: ''
    },
    errors: [
      '想居中一个 div 却写 text-align: center：文字会居中，但 div 本身还是撑满整行。要居中块级元素得用 margin: auto 或 flex',
      '给大段中文用 justify：中西混排时会出现难看的"河流"空隙'
    ],
    related: ['css-margin', 'css-justify-content', 'html-center'],
    tip: '<b>「居中一个盒子」和「居中盒子里的字」是两件事</b>：前者用 <b>margin: 0 auto</b>（要有宽度）或 <b>flex + justify-content</b>；后者才是 text-align。'
  },

  {
    id: 'css-text-decoration', name: 'text-decoration', zh: '文字装饰线',
    purpose: '给文字加下划线、删除线、上划线。链接默认带下划线就是它。',
    syntax: 'text-decoration: underline;\ntext-decoration: none;\ntext-decoration: line-through;',
    status: 'modern',
    keywords: ['下划线', '删除线', '装饰线', 'underline'],
    example: {
      html: '<p><a href="#" class="nolink">去掉下划线的链接（悬停时再加回来）</a></p>\n<p class="del">这是一段被划掉的旧价格</p>\n<p class="und">这是强调用的下划线</p>',
      css: 'a.nolink { text-decoration: none; color: #2f6fdd; }\na.nolink:hover { text-decoration: underline; }\n.del { text-decoration: line-through; color: #8b93a1; }\n.und { text-decoration: underline; text-decoration-color: #f0a878; }',
      js: ''
    },
    errors: [
      '给所有链接都去掉下划线又不给别的提示：色盲用户分不清哪些字能点（记住悬停时要加回来）',
      '用 text-decoration: none 去下划线却想当然以为它也能去掉 border'
    ],
    related: ['html-a', 'css-color']
  },

  {
    id: 'css-margin', name: 'margin', zh: '外边距',
    purpose: '元素「外面」的空白，推开别的元素。四个方向可以一起写，也可以分开写。',
    syntax: 'margin: 10px;\nmargin: 10px 20px;\nmargin: 10px auto;   /* 水平居中 */',
    status: 'modern',
    keywords: ['外边距', '间距', '空隙', '居中'],
    example: {
      html: '<div class="a">margin-bottom: 24px</div>\n<div class="b">我和上面隔了 24px，我自己还有个左外边距</div>',
      css: '.a { background: #eef2ff; padding: 10px; margin-bottom: 24px; }\n.b { background: #e9f7ec; padding: 10px; margin-left: 32px; }',
      js: ''
    },
    errors: [
      '用 margin 撑开盒子内部空间：那是 padding 的活',
      '两个上下相邻的元素都设了 margin：外侧的会「塌陷」成一个，取两者较大的，而不是相加',
      '给行内元素设上下 margin：多数情况不起作用'
    ],
    related: ['css-padding', 'css-width', 'css-text-align'],
    tip: '<b>margin 和 padding 怎么记</b>：padding 是「贴在肉上的衣服内衬」（在边框里面，撑大盒子），margin 是「和别人保持的社交距离」（在边框外面，不影响自身大小）。'
  },

  {
    id: 'css-padding', name: 'padding', zh: '内边距',
    purpose: '元素「里面」的空白，把内容和边框推开。设了 padding 元素会变大（除非 box-sizing: border-box）。',
    syntax: 'padding: 12px 16px;',
    status: 'modern',
    keywords: ['内边距', '内衬', '留白'],
    example: {
      html: '<div class="tight">padding: 2px —— 字贴着边框，很难看</div>\n<div class="comfy">padding: 14px 18px —— 舒服多了</div>',
      css: '.tight { padding: 2px; background: #fff3cd; margin-bottom: 8px; }\n.comfy { padding: 14px 18px; background: #e9f7ec; border-radius: 8px; }',
      js: ''
    },
    errors: [
      '想调元素之间的距离却用 padding：元素会变大，该用 margin',
      '按钮不设 padding：点着难受，视觉上也挤'
    ],
    related: ['css-margin', 'css-box-sizing', 'css-border']
  },

  {
    id: 'css-border', name: 'border', zh: '边框',
    purpose: '元素的边框，简写形式是「粗细 样式 颜色」三件套。只有写样式才会显示，粗细和颜色单独写是看不到的。',
    syntax: 'border: 1px solid #ddd;\nborder-bottom: 2px solid #2f6fdd;',
    status: 'modern',
    keywords: ['边框', '描边', '边线', 'solid', 'dashed'],
    example: {
      html: '<div class="solid">实线边框</div>\n<div class="dashed">虚线边框</div>\n<div class="bottom">只有下边框</div>',
      css: 'div { padding: 10px; margin-bottom: 8px; border-radius: 6px; }\n.solid { border: 2px solid #2f6fdd; }\n.dashed { border: 2px dashed #f0a878; }\n.bottom { border-bottom: 3px solid #4fd1c5; background: #f7f8fa; }',
      js: ''
    },
    errors: [
      '只写 border-width: 1px 没写样式：没有 border-style 就不显示边框，这是最常见的"边框失效"原因',
      '给元素加边框后发现布局位移：因为 border 会占体积，用 box-sizing: border-box 解决'
    ],
    related: ['css-border-radius', 'css-box-sizing', 'css-padding']
  },

  {
    id: 'css-border-radius', name: 'border-radius', zh: '圆角',
    purpose: '把直角变圆角。值越大越圆，超过一半就变成圆形/胶囊形。',
    syntax: 'border-radius: 8px;\nborder-radius: 999px;   /* 胶囊 */\nborder-radius: 50%;     /* 正圆 */',
    status: 'modern',
    keywords: ['圆角', '圆形', '胶囊', 'radius'],
    example: {
      html: '<div class="r1">8px 圆角</div>\n<div class="pill">胶囊按钮</div>\n<div class="circle">50%</div>',
      css: 'div { background: #eef2ff; margin-bottom: 10px; }\n.r1 { border-radius: 8px; padding: 12px; }\n.pill { border-radius: 999px; padding: 8px 20px; display: inline-block; }\n.circle { border-radius: 50%; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 12px; }',
      js: ''
    },
    errors: [
      '想要圆形却只写 border-radius: 50% 而元素是长方形：会得到椭圆，得让宽高相等',
      '给图片加圆角但没加 overflow: hidden，图片本身照样是方的（其实 border-radius 对 img 是有效的，问题多出在父容器上）'
    ],
    related: ['css-border', 'css-width', 'css-height']
  },

  {
    id: 'css-box-shadow', name: 'box-shadow', zh: '阴影',
    purpose: '给元素加深浅阴影，营造层次。参数依次是：水平偏移 垂直偏移 模糊 扩散 颜色。',
    syntax: 'box-shadow: 0 2px 8px rgba(0,0,0,.12);',
    status: 'modern',
    keywords: ['阴影', '立体', '投影', '层次'],
    example: {
      html: '<div class="flat">没有阴影（平的）</div>\n<div class="raised">有阴影（浮起来）</div>',
      css: 'div { padding: 14px; border-radius: 10px; margin-bottom: 14px; background: #fff; border: 1px solid #eceef3; }\n.raised { box-shadow: 0 2px 10px rgba(16,24,40,.12); border: 0; }',
      js: ''
    },
    errors: [
      '给每个元素都加阴影：满屏都在飘，反而看不出层次',
      '用纯黑 rgba(0,0,0,.5)：太重太脏，浅一点（.08–.15）更自然'
    ],
    related: ['css-border', 'css-border-radius']
  },

  {
    id: 'css-width', name: 'width', zh: '宽度',
    purpose: '设置元素内容区的宽度。对行内元素（如 span）无效，需要先改成 inline-block / block / flex。',
    syntax: 'width: 240px;\nwidth: 50%;\nwidth: min(100%, 640px);',
    status: 'modern',
    keywords: ['宽度', '尺寸', '大小'],
    example: {
      html: '<div class="fixed">固定 200px</div>\n<div class="pct">父容器的 60%</div>',
      css: '.fixed { width: 200px; background: #eef2ff; padding: 8px; margin-bottom: 8px; }\n.pct { width: 60%; background: #e9f7ec; padding: 8px; }',
      js: ''
    },
    errors: [
      '给 <span> 设 width：行内元素不响应，得先 display: inline-block',
      '设了 width: 100% 又加 padding：总宽会超出父容器（默认 border-box 之外的计算方式），用 box-sizing: border-box 解决'
    ],
    related: ['css-max-width', 'css-height', 'css-box-sizing', 'css-display']
  },

  {
    id: 'css-height', name: 'height', zh: '高度',
    purpose: '设置元素高度。多数情况下应该让内容撑开高度，写死高度容易在文字变多时溢出。',
    syntax: 'height: 120px;\nmin-height: 100vh;',
    status: 'modern',
    keywords: ['高度', '尺寸', '撑满屏幕'],
    example: {
      html: '<div class="h1">写死 height: 60px</div>\n<div class="h2">min-height: 60px（内容多了会自己长高）</div>',
      css: '.h1 { height: 60px; background: #eef2ff; margin-bottom: 8px; }\n.h2 { min-height: 60px; background: #e9f7ec; padding: 8px; }',
      js: ''
    },
    errors: [
      '写死 height 装动态文字：文字一多就溢出到盒子外面',
      '用 height: 100% 想撑满屏幕：父元素没有确定高度时百分比无效，应该用 min-height: 100vh'
    ],
    related: ['css-width', 'css-overflow', 'css-max-width']
  },

  {
    id: 'css-max-width', name: 'max-width', zh: '最大宽度',
    purpose: '限制元素不超过这个宽度，窗口变小时又会自动收窄。做「既能自适应又不会宽到读不下去」的正文，靠的就是它。',
    syntax: 'max-width: 720px;\nmargin: 0 auto;',
    status: 'modern',
    keywords: ['最大宽度', '限宽', '响应式', '可读性'],
    example: {
      html: '<div class="col"><p>这一栏最宽 520px，行太长眼睛会累。窗口拉窄时它会自动收窄，不会出现横向滚动条。</p></div>',
      css: '.col { max-width: 520px; margin: 0 auto; background: #f7f8fa; padding: 14px 18px; border-radius: 10px; }',
      js: ''
    },
    errors: [
      '正文不限宽：宽屏上一行 200 多个字，读两行就找不着下一行的开头了',
      '用 width 代替 max-width：小屏上会出现横向滚动条'
    ],
    related: ['css-width', 'css-margin', 'css-line-height'],
    tip: '<b>正文宽度的经验值</b>：一行 45–75 个字符最舒服，中文大约 30–45 字。所以正文栏一般限宽 620–760px。'
  },

  {
    id: 'css-display', name: 'display', zh: '显示方式',
    purpose: '决定元素以哪种方式参与布局：block 独占一行、inline 跟着文字走、flex/grid 变成容器。这是布局里最重要的属性。',
    syntax: 'display: block | inline | inline-block | flex | grid | none;',
    status: 'modern',
    keywords: ['显示', '块级', '行内', 'flex', 'grid', '隐藏'],
    example: {
      html: '<span class="ib">我是 span</span>\n<span class="ib">但我们变成了 inline-block</span>\n<div class="d">我是 div</div>\n<div class="d none">我被 display:none 藏了</div>',
      css: '.ib { display: inline-block; background: #eef2ff; padding: 6px 10px; border-radius: 6px; margin-right: 6px; }\n.d { display: block; background: #e9f7ec; padding: 6px 10px; margin-top: 8px; border-radius: 6px; }\n.none { display: none; }',
      js: ''
    },
    errors: [
      '用 display: none 隐藏元素后又想读取它的尺寸：读不到，元素完全不参与布局。要用 visibility: hidden 或 opacity: 0',
      '给行内元素设 width/height：不生效，得先 inline-block',
      '在 flex 容器里还去调 float：flex 会忽略 float'
    ],
    related: ['css-justify-content', 'css-align-items', 'html-span', 'html-div'],
    tip: '<b>三种"隐藏"完全不同</b>：display:none（消失且不占位）、visibility:hidden（看不见但占位）、opacity:0（透明但还能点）。选错了会出现"按钮点不着"的怪事。'
  },

  {
    id: 'css-box-sizing', name: 'box-sizing', zh: '盒模型计算方式',
    purpose: '决定 width 包含不包含 padding 和 border。设成 border-box 后，width 就是"看得见的总宽"，最不容易算错。',
    syntax: '* { box-sizing: border-box; }',
    status: 'modern',
    keywords: ['盒模型', 'border-box', '尺寸计算', '布局'],
    example: {
      html: '<div class="row">\n  <div class="cell a">A（50% + padding）</div>\n  <div class="cell b">B（50% + padding）</div>\n</div>\n<p>这两个格子并排没有溢出，因为用了 border-box。</p>',
      css: '* { box-sizing: border-box; }\n.row { display: flex; gap: 10px; }\n.cell { width: 50%; padding: 10px; border-radius: 8px; }\n.a { background: #eef2ff; }\n.b { background: #e9f7ec; }',
      js: ''
    },
    errors: [
      '不设 border-box：设了 width: 100% 再加 padding，总宽就会超出父容器，撑出横向滚动条',
      '以为 box-sizing 影响内容排版：它只改"宽度怎么算"，不改内容'
    ],
    related: ['css-width', 'css-padding', 'css-border'],
    tip: '<b>推荐在样式表开头全局写上</b> <b>* { box-sizing: border-box }</b>。这是几乎每个项目都会做的一件事，能省掉一大类"为什么宽度超了"的困惑。'
  },

  {
    id: 'css-overflow', name: 'overflow', zh: '溢出处理',
    purpose: '内容超出盒子时怎么办：hidden 裁掉、scroll 出滚动条、auto 需要时才出。',
    syntax: 'overflow: hidden | auto | scroll | visible;',
    status: 'modern',
    keywords: ['溢出', '滚动条', '裁剪', 'scroll'],
    example: {
      html: '<div class="box hidden">overflow: hidden —— 超出的部分被裁掉了，你看不到这句话的后半段后半段后半段后半段</div>\n<div class="box auto">overflow: auto —— 内容超了就出现滚动条，可以滚。后面还有很多字很多字很多字很多字很多字很多字很多字</div>',
      css: '.box { height: 62px; padding: 8px 10px; border: 1px solid #ccd2dc; border-radius: 8px; margin-bottom: 12px; background: #fff; }\n.hidden { overflow: hidden; }\n.auto { overflow: auto; }',
      js: ''
    },
    errors: [
      '用 overflow: hidden 掩盖布局问题：内容其实是丢掉了，用户看不到',
      '给 body 设 overflow: hidden 想锁滚动：手机浏览器行为不一致，可能整页都滚不了'
    ],
    related: ['css-height', 'css-width']
  },

  {
    id: 'css-position', name: 'position', zh: '定位方式',
    purpose: '决定元素怎么"脱离"正常文档流：static 默认、relative 相对自身微调、absolute 相对最近的定位祖先、fixed 相对视口、sticky 滚动到阈值就吸附。',
    syntax: 'position: relative | absolute | fixed | sticky;',
    status: 'modern',
    keywords: ['定位', 'absolute', 'fixed', 'sticky', 'relative'],
    example: {
      html: '<div class="wrap">\n  <div class="sticky">sticky：往下滚我会吸在顶部</div>\n  <p>第一段内容</p><p>第二段内容</p><p>第三段内容</p><p>第四段内容</p><p>第五段内容</p>\n</div>',
      css: '.wrap { height: 190px; overflow-y: auto; border: 1px solid #ccd2dc; border-radius: 8px; padding: 10px; }\n.sticky { position: sticky; top: 0; background: #fff3cd; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px; }\np { margin: 0 0 40px; }',
      js: ''
    },
    errors: [
      '用 absolute 却发现位置不对：它相对「最近的、position 不是 static 的祖先」定位。父元素没设 relative 就会一路往上找到 <html>',
      'absolute 的元素宽度塌成一条：没有宽度约束时会收缩到内容宽，需要显式给 width',
      'sticky 不生效：常见原因是没写 top/bottom，或者祖先元素有 overflow: hidden'
    ],
    related: ['css-z-index', 'css-top', 'css-display']
  },

  {
    id: 'css-z-index', name: 'z-index', zh: '层叠顺序',
    purpose: '控制元素在"垂直屏幕方向"上谁压谁。数值大的在上面。',
    syntax: 'z-index: 10;',
    status: 'modern',
    keywords: ['层级', '覆盖', '谁在上面', '层叠'],
    example: {
      html: '<div class="stack">\n  <div class="l1">底层 z-index: 1</div>\n  <div class="l2">上层 z-index: 2（我压着它）</div>\n</div>',
      css: '.stack { position: relative; height: 110px; }\n.l1, .l2 { position: absolute; width: 190px; padding: 12px; border-radius: 8px; }\n.l1 { left: 0; top: 0; background: #eef2ff; z-index: 1; }\n.l2 { left: 40px; top: 40px; background: #fff3cd; z-index: 2; }',
      js: ''
    },
    errors: [
      '给没定位的元素写 z-index：对 static 元素无效，要先设 position（relative/absolute/fixed/sticky）',
      '疯狂加 z-index: 9999：治不了根，说明层级结构有问题',
      '父元素层级比另一个父元素低，孩子再高的 z-index 也翻不过去 —— 这叫「层叠上下文」，是新手最容易被坑的地方'
    ],
    related: ['css-position', 'css-opacity'],
    tip: '<b>层叠上下文</b>：父元素一旦形成了层叠上下文（比如设了 opacity &lt; 1、transform、position + z-index），它的所有子元素就只能在父元素那一层内部排序。<b>所以子元素 z-index 再大也压不过别的层</b>。'
  },

  {
    id: 'css-top', name: 'top / right / bottom / left', zh: '偏移量',
    purpose: '配合 position 使用，指定元素往哪边偏移多少。对 static 元素无效。',
    syntax: 'position: absolute;\ntop: 0; left: 50%;',
    status: 'modern',
    keywords: ['偏移', '定位', '坐标', 'top', 'left'],
    example: {
      html: '<div class="stage">\n  <div class="badge">左上角</div>\n  <div class="center">水平居中</div>\n</div>',
      css: '.stage { position: relative; height: 150px; background: #f7f8fa; border-radius: 10px; }\n.badge { position: absolute; top: 8px; left: 8px; background: #ffd7d7; padding: 3px 10px; border-radius: 6px; font-size: 13px; }\n.center { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); background: #d9f2ff; padding: 6px 14px; border-radius: 6px; }',
      js: ''
    },
    errors: [
      '只想水平居中就写 left: 50%，结果偏右一半：还要 transform: translateX(-50%) 把自身宽度拉回来',
      '同时写 top 和 bottom 又写死了 height：拉伸规则会打架'
    ],
    related: ['css-position', 'css-transform', 'css-z-index'],
    tip: '<b>left: 50% + transform: translateX(-50%)</b> 是「水平居中一个绝对定位元素」的经典组合，前面的 50% 是"父容器的一半"，后面的 -50% 是"自己的一半"。'
  },

  {
    id: 'css-flex-direction', name: 'flex-direction', zh: '主轴方向',
    purpose: '弹性布局的主轴方向：row 横排（默认）、column 竖排。它决定了 justify-content 是管"横"还是管"竖"。',
    syntax: 'display: flex;\nflex-direction: row | column;',
    status: 'modern',
    keywords: ['弹性布局', '主轴', '横排', '竖排', 'flex'],
    example: {
      html: '<div class="row">\n  <div>1</div><div>2</div><div>3</div>\n</div>\n<div class="col">\n  <div>1</div><div>2</div><div>3</div>\n</div>',
      css: '.row, .col { display: flex; gap: 8px; background: #f7f8fa; padding: 10px; border-radius: 8px; margin-bottom: 12px; }\n.row { flex-direction: row; }\n.col { flex-direction: column; }\ndiv div { background: #eef2ff; padding: 8px 16px; border-radius: 6px; }',
      js: ''
    },
    errors: [
      '改了 flex-direction 却还用老思路理解 justify-content：主轴一变，justify 和 align 管的轴就跟着调换了',
      '在 flex 容器上写 text-align 想让子元素居中：对 flex 子项无效，要用 justify-content'
    ],
    related: ['css-justify-content', 'css-align-items', 'css-gap', 'css-display']
  },

  {
    id: 'css-justify-content', name: 'justify-content', zh: '主轴对齐',
    purpose: '在弹性/网格容器里，让子项沿「主轴」排布：居中、两端对齐、均匀分布。',
    syntax: 'display: flex;\njustify-content: center | space-between | flex-start;',
    status: 'modern',
    keywords: ['居中', '主轴', '对齐', 'space-between', 'flex'],
    example: {
      html: '<div class="bar"><span>居中</span><b>right</b></div>\n<div class="bar between"><span>两端</span><b>对齐</b></div>\n<div class="bar around"><span>均匀</span><b>分布</b></div>',
      css: '.bar { display: flex; justify-content: center; gap: 10px; background: #f7f8fa; padding: 10px; border-radius: 8px; margin-bottom: 8px; }\n.bar span, .bar b { background: #eef2ff; padding: 4px 12px; border-radius: 6px; font-weight: 400; }\n.between { justify-content: space-between; }\n.around { justify-content: space-around; }',
      js: ''
    },
    errors: [
      '用 justify-content: center 想让子项「上下」居中：那是 align-items 的活（在 flex-direction: row 时）',
      '给非 flex/grid 元素写 justify-content：完全无效'
    ],
    related: ['css-align-items', 'css-flex-direction', 'css-text-align'],
    tip: '<b>一句话分清</b>：在 <b>flex-direction: row</b>（默认横排）下，justify-content 管左右、align-items 管上下。主轴一变，两者主管的方向就对调。'
  },

  {
    id: 'css-align-items', name: 'align-items', zh: '交叉轴对齐',
    purpose: '让子项沿「交叉轴」对齐。横排时管上下，竖排时管左右。做「垂直居中」最常用的就是它。',
    syntax: 'display: flex;\nalign-items: center;',
    status: 'modern',
    keywords: ['垂直居中', '交叉轴', '对齐', 'flex'],
    example: {
      html: '<div class="box"><span>我在这个盒子里正中间</span></div>',
      css: '.box { display: flex; align-items: center; justify-content: center; height: 130px; background: #eef2ff; border-radius: 10px; }\nspan { background: #fff; padding: 6px 14px; border-radius: 6px; }',
      js: ''
    },
    errors: [
      '用 line-height 等于 height 来垂直居中单行文字：多行文字一来就崩了，用 flex + align-items 更稳',
      '和 align-content 混：align-content 管"多行之间"的分布，只在换行/多行时才有意义'
    ],
    related: ['css-justify-content', 'css-flex-direction', 'css-height'],
    tip: '<b>「水平垂直都居中」的万能三行</b>：display: flex; justify-content: center; align-items: center; —— 这是现代 CSS 最常用的一段代码。'
  },

  {
    id: 'css-gap', name: 'gap', zh: '间隙',
    purpose: '给弹性/网格布局的子项之间统一留间距，比给每个子项写 margin 干净得多（不会在边缘多出一截）。',
    syntax: 'display: flex;\ngap: 12px;\ngap: 12px 20px;   /* 行间距 列间距 */',
    status: 'modern',
    keywords: ['间距', '间隙', 'flex', 'grid', '排版'],
    example: {
      html: '<div class="g1"><div>1</div><div>2</div><div>3</div></div>\n<p>用 gap，首尾不会多出空隙。</p>',
      css: '.g1 { display: flex; gap: 14px; background: #f7f8fa; padding: 10px; border-radius: 8px; }\n.g1 div { flex: 1; background: #e9f7ec; padding: 10px; text-align: center; border-radius: 6px; }',
      js: ''
    },
    errors: [
      '在很旧的浏览器上 gap 对 flex 不支持（现在主流浏览器都支持了）',
      '给每个子项写 margin-right 然后在最后一个上又要删掉：直接用 gap 更省事'
    ],
    related: ['css-flex-direction', 'css-margin', 'css-justify-content']
  },

  {
    id: 'css-grid-template-columns', name: 'grid-template-columns', zh: '网格列定义',
    purpose: '直接描述"我要几列、每列多宽"。配合 repeat()、fr、auto-fit 能做很强的不写媒体查询就自适应的布局。',
    syntax: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngrid-template-columns: repeat(auto-fit, minmax(180px, 1fr));',
    status: 'modern',
    keywords: ['网格', '栅格', '多列', 'auto-fit', 'fr', 'grid'],
    example: {
      html: '<div class="cards">\n  <div>卡片 1</div><div>卡片 2</div><div>卡片 3</div><div>卡片 4</div>\n</div>\n<p>把预览窗口拉窄，它们会自动换行 —— 没有写一行媒体查询。</p>',
      css: '.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }\n.cards div { background: #eef2ff; padding: 16px 12px; border-radius: 10px; text-align: center; }',
      js: ''
    },
    errors: [
      '用 grid 却只想排一维（一行或一列）：那种情况 flex 更合适',
      '忘记 display: grid：单独写 grid-template-columns 不起作用',
      '1fr 和 px 混用时算错：1fr 分的是"剩余空间"，不是"总宽度"'
    ],
    related: ['css-gap', 'css-display', 'css-flex-direction'],
    tip: '<b>这一行值得背下来</b>：<b>grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))</b> —— 「每个格子最小 180px，剩下的平均分，装不下就换行」。卡片列表几乎不用再写响应式断点。'
  },

  {
    id: 'css-transition', name: 'transition', zh: '过渡',
    purpose: '让属性变化"慢慢变"而不是瞬间切换。参数：哪个属性、多久、什么曲线、延迟多久。',
    syntax: 'transition: background-color .15s ease;',
    status: 'modern',
    keywords: ['过渡', '动画', '渐变', 'hover'],
    example: {
      html: '<button class="btn">鼠标悬停我</button>\n<button class="btn no">我没有过渡（瞬间变）</button>',
      css: '.btn { padding: 9px 20px; border: 0; border-radius: 8px; background: #2f6fdd; color: #fff; margin-right: 8px; transition: background-color .15s ease; }\n.btn:hover { background: #1f4fa8; }\n.no { transition: none; }',
      js: ''
    },
    errors: [
      '写 transition: all .5s：什么都animate，会连布局属性一起过渡，卡顿且不可控',
      '时长写 1s 以上：界面反馈会显得迟钝，150–250ms 通常最舒服',
      '用 transition 过渡 display：display 不是可过渡属性，要配合 visibility 或 opacity'
    ],
    related: ['css-transform', 'css-opacity', 'css-background-color'],
    tip: '<b>克制一点</b>：过渡应该让"状态变化更容易被察觉"，而不是表演。&lt;150ms 按钮反馈、200ms 左右的面板展开就够了。'
  },

  {
    id: 'css-transform', name: 'transform', zh: '变换',
    purpose: '平移、旋转、缩放、倾斜。它只影响绘制，不改动布局，所以做动效性能好。',
    syntax: 'transform: translateX(-50%);\ntransform: rotate(45deg) scale(1.1);',
    status: 'modern',
    keywords: ['变换', '旋转', '缩放', '位移', 'translate', 'rotate'],
    example: {
      html: '<div class="row">\n  <div class="t shift">translate</div>\n  <div class="t rot">rotate</div>\n  <div class="t scale">scale</div>\n</div>',
      css: '.row { display: flex; gap: 16px; align-items: center; padding: 20px 10px; }\n.t { background: #eef2ff; padding: 10px 14px; border-radius: 8px; font-size: 13px; }\n.shift { transform: translateY(-8px); }\n.rot { transform: rotate(-6deg); }\n.scale { transform: scale(1.15); }',
      js: ''
    },
    errors: [
      '用 top/left 做位移动画：会触发重排，性能差；用 transform 更顺',
      '多个变换分开写两条 transform：后面那条会覆盖前面，要写在同一条里',
      'transform 会创建新的层叠上下文，可能让 z-index 表现变得意外'
    ],
    related: ['css-transition', 'css-top', 'css-z-index']
  },

  {
    id: 'css-opacity', name: 'opacity', zh: '透明度',
    purpose: '整个元素（连同子元素一起）的透明程度，0 全透明、1 不透明。',
    syntax: 'opacity: 0.6;',
    status: 'modern',
    keywords: ['透明', '不透明度', '淡出'],
    example: {
      html: '<div class="o">opacity: 1（默认）</div>\n<div class="o o6">opacity: 0.6 —— 注意里面的文字也跟着变淡了</div>\n<div class="o o2">opacity: 0.2</div>',
      css: '.o { background: #2f6fdd; color: #fff; padding: 10px; border-radius: 8px; margin-bottom: 8px; }\n.o6 { opacity: .6; }\n.o2 { opacity: .2; }',
      js: ''
    },
    errors: [
      '只想让背景半透明，却用 opacity：文字也会一起变淡。应该用 rgba() 或 hsl() 的 alpha 通道写背景色',
      'opacity: 0 的元素还能被点到：它只是透明，仍然占位且响应鼠标，要彻底无效得加 pointer-events: none 或 display: none'
    ],
    related: ['css-display', 'css-background-color', 'css-z-index']
  },

  {
    id: 'css-cursor', name: 'cursor', zh: '鼠标指针样式',
    purpose: '指定鼠标移上来时显示什么指针。pointer 是"这是可点的"，是最有用的一种。',
    syntax: 'cursor: pointer | default | text | not-allowed | grab;',
    status: 'modern',
    keywords: ['鼠标', '指针', '手型', 'pointer'],
    example: {
      html: '<p class="c1">cursor: pointer（手型）</p>\n<p class="c2">cursor: text（文本光标）</p>\n<p class="c3">cursor: not-allowed（禁止）</p>\n<p class="c4">cursor: help（问号）</p>',
      css: 'p { padding: 8px 12px; background: #f7f8fa; border-radius: 6px; margin-bottom: 8px; }\n.c1 { cursor: pointer; }\n.c2 { cursor: text; }\n.c3 { cursor: not-allowed; }\n.c4 { cursor: help; }',
      js: ''
    },
    errors: [
      '给 <div> 加了点击事件却忘了 cursor: pointer：用户根本不知道这里能点',
      '给禁用的按钮设 cursor: pointer：应该用 not-allowed，否则是在骗用户'
    ],
    related: ['css-display', 'attr-disabled', 'html-button']
  }

];
