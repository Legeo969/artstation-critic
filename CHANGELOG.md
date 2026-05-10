# 变更日志

所有重要的项目变更将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [0.1.1] - 2026-05-10

### 已验证

- ✅ 网页设置页面可配置 API Key（无需 .env.local）
- ✅ AI 点评功能完整测试通过
- ✅ IndexedDB 历史记录存储正常
- ✅ 中文界面渲染正确

### 改进

- 移除 `.env.local` 依赖，支持纯网页配置
- 简化部署流程

---

## [0.1.0] - 2026-05-10

### 新增

- **MVP 功能完成**
  - 单图上传功能（文件选择 + 预览）
  - 6 维度美术点评（构图、色彩光影、氛围情绪、技法、叙事、商业价值）
  - AI 生成点评报告（中文输出）
  - 历史记录页面（IndexedDB 本地存储）
  - API 设置页面（支持 DeepSeek / 火山方舟）
  - 中文界面（保留英文品牌名）

- **技术基础设施**
  - Next.js 16 项目骨架
  - Tailwind CSS 4 样式系统
  - Vitest + Testing Library 测试框架
  - TypeScript 严格模式

- **文档**
  - README.md（项目说明）
  - CONTRIBUTING.md（贡献指南）
  - CHANGELOG.md（变更日志）
  - .env.example（环境变量示例）

### 技术栈

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- TypeScript 5
- Vitest 4
- OpenAI SDK（兼容 DeepSeek / 火山方舟 API）

### 已验证

- ✅ 网页设置页面可配置 API Key
- ✅ AI 点评功能完整测试通过
- ✅ IndexedDB 历史记录存储正常
- ✅ 中文界面渲染正确

### 已知问题

- IndexedDB 测试在 Node.js 环境下无法运行（已跳过）

---

## 版本约定

| 前缀 | 说明 |
|------|------|
| `[0.x.x]` | 开发版本，功能不稳定 |
| `[1.x.x]` | 稳定版本 |
| `[x.0.0]` | 重大变更 |

---

## [0.1.2] - 2026-05-10

### Added
- **拖拽上传支持**: 新增 `Dropzone` 组件，支持拖拽图片上传
- **剪贴板粘贴**: 支持 Ctrl+V / Cmd+V 粘贴图片
- **文件大小限制**: 可配置最大文件大小（默认 10MB）
- **错误提示**: 非图片文件、文件过大时的友好提示
- **视觉反馈**: 拖拽进入/离开时的状态动画

### Changed
- 首页上传区域从 `<input type="file">` 改为 `Dropzone` 组件
- 更新测试用例以匹配新 UI

### Tests
- `components/Dropzone.test.tsx`: 9 个测试用例覆盖所有功能

---

## [0.1.3] - 2026-05-10

### Added
- **AI 生成优化图**: 使用 DALL-E 3 生成优化版本
- **对比视图组件**: `OptimizationView` 支持原图/优化图切换
- **生成进度提示**: 生成中的加载动画和状态提示
- **重新生成**: 支持多次生成优化图
- **下载功能**: 一键下载优化后的图片
- **错误处理**: 友好的错误提示和重试机制

### Features
- 基于作品点评自动生成优化提示词
- 支持自定义模型（dall-e-3）和尺寸
- 原图 vs 优化图并排对比展示

### Tests
- `lib/optimization.test.ts`: 13 个测试用例
- `components/OptimizationView.test.tsx`: 10 个测试用例

---

## [0.1.4] - 2026-05-10

### Added
- **批量上传**: 支持一次上传最多 5 张图片
- **上传队列**: `UploadQueue` 组件显示上传进度
- **串行处理**: 逐个上传，避免 API 限流
- **错误隔离**: 单个文件失败不影响其他文件
- **进度回调**: 实时显示上传进度
- **队列统计**: 完成/失败/处理中状态统计
- **清除失败项**: 一键清除所有失败项

### Features
- 拖拽/粘贴多张图片自动加入队列
- 队列项支持单独移除
- 成功项支持查看点评结果
- 文件大小显示

### Tests
- `lib/batch-upload.test.ts`: 9 个测试用例
- `components/UploadQueue.test.tsx`: 10 个测试用例

---

## [0.1.5] - 2026-05-10

### Added
- **同图多次对比**: 支持同一作品多次上传，追踪进步轨迹
- **趋势分析模块**: `lib/trend-analysis.ts` 提供分组、趋势计算功能
- **趋势图表组件**: `TrendChart` 使用 Recharts 绘制折线图
- **历史分析视图**: `HistoryAnalysis` 展示进步概览和最佳/最低记录
- **6 个维度趋势**: 构图、色彩与光影、氛围与情绪、技法、叙事、商业潜力
- **综合评分趋势**: 平均分变化曲线
- **进度卡片**: 各维度变化方向和百分比
- **维度切换**: 点击按钮切换显示/隐藏维度
- **及格线参考**: 5 分虚线参考线

### Features
- 按文件名分组历史点评记录
- 时间轴显示（最新在前）
- 最佳/最低记录高亮显示
- 进步/退步图标（📈/📉/➡️）
- 响应式布局

### Tests
- `lib/trend-analysis.test.ts`: 9 个测试用例
- `components/TrendChart.test.tsx`: 7 个测试用例
- `components/HistoryAnalysis.test.tsx`: 8 个测试用例

---

## [0.1.6] - 2026-05-10

### Added (P4 UI/UX 优化)
- **全局样式系统**: 阴影、渐变、毛玻璃效果、过渡动画
- **按钮样式**: `btn-primary`, `btn-secondary`, `btn-accent`, `btn-ghost` 统一样式
- **卡片样式**: `.card`, `.card-hover` 精致卡片设计
- **输入框样式**: `.input-field` 现代化输入框
- **加载动画**: `animate-fade-in-up`, `animate-shimmer`, `animate-float` 等
- **骨架屏**: `.skeleton` 加载占位效果
- **响应式导航栏**: 毛玻璃效果 + 移动端汉堡菜单
- **首页优化**: 标题区、空状态卡片、页脚
- **历史记录页面**: 缩略图、评分徽章、时间相对显示、删除悬停显示
- **设置页面**: API Key 显示/隐藏切换、模型列表提示
- **可访问性**: ARIA 标签、键盘导航、焦点可见性

### Changed
- `Dropzone.tsx`: 现代化拖拽上传 UI，浮动动画、焦点态、点击上传
- `CritiqueResults.tsx`: 精致卡片设计、进度条、评分颜色编码
- `app/page.tsx`: 响应式导航栏、加载进度条、空状态引导
- `app/history/page.tsx`: 卡片列表、缩略图、评分徽章、悬停操作
- `app/settings/page.tsx`: 现代化表单、API Key 显示切换
- `app/globals.css`: 完整样式系统
- `app/layout.tsx`: SEO 优化

### Tests
- 修复 `Dropzone.test.tsx` 测试选择器

### Phase 2 (P0 → P4)

- [ ] #8: 拖拽上传 + 剪贴板粘贴（P0）
- [ ] #9: AI 生成对比优化图 - GPT-4o（P1）
- [ ] #10: 批量上传（5 张）（P2）
- [ ] #11: 同图多次对比 - 折线图（P3）
- [ ] #12: UI/UX 优化 - 主流趋势（P4）
