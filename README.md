# Web 学习工具箱（HTML / CSS / JavaScript）

给初学者用的**速查 + 试验**工具：左边查词条，中间读讲解，右边直接改代码看效果。
除了 HTML / CSS / JavaScript，还带一个独立的「语法对照」分类，横向对比
Python / HTML / CSS / JavaScript 的符号、写法和常见陷阱。

原生 HTML / CSS / JavaScript，**零依赖、零构建、不需要联网**。

---

## 一、怎么运行

### 方式 A：双击（最简单）

双击 `index.html` 即可。

> 本项目刻意**没有**用 ES Module（`import`/`export`）和 `fetch()` 读数据 —— 这两种写法在
> `file://` 协议下会被浏览器以安全策略拦截。数据用普通 `<script>` 挂到全局，所以双击就能跑。

### 方式 B：本地服务器（推荐长期使用）

地址固定、方便加书签，行为也最接近真实网站。

```bash
cd webdev-toolbox
python -m http.server 8000
```

然后浏览器打开 <http://localhost:8000>

（有 Node.js 的话也可以：`npx serve .`）

### 浏览器要求

Chrome / Edge / Firefox / Safari 近两年版本都可以。

---

## 一·补　在手机上用

有三种办法，按「方便程度」从高到低：

### ① 放到网上，手机直接访问（最方便）

把项目传到 GitHub 仓库并开启 Pages，手机浏览器打开 `https://<用户名>.github.io/<仓库名>/` 就能用。

可以**添加到主屏幕** —— 桌面会多一个图标，点开是全屏的，跟 App 一样；装过一次之后**断网也能打开**
（靠 `sw.js` 做离线缓存）。

> 注意：GitHub 免费账号的 Pages **只支持公开仓库**（私有仓库要付费）。
> 本工具是通用教学资料，不含任何个人信息，公开没有风险。

### ② 只带一个文件（不需要账号、不需要联网）

在项目目录里跑：

```bash
python build_single.py
```

会生成 `工具箱-单文件.html` —— **样式和 188 条词条全部内联在这一个文件里**。

把它传到手机（微信 / Telegram / 网盘都行），存到「文件」里，点开选浏览器打开即可。
全程离线可用，不需要登录任何账号，也不需要服务器。

> 这是自动生成的产物。**改内容请改源码**（`js/data/*.js`），然后重新跑一遍 `build_single.py`，
> 不要直接改这个文件 —— 下次重新生成就把它盖掉了。

### ③ 同局域网访问（电脑开着的时候）

```bash
python -m http.server 8000
```

然后在手机浏览器里打开 `http://<电脑的内网IP>:8000`。
（电脑 IP 用 `ipconfig` 查，形如 `192.168.x.x`；手机和电脑要连同一个 Wi-Fi。）

---

## 二、文件结构

```
webdev-toolbox/
├── index.html            # 页面骨架（只有结构，没有内容）
├── manifest.webmanifest  # PWA 配置（添加到主屏幕时用）
├── sw.js                 # 离线缓存（只在 https / localhost 下生效）
├── build_single.py       # 打包成单文件版
├── README.md             # 就是本文件
├── icons/                # 图标（用 _wdt_icons 类似脚本生成，纯手绘无版权问题）
├── css/
│   └── style.css         # 全部样式：主题、三栏布局、响应式
└── js/
    ├── data/             # ★ 词条数据库（加词条只改这里）
    │   ├── html-tags.js      # HTML 标签
    │   ├── html-attrs.js     # HTML 属性
    │   ├── css-props.js      # CSS 属性
    │   ├── js-methods.js     # JavaScript 方法
    │   ├── concepts.js       # 基础概念（标签/属性/变量/函数/方法…）
    │   └── syntax-compare.js # ★ 四语言语法对照（53 条对照 + 4 个专题，共 57 条）
    ├── data.js           # 汇总数据、分类定义、字段校验
    ├── search.js         # 搜索索引与评分排序
    ├── playground.js     # 代码实验区（编辑 + 沙箱预览 + 控制台）
    ├── syntax.js         # 语法对照专用渲染（四语言卡片 / 专题表 / 总表）
    └── app.js            # 界面渲染、路由、键盘快捷键、主题
├── tests/                # 无依赖冒烟测试（Node + 本机 Edge）
│   ├── content-check.js  # 示例代码语法核对（Python 编译 / JS 解析 / CSS HTML 配对）
│   ├── css-top-level.js  # CSS 示例不能有裸声明（缺选择器）
│   ├── name-scan.js      # 渲染结果里查个人信息残留
│   ├── live-check.js     # 线上 Pages 验收（浏览器实开）
│   ├── ui-smoke.js       # 无头 Edge 打开关键页面，检查渲染结果
│   ├── cdp-smoke.js      # 真点按钮：筛选 / 复制 / 收藏 / 主题 / 搜索
│   └── mobile-check.js   # 390px 宽度横向溢出检查 + 截图
```

