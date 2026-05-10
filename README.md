# Artstation Critic

AI 驱动的美术作品点评工具。上传作品图片，获得涵盖构图、色彩、技法等 6 个维度的专业反馈，并追踪个人进步轨迹。

---

## 🚀 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`，在 `/settings` 页面配置 API Key 即可使用。

---

## ✨ 功能特性

### ✅ 核心功能（全部完成）

| 功能 | 说明 | 状态 |
|------|------|------|
| 单图上传 | 文件选择 + 预览 | ✅ |
| 拖拽上传 | 拖拽 + Ctrl+V 粘贴 | ✅ |
| 6 维度点评 | 构图、色彩光影、氛围情绪、技法、叙事、商业潜力 | ✅ |
| AI 点评报告 | 中文输出，结构化反馈 | ✅ |
| AI 优化图 | DALL-E 3 生成优化对比图 | ✅ |
| 批量上传 | 最多 5 张，串行处理 | ✅ |
| 历史记录 | IndexedDB 本地存储 | ✅ |
| 进步追踪 | 同图多次上传，折线图趋势分析 | ✅ |
| 设置页面 | API Key 网页配置 | ✅ |

### 🎨 UI/UX

- 现代化设计语言（毛玻璃、渐变、阴影）
- 响应式布局（桌面 + 移动端）
- 平滑动画过渡
- 深色模式支持
- 可访问性增强（ARIA、键盘导航）

---

## 📦 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 (App Router, Turbopack) |
| **UI** | React 19 + Tailwind CSS 4 |
| **AI 点评** | DeepSeek-VL / 火山方舟（OpenAI 兼容） |
| **AI 图像** | DALL-E 3 (GPT-4o) |
| **存储** | IndexedDB（历史记录）、localStorage（设置） |
| **测试** | Vitest + Testing Library |
| **代码质量** | ESLint + Prettier + Husky |

---

## 📁 项目结构

```
artstation-critic/
├── 📖 README.md                    # 项目简介（本文件）
├── 📖 CHANGELOG.md                 # 变更日志 (v0.1.6)
├── 📖 CONTRIBUTING.md              # 贡献指南
├── 📖 LICENSE                      # MIT 许可证
├── 📖 CLAUDE.md                    # 开发助手配置
├── 📖 PROJECT_SUMMARY.md           # 工程整理总结
│
├── 📂 docs/                        # 详细文档
│   ├── INDEX.md                    # 文档索引
│   ├── QUICKSTART.md               # 快速开始
│   ├── ARCHITECTURE.md             # 架构设计
│   ├── ROADMAP.md                  # 路线图
│   ├── TESTING.md                  # 测试指南
│   ├── DEPLOYMENT.md               # 部署指南
│   ├── DECISIONS.md                # 架构决策
│   └── ISSUES.md                   # Issue 列表
│
├── 📂 app/                         # Next.js App Router
│   ├── page.tsx                    # 首页（上传 + 点评）
│   ├── layout.tsx                  # 根布局（SEO + 中文）
│   ├── globals.css                 # 全局样式（完整系统）
│   ├── history/page.tsx            # 历史记录
│   └── settings/page.tsx           # API 设置
│
├── 📂 components/                  # React 组件
│   ├── CritiqueResults.tsx         # 点评结果展示
│   ├── Dropzone.tsx                # 拖拽上传
│   ├── OptimizationView.tsx        # AI 优化对比
│   ├── UploadQueue.tsx             # 批量上传队列
│   ├── HistoryAnalysis.tsx         # 历史分析视图
│   └── TrendChart.tsx              # 趋势折线图
│
├── 📂 lib/                         # 核心逻辑
│   ├── index.ts                    # 统一导出
│   ├── critique.ts                 # AI 点评 API
│   ├── critic-prompt.ts            # System Prompt
│   ├── history.ts                  # IndexedDB 存储
│   ├── settings.ts                 # 设置管理
│   ├── optimization.ts             # DALL-E 3 图像生成
│   ├── batch-upload.ts             # 批量上传逻辑
│   └── trend-analysis.ts           # 趋势分析逻辑
│
├── 📂 public/                      # 静态资源
│   ├── favicon.ico
│   └── *.svg                       # 页面图标
│
├── 📂 .github/                     # GitHub 配置
│   ├── ISSUE_TEMPLATE/             # Issue 模板
│   ├── workflows/                  # CI/CD
│   └── ...                         # 其他配置
│
├── 📂 .husky/                      # Git 钩子
│   └── pre-commit                  # lint + test
│
└── 📂 配置文件                     # package.json 等
```

