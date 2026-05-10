# 快速开始指南

## 前置条件

- Node.js 20+ 
- npm 或 yarn

## 安装

```bash
# 克隆或进入项目目录
cd artstation-critic

# 安装依赖
npm install
```

## 配置 API

### 方式 1: 环境变量（推荐）

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API Key
echo "DEEPSEEK_API_KEY=sk-your-key-here" > .env.local
```

### 方式 2: 网页设置

1. 启动开发服务器
2. 访问 `http://localhost:3000/settings`
3. 填入 API 地址和 API Key
4. 保存

## 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`。

## 使用流程

1. **上传图片**: 点击 "上传图片" 按钮选择文件
2. **获取点评**: 点击 "获取点评" 按钮
3. **查看结果**: 等待 AI 分析，查看 6 维度点评
4. **查看历史**: 点击顶部 "历史记录" 查看之前的点评

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 运行测试
npx vitest run

# 代码检查
npm run lint
```

## 项目结构

```
artstation-critic/
├── app/              # 页面
│   ├── page.tsx      # 首页
│   ├── history/      # 历史记录
│   └── settings/     # 设置
├── components/       # React 组件
├── lib/              # 核心逻辑
├── docs/             # 文档
└── public/           # 静态资源
```

## 遇到问题？

| 问题 | 解决方案 |
|------|----------|
| API Key 错误 | 检查 `.env.local` 或 Settings 页面 |
| 图片上传失败 | 检查文件大小（建议 < 10MB） |
| 测试失败 | `npx vitest run` 查看详细错误 |
| 端口被占用 | 关闭其他 Next.js 进程或修改端口 |

## 下一步

- [阅读架构文档](./ARCHITECTURE.md)
- [查看路线图](./ROADMAP.md)
- [了解测试指南](./TESTING.md)
- [查看架构决策](./DECISIONS.md)
