# CONTEXT.md — 共享语言词典

## 项目身份

- **项目名**: Artstation Critic
- **描述**: AI 驱动的美术作品点评工具
- **用户**: 美术创作者（中文使用者为主）
- **定位**: 本地存储、隐私友好的点评工具，无需注册

## 术语表

| 术语 | 含义 | 说明 |
|------|------|------|
| `'use client'` | 客户端组件标记 | 所有页面和交互组件都是 client component |
| `'use server'` | Server Action 标记 | AI API 调用使用 Server Action（在 `lib/critique.ts`） |
| `ArtworkCritique` | 点评结果类型 | 6 维度评分 + 整体印象 + 优点/改进/建议 |
| `CritiqueRecord` | 历史记录类型 | IndexedDB 中存储的完整记录（含 base64 图片） |
| `UserSettings` | 用户设置类型 | API 配置（apiKey / apiBase / model / image 系列） |
| `critiqueArtwork()` | Server Action | 上传图片 → AI API → 返回结构化点评 |
| OpenAI SDK | AI API 客户端 | 实际用于 DeepSeek / 火山方舟（兼容 OpenAI 格式） |
| IndexedDB | 浏览器本地数据库 | 存储历史点评记录（含图片 base64） |
| localStorage | 浏览器本地存储 | 存储 API 设置 |

## 文件命名约定

| 类型 | 模式 | 示例 |
|------|------|------|
| 测试文件 | `*.test.ts` / `*.test.tsx` | `critique.test.ts` |
| 组件 | PascalCase | `CritiqueResults.tsx` |
| 工具库 | kebab-case | `batch-upload.ts`, `trend-analysis.ts` |
| 页面 | `page.tsx` | Next.js App Router 惯例 |
| ADR | `ADR-NNN-title.md` | `ADR-003-indexeddb-storage.md` |

## 路由清单

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `app/page.tsx` | 首页（上传 + 点评） |
| `/history` | `app/history/page.tsx` | 历史记录 + 趋势分析 |
| `/settings` | `app/settings/page.tsx` | API 设置 |
| 根布局 | `app/layout.tsx` | SEO + 字体 + 全局样式 |

## 环境变量

| 变量 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `DEEPSEEK_API_KEY` | 二选一 | — | DeepSeek API Key |
| `DEEPSEEK_API_BASE` | 否 | `https://api.deepseek.com/v1` | API 地址 |
| `ARK_API_KEY` | 二选一 | — | 火山方舟 API Key |
| `ARK_API_BASE` | 否 | `https://ark.cn-beijing.volces.com/api/v3` | 火山方舟 API 地址 |

> API Key 也可在 `/settings` 页面网页配置，优先级：网页设置 > 环境变量。

## 架构红线

1. **所有页面都是 `'use client'`** — 没有服务端渲染的页面组件
2. **所有 AI 调用走 Server Action** — API Key 不在客户端暴露
3. **数据全在本地** — 没有后端服务，没有云同步
4. **部署平台**: Netlify (OpenNext 适配器)
5. **Node.js**: >=20（`netlify.toml` 中指定 `NODE_VERSION = "20"`）

## 开发规范

- TDD: 先写测试，再实现（RED → GREEN → REFACTOR）
- 垂直切片：每次只做一个小功能（一个 RED→GREEN→REFACTOR 循环）
- 中文 UI，英文代码/术语
- 维度名称双语显示（如"构图 (Composition)"）
