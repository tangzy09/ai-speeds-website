# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ai-speeds.com 主域名门户：单页静态站，汇总全部线上项目卡片。无构建步骤，纯 `index.html`（内联 CSS/JS）+ `locales/*.json` 四语（zh-CN/en/ja/fr）+ `js/i18n.js` 轻量引擎。

## 常用命令

```bash
node tools/check-locales.js      # locale 键集校验（en.json 为基准），deploy.sh 的门禁
bash deploy.sh "提交说明"        # 提交+校验+push+EC2 拉取（仅在用户明确要求部署时用）
npx http-server -p 8080          # 本地预览（locale 走 fetch，必须 http）
```

线上 = EC2 `/var/www/ai-speeds-website`，`git push` 不会自动更新线上，必须走 deploy.sh 或手动 SSH pull。

## 架构与约定

- 文案零硬编码：DOM 元素挂 `data-i18n="dotted.key"`，语言切换由 `js/i18n.js` 检测/持久化（存储键 `as_lang`）；首屏字面 HTML 写英文（= en.json 值，供爬虫读）。
- SEO 资产要同步维护：`index.html` 头部的 ItemList JSON-LD、`sitemap.xml` 的 lastmod、`og.png`。
- 站点卡片缩略图 `images/<id>.jpg`：移动布局的站用 640×400@2x 窄视口截图（1280 宽会把 app 缩成细条），桌面站用 1280×800。
- **新增一张项目卡的完整清单**：4 个 locale 加 `projects.<id>`（name/tag/desc）→ `index.html` 加卡片模板 + `.t-<id>` 渐变 tile → hero 计数 `data-i18n-params` +1 → ItemList JSON-LD 加条目 → 截图入 `images/` → sitemap lastmod → `node tools/check-locales.js` → deploy。
- 私人/内部站（ina、dive、mmu）不上门户。
