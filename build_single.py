#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_single.py — 把整个工具箱打包成一个单独的 HTML 文件

用途：手机上只存一个文件就能用（微信/Telegram 传过去、存到「文件」里、点开就能跑），
      不用联网、不用登录任何账号、不需要服务器。

它做的事：
  1. 把 css/style.css 内联进 <style>
  2. 把 js/data/*.js、js/data.js、js/search.js、js/playground.js、js/app.js 依次内联进 <script>
     （顺序必须和 index.html 里一致，否则 window.WDT 还没定义就被用了）
  3. 去掉 manifest / service worker / 外链图标（单文件版里这些没意义，file:// 下还会报错）
  4. 把图标内联成 data: URI 的 favicon
  5. 在 <title> 里标上「单文件」

用法：  python build_single.py
产物：  工具箱-单文件.html
"""

import base64
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'index.html')
OUT = os.path.join(HERE, '工具箱-单文件.html')

# 内联顺序 —— 必须和 index.html 底部一致
JS_ORDER = [
    'js/data/html-tags.js',
    'js/data/html-attrs.js',
    'js/data/css-props.js',
    'js/data/js-methods.js',
    'js/data/concepts.js',
    'js/data.js',
    'js/search.js',
    'js/playground.js',
    'js/app.js',
]


def read(rel):
    with open(os.path.join(HERE, rel), encoding='utf-8') as f:
        return f.read()


def main():
    if not os.path.exists(SRC):
        sys.exit('找不到 index.html，请在项目根目录运行')

    html = read('index.html')

    # ---- 1. 内联 CSS ----
    css = read('css/style.css')
    html, n = re.subn(r'<link[^>]*rel="stylesheet"[^>]*>', '<style>\n' + css + '\n</style>', html, count=1)
    if n != 1:
        sys.exit('没找到 link stylesheet')

    # ---- 2. 内联 JS（按顺序） ----
    for rel in JS_ORDER:
        code = read(rel)
        # 防止代码里出现 </script> 提前截断（本项目的字符串里没有，保险起见）
        code = code.replace('</script', '<\\/script')
        tag = re.escape('<script src="%s"></script>' % rel)
        html, n = re.subn(tag, lambda m: '<script>\n' + code + '\n</script>', html, count=1)
        if n != 1:
            sys.exit('没找到 script 标签: %s' % rel)

    # ---- 3. 去掉 manifest / 图标链接 / SW 注册 ----
    html = re.sub(r'<link[^>]*rel="manifest"[^>]*>\s*', '', html)
    html = re.sub(r'<link[^>]*rel="icon"[^>]*>\s*', '', html)
    html = re.sub(r'<link[^>]*rel="apple-touch-icon"[^>]*>\s*', '', html)
    # 把 SW 注册那段整块删掉（单文件版是 file:// 打开，注册没意义）
    html = re.sub(r'\n<script>\s*/\* 注册离线缓存。.*?</script>\n', '\n', html, flags=re.S)

    # ---- 4. favicon 内联成 data URI ----
    ico = os.path.join(HERE, 'icons', 'favicon-32.png')
    if os.path.exists(ico):
        with open(ico, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('ascii')
        html = html.replace('</title>',
                            '</title>\n<link rel="icon" href="data:image/png;base64,%s">' % b64, 1)

    # ---- 5. 标题标记 ----
    html = html.replace('<title>Web 学习工具箱 · HTML / CSS / JavaScript</title>',
                        '<title>Web 学习工具箱（单文件版）</title>', 1)

    # ---- 6. 顶部加一行说明 ----
    note = ('<!--\n'
            '  Web 学习工具箱 · 单文件版\n'
            '  ------------------------------------------------------------------\n'
            '  这一个文件就是完整工具：样式和全部词条都内联在里面，不联网也能用。\n'
            '  手机：存到「文件」里，点开选浏览器打开即可；也可以「添加到主屏幕」。\n'
            '  电脑：双击就能开。\n'
            '  注意：这是自动生成的产物，请改源码（index.html / css / js），\n'
            '        然后重新运行 build_single.py，不要直接改这个文件。\n'
            '  ------------------------------------------------------------------\n'
            '  词条数据全部在 js/data/*.js 里，加内容只改那些文件。\n'
            '-->\n')
    html = note + html

    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)

    # ---- 报告 ----
    # 统计外链时必须先剥掉 <script> 的内容：
    # 文档本身就是讲 HTML 的，正文里会出现 '<script src="app.js"></script>' 这种示例字符串，
    # 直接数会假报「残留外链」。
    skeleton = re.sub(r'<script[^>]*>.*?</script>', '<S/>', html, flags=re.S)
    left = re.findall(r'<script[^>]*\ssrc=', skeleton) + \
           re.findall(r'<link[^>]*rel="stylesheet"', skeleton)
    # 真正的外层 script 标签数：用骨架里剩下的 <S/> 占位符来数
    real_blocks = len(re.findall(r'<S/>', skeleton))

    entries_total = sum(len(re.findall(r"^\s*id: '", read(p), re.M))
                        for p in JS_ORDER if p.startswith('js/data/'))
    size = os.path.getsize(OUT)
    print('产物: %s' % os.path.basename(OUT))
    print('大小: %.1f KB' % (size / 1024))
    print('行数: %d' % (html.count('\n') + 1))
    print('词条: %d 条' % entries_total)
    print('残留外链: %d 个 %s' % (len(left), '✓ 应为 0' if not left else '（有问题）'))
    print('内联 script 块: %d 个' % real_blocks)
    print('（文档正文里还有几处 <script> / <style> 字样，那是词条示例的内容，不算真标签）')
    if len(left):
        for x in left:
            print('   !!', x[:80])


if __name__ == '__main__':
    main()
