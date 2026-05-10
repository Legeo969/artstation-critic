# 快速开始

Artstation Critic 项目快速上手指南。

---

## 🚀 5 分钟上手

### 1. 克隆项目

```bash
git clone https://github.com/Legeo969/MyPrj.git
cd MyPrj
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 `http://localhost:3000`。

### 4. 配置 API

访问 `http://localhost:3000/settings`，配置：

| 字段 | 说明 | 示例 |
|------|------|------|
| API 地址 | DeepSeek 或兼容 OpenAI 的 API | `https://ark.cn-beijing.volces.com/api/v3` |
| API Key | 你的 API Key | `sk-xxxxx` |
| 模型 | AI 模型名称 | `doubao-seed-2-0-pro-260215` |

### 5. 开始使用

访问首页 `http://localhost:3000`，上传作品获取点评！

---

## 📋 完整流程

### 步骤 1：准备 API Key

#### 选项 A：DeepSeek（推荐，免费额度）

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册/登录
3. 创建 API Key
4. 复制 Key 到设置页面

#### 选项 B：火山方舟

1. 访问 [火山方舟](https://ark.cn-beijing.volces.com/)
2. 创建应用
3. 获取 API Key
4. API 地址：`https://ark.cn-beijing.volces.com/api/v3`

#### 选项 C：OpenAI（用于 DALL-E 3）

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建 API Key
3. 用于生成优化图功能

---

### 步骤 2：本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器
open http://localhost:3000
```

---

### 步骤 3：配置环境

#### 方式 A：网页设置（推荐）

访问 `/settings` 页面，填写：

```
API 地址: https://ark.cn-beijing.volces.com/api/v3
API Key: sk-xxxxxxxxxxxxxxxxxxxx
模型: doubao-seed-2-0-pro-260215
```

点击"保存设置"。

#### 方式 B：环境变量

创建 `.env.local`：

```bash
DEEPSEEK_API_KEY=sk-xxxxx
DEEPSEEK_API_BASE=https://ark.cn-beijing.volces.com/api/v3
OPENAI_API_KEY=sk-xxxxx  # 用于 DALL-E 3
```

---

### 步骤 4：使用功能

#### 上传作品

1. 点击上传区域或拖拽图片
2. 或使用 Ctrl+V 粘贴
3. 点击"获取专业点评"

#### 查看点评

- **整体印象**: AI 对作品的整体评价
- **维度评分**: 6 个维度的详细评分和反馈
- **优点**: 作品的亮点
- **改进建议**: 可以提升的方面
- **关键建议**: 最重要的改进方向

#### AI 优化图

1. 点击"AI 生成优化图"
2. 等待生成（约 10-30 秒）
3. 查看原图 vs 优化图对比

#### 批量上传

1. 选择多张图片（最多 5 张）
2. 自动串行处理
3. 查看队列进度

#### 历史记录

访问 `/history` 查看：
- 所有点评记录
- 缩略图预览
- 评分徽章
- 删除功能

#### 进步追踪

同一作品多次上传后：
- 访问 `/history`
- 查看趋势图表
- 追踪各维度进步

---

## 🧪 运行测试

```bash
# 运行所有测试
npx vitest run

# 交互式模式
npx vitest

# 监听模式
npx vitest watch
```

**测试状态**: 86 测试通过，3 跳过

---

## 📦 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

---

## 🚀 部署到 Vercel

### 方法 1：一键部署

1. 推送到 GitHub：
   ```bash
   git push origin master
   ```

2. 访问 [Vercel](https://vercel.com/)
3. 导入项目
4. 配置环境变量（可选）
5. 点击"Deploy"

### 方法 2：Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 📁 项目结构

```
artstation-critic/
├── app/                    # Next.js 页面
│   ├── page.tsx            # 首页
│   ├── history/page.tsx    # 历史记录
│   └── settings/page.tsx   # 设置
│
├── components/             # React 组件
│   ├── CritiqueResults.tsx # 点评结果
│   ├── Dropzone.tsx        # 拖拽上传
│   ├── OptimizationView.tsx# AI 优化对比
│   ├── UploadQueue.tsx     # 批量上传队列
│   ├── HistoryAnalysis.tsx # 历史分析
│   └── TrendChart.tsx      # 趋势折线图
│
├── lib/                    # 核心逻辑
│   ├── critique.ts         # AI 点评
│   ├── critic-prompt.ts    # System Prompt
│   ├── history.ts          # IndexedDB 存储
│   ├── settings.ts         # 设置管理
│   ├── optimization.ts     # DALL-E 3 生成
│   ├── batch-upload.ts     # 批量上传
│   └── trend-analysis.ts   # 趋势分析
│
└── docs/                   # 详细文档
```

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npx vitest run` | 运行测试 |
| `npx vitest` | 交互式测试 |

---

## ❓ 常见问题

### Q: 为什么需要配置 API Key？

A: AI 点评需要调用外部 API，API Key 用于身份验证。

### Q: API Key 安全吗？

A: API Key 仅存储在本地浏览器（IndexedDB），不会上传到任何服务器。

### Q: 支持哪些图片格式？

A: JPG、PNG、WebP，最大 10MB。

### Q: 历史记录会丢失吗？

A: 历史记录存储在本地 IndexedDB，清除浏览器数据会丢失。

### Q: 如何切换 AI 模型？

A: 在 `/settings` 页面修改"模型"字段。

---

## 📚 更多文档

- [架构设计](./ARCHITECTURE.md)
- [测试指南](./TESTING.md)
- [部署指南](./DEPLOYMENT.md)
- [路线图](./ROADMAP.md)
