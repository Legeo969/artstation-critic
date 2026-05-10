# 文档索引

Artstation Critic 项目文档总览。

---

## 📚 项目文档

| 文档 | 说明 | 适合人群 |
|------|------|----------|
| [README.md](../README.md) | 项目简介、快速开始 | 所有人 |
| [QUICKSTART.md](./QUICKSTART.md) | 详细安装和使用指南 | 新用户 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 技术架构设计 | 开发者 |
| [ROADMAP.md](./ROADMAP.md) | 项目路线图 | 所有人 |
| [TESTING.md](./TESTING.md) | 测试指南 | 开发者 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 部署指南 | 运维/开发者 |
| [DECISIONS.md](./DECISIONS.md) | 架构决策记录 | 开发者 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献指南 | 贡献者 |
| [CHANGELOG.md](../CHANGELOG.md) | 变更日志 | 所有人 |

---

## 🚀 快速导航

### 我想...

| 目标 | 文档 |
|------|------|
| 快速上手 | [QUICKSTART.md](./QUICKSTART.md) |
| 了解架构 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 运行测试 | [TESTING.md](./TESTING.md) |
| 部署上线 | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 参与开发 | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| 查看计划 | [ROADMAP.md](./ROADMAP.md) |

---

## 📁 项目结构

```
artstation-critic/
├── 📖 README.md              # 项目简介
├── 📖 CHANGELOG.md           # 变更日志
├── 📖 CONTRIBUTING.md        # 贡献指南
│
├── 📂 docs/                  # 详细文档
│   ├── INDEX.md              # 本文档
│   ├── QUICKSTART.md         # 快速开始
│   ├── ARCHITECTURE.md       # 架构设计
│   ├── ROADMAP.md            # 路线图
│   ├── TESTING.md            # 测试指南
│   ├── DEPLOYMENT.md         # 部署指南
│   └── DECISIONS.md          # 架构决策
│
├── 📂 app/                   # Next.js 页面
│   ├── page.tsx              # 首页
│   ├── layout.tsx            # 根布局
│   ├── history/page.tsx      # 历史记录
│   └── settings/page.tsx     # 设置
│
├── 📂 components/            # React 组件
│   └── CritiqueResults.tsx   # 点评结果
│
├── 📂 lib/                   # 核心逻辑
│   ├── critique.ts           # AI 点评
│   ├── critic-prompt.ts      # System prompt
│   ├── history.ts            # IndexedDB 存储
│   └── settings.ts           # 用户设置
│
├── 📂 .github/               # GitHub 配置
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md
│
└── 📂 public/                # 静态资源
```

---

## 🎯 开发流程

```
1. 阅读 README.md → 了解项目
2. 阅读 QUICKSTART.md → 本地运行
3. 阅读 ARCHITECTURE.md → 理解架构
4. 阅读 CONTRIBUTING.md → 准备贡献
5. 阅读 TESTING.md → 编写测试
6. 阅读 ROADMAP.md → 选择任务
```

---

## 📞 获取帮助

| 问题类型 | 文档 |
|----------|------|
| 安装问题 | [QUICKSTART.md](./QUICKSTART.md) |
| 架构疑问 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 测试问题 | [TESTING.md](./TESTING.md) |
| 部署问题 | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 其他问题 | 创建 Issue |

---

## 📝 文档维护

- 文档应与代码同步更新
- 重要变更需更新 CHANGELOG.md
- 架构变更需更新 ARCHITECTURE.md 和 DECISIONS.md
- 新功能需添加相应测试文档
