# CLAUDE.md

Artstation Critic 项目的开发助手配置。

## 项目简介

AI 驱动的美术作品点评工具。上传作品图片，获得 6 维度专业反馈。

## 技术栈

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 5
- Vitest 4
- DeepSeek API (兼容 OpenAI 格式)
- 部署: Netlify (OpenNext 适配器)

## 核心文件

| 文件 | 说明 |
|------|------|
| `app/page.tsx` | 首页（上传 + 点评） |
| `app/history/page.tsx` | 历史记录页面 |
| `app/settings/page.tsx` | API 设置页面 |
| `components/CritiqueResults.tsx` | 点评结果组件 |
| `lib/critique.ts` | AI 点评 Server Action |
| `lib/critic-prompt.ts` | System prompt 模板 |
| `lib/history.ts` | IndexedDB 存储 |
| `lib/settings.ts` | localStorage 设置 |
| `netlify.toml` | Netlify 部署配置 |

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm start            # 生产服务器
npx vitest run       # 运行测试
```

## 开发规范

- **TDD**: 先写测试，再实现功能
- **垂直切片**: 每次只做一个小功能
- **中文界面**: 保留英文品牌名
- **Server Action**: 用于 AI API 调用

## 测试

```bash
npx vitest run       # 运行所有测试
```

测试文件：
- `lib/*.test.ts` — 核心逻辑测试
- `components/*.test.tsx` — 组件测试
- `app/*.test.tsx` — 页面测试

## 环境变量

```bash
DEEPSEEK_API_KEY=sk-your-key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

## 文档

- `CONTEXT.md` — 共享语言词典（术语、路由、红线、规范）
- `docs/INDEX.md` — 文档总览
- `docs/QUICKSTART.md` — 快速开始
- `docs/ARCHITECTURE.md` — 架构设计
- `docs/ROADMAP.md` — 路线图
- `docs/TESTING.md` — 测试指南
- `docs/DEPLOYMENT.md` — 部署指南 (Netlify)
- `docs/DECISIONS.md` — ADR 索引
- `docs/adr/` — 独立 ADR 文件（8 条）

## 当前状态

✅ Phase 1 MVP — 完成
✅ Phase 2 迭代 — 全部完成（拖拽上传 / AI 优化图 / 批量上传 / 趋势分析 / UI 优化）
✅ 部署到 Netlify（已上线）

## 已知问题

- Netlify 部署偶现 "Server Components render" 错误，确认环境变量和 Node.js 版本（20）已配置。详见 `docs/DEPLOYMENT.md`。