加载顺序（`index.html` 底部）：`data/*` → `data.js` → `search.js` → `playground.js` → `syntax.js` → `app.js`

---

## 三、功能

| 功能 | 说明 |
| --- | --- |
| 搜索 | 按**名称 / 中文别名 / 用途 / 关键词**搜索，多关键词空格分隔；结果按匹配度排序 |
| 分类导航 | HTML 标签、HTML 属性、CSS 属性、JS 方法、基础概念；另有「收藏」「最近」 |
| 详情面板 | 名称、类别、用途、语法、示例、常见错误、相关概念；过时写法带橙色警告徽章 |
| 代码实验区 | 分 HTML / CSS / JS 三个标签页编辑，`iframe` 沙箱里实时预览，并捕获 `console` 输出 |
| 基础概念 | 专门解释「标签 / 元素 / 属性 / 变量 / 函数 / 方法 / 参数」这些容易混的词 |
| 语法对照 | 独立分类：Python / HTML / CSS / JavaScript 的符号、变量、字符串、判断、循环、函数、注释、DOM 对照；带语言/分类筛选、横向总表、单项详情 |
| 语法对照专题 | 中英文标点、注释语法、同一功能的四种写法、易混淆语法总表 |
| 词条自检 | 侧边栏底部按钮：检查字段缺失、id 重复、`related` 指向不存在的词条 |

### 键盘快捷键

| 按键 | 作用 |
| --- | --- |
| `/` | 聚焦搜索框 |
| `Esc` | 清空搜索 / 关闭手机端目录 |
| `↑` `↓` | 在搜索结果中上下移动 |
| `Enter` | 打开当前高亮词条 |
| `Ctrl/⌘ + Enter` | 在编辑区里运行代码 |
| `Tab` | 在编辑区里插入两个空格（不会跳走焦点） |

### 可以分享的链接

- `index.html#css-flex-direction` —— 直接打开某个词条
- `index.html?q=居中` —— 打开就带着搜索结果
- `index.html?theme=light` —— 强制浅色主题（不会写进本地设置）
- `index.html#__audit` —— 直接打开词条自检面板
- `index.html#__syntax-table` —— 直接打开「语法对照」总表

---

## 四、★ 如何扩展词条库

**加一条词条 = 往对应文件里加一个对象**，不用改任何界面代码。

### 1. 加一个 HTML 标签

打开 `js/data/html-tags.js`，在数组里加：

```js
{
  id: 'html-dialog',            // 唯一标识，建议 类别-名字
  name: '<dialog>',             // 显示名
  zh: '对话框',                  // 中文别名（也会被搜索）
  purpose: '原生的弹出对话框元素，调用 showModal() 后显示在页面最上层。',
  syntax: '<dialog id="d">内容</dialog>',
  status: 'modern',             // modern（推荐）| legacy（旧写法）| deprecated（已废弃）
  keywords: ['弹窗', '模态', 'modal'],
  example: {
    html: '<dialog id="d"><p>我是原生对话框</p><button>关闭</button></dialog>\n<button>打开</button>',
    css: 'dialog { border: 1px solid #ccc; border-radius: 8px; padding: 16px; }',
    js: ''                      // 不用的留空字符串
  },
  errors: ['忘了调用 showModal()，元素默认是不显示的'],
  related: ['html-button', 'html-form'],
  tip: '和 CSS 属性混在一起记容易乱：<dialog> 是标签，它的样式仍然要写在 CSS 里。'
}
```

### 2. 字段说明（缺字段自检会报出来）

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✔ | 全局唯一，路由地址就是 `index.html#你的id` |
| `name` | string | ✔ | 显示名称 |
| `zh` | string | ✔ | 中文别名 |
| `purpose` | string | ✔ | 一句话用途，尽量讲清楚「什么时候用它」 |
| `syntax` | string | ✔ | 语法骨架 |
| `status` | string | ✔ | `modern` / `legacy` / `deprecated` |
| `keywords` | string[] | ✔ | 搜索关键词，可空数组 |
| `example` | object | ✔ | `{ html, css, js }`，三个都写，不用的给空字符串 |
| `errors` | string[] | ✔ | 常见错误，可空数组 |
| `related` | string[] | ✔ | 相关词条 id，可空数组 |
| `tip` | string | ✘ | 新手提示（可选），会渲染成高亮框 |

**类别不用你写**：`html-tags.js` 里的自动归为 `html-tag`，`css-props.js` 里的归为 `css-prop`，以此类推。

