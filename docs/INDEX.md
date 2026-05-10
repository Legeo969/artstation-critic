# 文档索引

Artstation Critic 项目文档总览。

---

## 📚 项目文档

| 文档 | 说明 | 适合人群 |
|------|------|----------|
| [README.md](../README.md) | 项目简介、快速开始、功能概览 | 所有人 |
| [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) | 工程整理总结、文件统计 | 开发者 |
| [CHANGELOG.md](../CHANGELOG.md) | 变更日志（v0.1.0 → v0.1.6） | 所有人 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献指南、开发规范 | 贡献者 |
| [QUICKSTART.md](./QUICKSTART.md) | 详细安装和使用指南 | 新用户 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 技术架构设计 | 开发者 |
| [ROADMAP.md](./ROADMAP.md) | 项目路线图（Phase 1-2 已完成） | 所有人 |
| [TESTING.md](./TESTING.md) | 测试指南和最佳实践 | 开发者 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 部署指南（Vercel） | 运维/开发者 |
| [DECISIONS.md](./DECISIONS.md) | 架构决策记录（ADRs） | 开发者 |
| [ISSUES.md](./ISSUES.md) | Issue 列表和状态 | 开发者 |

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
| 查看变更 | [CHANGELOG.md](../CHANGELOG.md) |

---

## 📁 项目结构

```
artstation-critic/
├── 📖 README.md              # 项目简介
├── 📖 CHANGELOG.md           # 变更日志
├── 📖 CONTRIBUTING.md        # 贡献指南
├── 📖 LICENSE                # MIT 许可证
├── 📖 CLAUDE.md              # 开发助手配置
├── 📖 PROJECT_SUMMARY.md     # 整理总结
│
├── 📂 docs/                  # 详细文档
│   ├── INDEX.md              # 本文档
│   ├── QUICKSTART.md         # 快速开始
│   ├── ARCHITECTURE.md       # 架构设计
│   ├── ROADMAP.md            # 路线图
│   ├── TESTING.md            # 测试指南
│   ├── DEPLOYMENT.md         # 部署指南
│   ├── DECISIONS.md          # 架构决策
│   └── ISSUES.md             # Issue 列表
│
├── 📂 app/                   # Next.js 页面
│   ├── page.tsx              # 首页
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式
│   ├── history/page.tsx      # 历史记录
│   └── settings/page.tsx     # 设置
│
├── 📂 components/            # React 组件
│   ├── CritiqueResults.tsx   # 点评结果
│   ├── Dropzone.tsx          # 拖拽上传
│   ├── OptimizationView.tsx  # AI 优化对比
│   ├── UploadQueue.tsx       # 批量上传队列
│   ├── HistoryAnalysis.tsx   # 历史分析
│   └── TrendChart.tsx        # 趋势折线图
│
├── 📂 lib/                   # 核心逻辑
│   ├── index.ts              # 统一导出
│   ├── critique.ts           # AI 点评
│   ├── critic-prompt.ts      # System Prompt
│   ├── history.ts            # IndexedDB 存储
│   ├── settings.ts           # 用户设置
│   ├── optimization.ts       # DALL-E 3 生成
│   ├── batch-upload.ts       # 批量上传
│   └── trend-analysis.ts     # 趋势分析
│
├── 📂 .github/               # GitHub 配置
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   └── workflows/            # CI/CD
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
- 所有文档使用中文（代码/术语保持英文）

---

## ✅ 当前状态

**所有功能已完成（Phase 1 + Phase 2）**

| 阶段 | 状态 |
|------|------|
| Phase 1 MVP | ✅ 完成 |
| Phase 2 P0 | ✅ 完成 |
| Phase 2 P1 | ✅ 完成 |
| Phase 2 P2 | ✅ 完成 |
| Phase 2 P3 | ✅ 完成 |
| Phase 2 P4 | ✅ 完成 |

**总计**: 86 测试通过，3 跳过
