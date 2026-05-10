# Artstation Critic

AI 驱动的美术作品点评工具。上传作品图片，获得涵盖构图、色彩、技法等 6 个维度的专业反馈。

## 技术栈

- **框架**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + Tailwind CSS 4
- **API**: DeepSeek / 火山方舟 Ark（OpenAI 兼容格式）
- **存储**: IndexedDB（历史记录）、localStorage（用户设置）
- **测试**: Vitest + Testing Library

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

首次使用需在 `/settings` 页面配置 API 地址和 API Key（或写入 `.env.local`）。

## 项目结构

```
artstation-critic/
├── app/                          # Next.js App Router 页面
│   ├── page.tsx                  # 首页（上传 + 点评）
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   ├── history/
│   │   └── page.tsx              # 历史记录页面
│   └── settings/
│       └── page.tsx              # API 设置页面
├── components/
│   └── CritiqueResults.tsx       # 点评结果展示组件
├── lib/
│   ├── critic-prompt.ts          # System prompt 模板
│   ├── critique.ts               # Server Action: 调用 AI 进行点评
│   ├── critique.test.ts          # 点评逻辑测试
│   ├── history.ts                # IndexedDB 历史记录操作
│   ├── history.test.ts           # 历史记录测试
│   └── settings.ts               # localStorage 设置读写
├── public/
│   └── favicon.ico               # 网站图标
├── .env.local                    # 环境变量（不提交）
├── .env.example                  # 环境变量示例
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── vite.config.ts                # Vitest 配置
├── vitest.setup.ts               # 测试环境设置
├── package.json
└── README.md
```

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（Turbopack） |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npx vitest run` | 运行测试 |
| `npx vitest` | 交互式测试模式 |

## 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 二选一 |
| `DEEPSEEK_API_BASE` | DeepSeek API 地址（可选） | 否 |
| `ARK_API_KEY` | 火山方舟 API Key | 二选一 |
| `ARK_API_BASE` | 火山方舟 API 地址（可选） | 否 |

> **注意**: `.env.local` 不会被提交到 Git。复制 `.env.example` 创建 `.env.local` 并填入你的 API Key。

## 功能特性

### ✅ MVP（已完成）
- [x] 单图上传（文件选择 + 预览）
- [x] 6 维度美术点评（构图、色彩光影、氛围情绪、技法、叙事、商业价值）
- [x] AI 生成点评报告（中文输出）
- [x] 历史记录（IndexedDB 本地存储）
- [x] API 设置页面（支持 DeepSeek / 火山方舟）

### 🔄 Phase 2（待实现）
- [ ] AI 生成对比优化图
- [ ] 批量上传支持
- [ ] 拖拽上传 + 剪贴板粘贴
- [ ] 同图多次上传对比
- [ ] UI/UX 优化

## 开发规范

- **TDD 优先**: 先写测试，再实现功能
- **垂直切片**: 每次只做一个小功能，完成一个再下一个
- **测试覆盖**: 核心逻辑必须有测试

## License

MIT