### 3. 改完做两件事

1. 刷新页面，点侧边栏底部的**「词条自检」**按钮 —— 会列出字段缺失、id 重复、`related` 写错。
2. 直接访问 `index.html#你的id` 确认能打开。

### 4. 想加一个新类别

在 `js/data.js` 顶部的 `CATS` 数组里加一项（`key` / `label` / `short` / `hex` / `arr`），
再新建对应的 `js/data/xxx.js`，并在 `index.html` 里加一行 `<script src="js/data/xxx.js"></script>`。

### 5. 加一条「语法对照」

打开 `js/data/syntax-compare.js`，往数组里加一个对象。它比普通词条多三个字段：

```js
{
  id: 'syn-bracket', name: '方括号 [ ]', zh: '中括号 / 下标 / 列表',
  group: '符号', confuse: 3,
  purpose: '一句话说明它是干什么的',
  explanation: '中文解释：它在四种语言里分别是什么角色',
  syntax: '数据[位置] / [元素, 元素] / [属性="值"]',
  status: 'modern',
  keywords: ['方括号', '数组', '下标'],
  cmp: {
    python: { code: 'nums[0]', note: '下标' },
    html:   { na: 'HTML 没有方括号语法，正文里的 [] 只是文字。' },
    css:    { code: 'input[type="text"] { }', note: '属性选择器' },
    js:     { code: 'const nums = [1, 2];', note: '数组/下标' }
  },
  errors: ['……'],
  notes: '适用范围和注意事项',
  related: ['syn-list', 'syn-index'],
  playground: { html: '', css: '', js: 'console.log([1, 2][0]);' } // 可选
}
```

规则：

- **不适用就写 `na` 并说明原因**，不要为填满四列编一个不存在的等价语法。
- `group` 只能是这 13 个之一：符号、运算符、变量与数据类型、字符串、条件与循环、函数、代码块、注释、模块与导入、HTML 元素与属性、CSS 选择器与声明、JavaScript DOM 操作、专题。
- `confuse` 是 1 / 2 / 3（3 表示最容易混），详情页会显示徽章。
- `playground` 可选，只放真正能在浏览器里跑的 HTML/CSS/JS；Python 示例放 `cmp.python`，右侧实验区跑不了。
- 加完刷新页面，点「词条自检」，再访问 `index.html#你的id` 确认。

### 6. 跑测试

```bash
node tests/content-check.js   # Python / JS / CSS / HTML 示例语法核对
node tests/css-top-level.js    # CSS 示例不能有裸声明（缺选择器）
node tests/name-scan.js        # 真实渲染结果里查个人信息残留
node tests/live-check.js       # 验收线上 GitHub Pages（真的用浏览器打开）
node tests/ui-smoke.js        # 无头 Edge 渲染检查
node tests/cdp-smoke.js       # 真交互：筛选、复制、收藏、主题、搜索
node tests/mobile-check.js    # 390px 横向溢出 + 截图
```

三个脚本都不依赖 npm 包，只需要本机装了 Edge。

---

## 五、内容口径

写词条时守住这几条，这个工具才可信：

- **HTML 标签、HTML 属性、CSS 属性、JS 方法 严格分家**，不放进同一个列表。
  容易混的（比如 HTML 的 `class` 属性和 CSS 的 `.类名` 选择器）在「基础概念」里专门讲区别。
- 过时写法必须标出来：`status: 'deprecated'` 会在详情里显示橙色徽章，
  并在「常见错误」里写明**现在该用什么代替**。
- 语法要能直接抄走；示例要能在右侧实验区里跑出效果。
- 示例不引用外部资源（图片用内联 `data:` SVG），保证断网也能用。

---

## 六、已知限制 / 可以继续做的

- 示例里的 `fetch()` 在 `file://` 下会失败，这是浏览器的安全策略，不是 bug ——
  该词条的示例故意演示了这个现象。想看它成功，用「方式 B」起本地服务器。
- 词条数量是**第一版**：每类十几个到三十几个，覆盖最常用的部分，不是完整参考手册。
- 语法对照里的 Python 示例**不能在右侧实验区运行**（实验区是浏览器沙箱，只跑 HTML/CSS/JS）。
  详情页会提示复制到本地解释器；需要在线跑 Python 得另接后端。
- 「同一功能的四种写法」里，HTML/CSS 没有变量、判断、循环、函数这些编程结构，
  页面会明确写「不适用」，不是漏写。
- 单文件版没有离线缓存（`sw.js`）—— 它本身就是完整文件，不需要缓存。
- 可以继续加：拼音搜索、代码高亮、深浅色跟随系统、把「收藏」导出成文件、
  按学习顺序排的「新手路线」。