---

## 🎯 开发阶段

### Phase 1 - MVP ✅

| Issue | 功能 | 状态 |
|-------|------|------|
| #1 | Next.js 项目脚手架 | ✅ |
| #2 | 单图上传 | ✅ |
| #3 | Art Mentor System Prompt | ✅ |
| #4 | AI API 集成 | ✅ |
| #5 | 点评结果页面 | ✅ |
| #6 | IndexedDB 历史记录 | ✅ |
| #7 | 历史记录页面 | ✅ |

### Phase 2 - 迭代 ✅

| Issue | 功能 | 优先级 | 状态 |
|-------|------|--------|------|
| #8 | 拖拽上传 + 剪贴板 | P0 | ✅ |
| #9 | AI 生成优化图 | P1 | ✅ |
| #10 | 批量上传（5 张） | P2 | ✅ |
| #11 | 同图多次对比（折线图） | P3 | ✅ |
| #12 | UI/UX 优化 | P4 | ✅ |

---

## 📊 测试状态

```
Test Files:  11 passed | 1 skipped (12)
Tests:       86 passed | 3 skipped (89)
```

| 模块 | 测试文件 | 测试数 |
|------|----------|--------|
| 点评逻辑 | `lib/critique.test.ts` | 3 |
| Prompt | `lib/critic-prompt.test.ts` | 3 |
| 历史记录 | `lib/history.test.ts` | 1 |
| 图像优化 | `lib/optimization.test.ts` | 13 |
| 批量上传 | `lib/batch-upload.test.ts` | 9 |
| 趋势分析 | `lib/trend-analysis.test.ts` | 9 |
| Dropzone | `components/Dropzone.test.tsx` | 9 |
| 优化视图 | `components/OptimizationView.test.tsx` | 10 |
| 上传队列 | `components/UploadQueue.test.tsx` | 10 |
| 趋势图表 | `components/TrendChart.test.tsx` | 7 |
| 历史分析 | `components/HistoryAnalysis.test.tsx` | 8 |
| 首页 | `app/page.test.tsx` | 4 |

---

## 🔧 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（Turbopack） |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npx vitest run` | 运行测试 |
| `npx vitest` | 交互式测试模式 |
| `npx vitest watch` | 监听模式 |

---

## 🔐 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 二选一 |
| `DEEPSEEK_API_BASE` | DeepSeek API 地址 | 否 |
| `OPENAI_API_KEY` | OpenAI API Key（用于 DALL-E 3） | 用于优化图 |

> **注意**: API Key 可通过 `/settings` 页面配置，无需 `.env.local`。

---

## 🌐 部署

### Vercel（推荐）

```bash
# 1. 推送到 GitHub
git push origin master

# 2. 在 Vercel 导入项目
# 3. 配置环境变量
# 4. 一键部署
```

详见 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)。

---

## 📝 开发规范

- **TDD 优先**: 先写测试，再实现功能
- **垂直切片**: 每次只做一个小功能
- **测试覆盖**: 核心逻辑必须有测试
- **中文界面**: 用户界面使用中文，代码/术语保持英文

---

## 📄 License

MIT

---

## 🙏 致谢

- [Matt Pocock](https://github.com/mattpocock) - AI 工程方法论
- [DeepSeek](https://deepseek.com) - AI 模型
- [Vercel](https://vercel.com) - 部署平台
