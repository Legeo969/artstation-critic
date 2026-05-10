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

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
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
npx vitest           # 交互式模式
```

测试文件：
- `lib/critique.test.ts`
- `lib/critic-prompt.test.ts`
- `lib/history.test.ts` (跳过)
- `app/page.test.tsx`

## 环境变量

```bash
DEEPSEEK_API_KEY=sk-your-key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

## 文档

- `docs/INDEX.md` - 文档总览
- `docs/QUICKSTART.md` - 快速开始
- `docs/ARCHITECTURE.md` - 架构设计
- `docs/ROADMAP.md` - 路线图
- `docs/TESTING.md` - 测试指南
- `docs/DEPLOYMENT.md` - 部署指南

## 当前状态

✅ Phase 1 MVP 完成
✅ 网页设置 API Key 可用
✅ AI 点评功能测试通过

### Phase 2 决策（已确认）

| 决策项 | 用户选择 |
|--------|----------|
| AI 生成模型 | GPT-4o（付费） |
| 批量上传数量 | 5 张 |
| 同图对比展示 | 折线图 |
| UI 优化参考 | 主流趋势 |

### Phase 2 Issue 列表

| # | Issue | 优先级 | 预计时间 |
|---|-------|--------|----------|
| 8 | 拖拽上传 + 剪贴板 | P0 | 1-2 天 |
| 9 | AI 生成对比图（GPT-4o） | P1 | 3-5 天 |
| 10 | 批量上传（5 张） | P2 | 2-3 天 |
| 11 | 同图多次对比（折线图） | P3 | 2-3 天 |
| 12 | UI/UX 优化（主流趋势） | P4 | 2-3 天 |

📍 **准备开始 Phase 2**

下一步：
1. 推送到 GitHub
2. 部署到 Vercel
3. 开始 P0（拖拽上传）开发
