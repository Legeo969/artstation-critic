# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.6] - 2026-05-10

### Added
- **P4 UI/UX 优化**: 现代化设计语言、视觉层次、交互反馈
- **全局样式系统**: 阴影系统（soft/elevated/float）、渐变背景、毛玻璃效果
- **按钮样式**: `btn-primary`, `btn-secondary`, `btn-accent`, `btn-ghost` 统一样式
- **卡片样式**: `.card`, `.card-hover` 精致卡片设计
- **输入框样式**: `.input-field` 现代化输入框
- **动画系统**: `animate-fade-in-up`, `animate-shimmer`, `animate-float`, `animate-pulse-glow`
- **骨架屏**: `.skeleton` 加载占位效果
- **响应式导航栏**: 毛玻璃效果 + 移动端汉堡菜单
- **首页优化**: 标题区、空状态卡片、页脚
- **历史记录页面**: 缩略图、评分徽章、时间相对显示、删除悬停显示
- **设置页面**: API Key 显示/隐藏切换、模型列表提示
- **可访问性**: ARIA 标签、键盘导航、焦点可见性
- **SEO 优化**: 元数据、OpenGraph、Twitter Card

### Changed
- `Dropzone.tsx`: 现代化拖拽上传 UI，浮动动画、焦点态、点击上传
- `CritiqueResults.tsx`: 精致卡片设计、进度条、评分颜色编码
- `app/page.tsx`: 响应式导航栏、加载进度条、空状态引导
- `app/history/page.tsx`: 卡片列表、缩略图、评分徽章、悬停操作
- `app/settings/page.tsx`: 现代化表单、API Key 显示切换
- `app/globals.css`: 完整样式系统
- `app/layout.tsx`: SEO 优化

### Fixed
- `Dropzone.test.tsx`: 修复测试选择器

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

### Fixed
- Recharts `ResponsiveContainer` 测试宽高问题
- Testing Library emoji 匹配问题
- 多个同名元素使用 `getAllByText`

---

## [0.1.4] - 2026-05-10

### Added
- **批量上传**: 支持最多 5 张图片同时上传
- **串行处理**: 避免 API 限流
- **错误隔离**: 单个文件失败不影响其他文件
- **进度回调**: 实时 UI 更新
- **上传队列组件**: `UploadQueue` 显示队列状态
- **队列统计**: 完成/失败/待处理计数

### Tests
- `lib/batch-upload.test.ts`: 9 个测试用例
- `components/UploadQueue.test.tsx`: 10 个测试用例

### Fixed
- `processUploadQueue` 中的 `validateFile` 调用（使用 `item.file`）

---

## [0.1.3] - 2026-05-10

### Added
- **AI 优化图**: DALL-E 3 生成优化对比图
- **优化提示词**: 基于点评结果生成优化描述
- **对比视图组件**: `OptimizationView` 展示原图 vs 优化图
- **生成状态管理**: 加载、错误、重试

### Tests
- `lib/optimization.test.ts`: 13 个测试用例
- `components/OptimizationView.test.tsx`: 10 个测试用例

### Changed
- `CritiqueResults.tsx`: 集成优化功能
- `app/page.tsx`: 集成优化流程

---

## [0.1.2] - 2026-05-10

### Added
- **拖拽上传**: 支持拖拽文件到上传区域
- **剪贴板粘贴**: Ctrl+V 粘贴图片
- **键盘导航**: Enter/Space 触发上传
- **焦点态**: 拖拽进入时的视觉反馈
- **可访问性**: ARIA 标签、角色属性

### Tests
- `components/Dropzone.test.tsx`: 9 个测试用例

### Changed
- `app/page.tsx`: 集成 Dropzone 组件

---

## [0.1.1] - 2026-05-10

### Added
- **Phase 1 MVP**: 核心功能完成
- **单图上传**: 文件选择 + 预览
- **AI 点评**: 6 维度美术点评（构图、色彩光影、氛围情绪、技法、叙事、商业潜力）
- **历史记录**: IndexedDB 本地存储
- **设置页面**: API Key 网页配置（无需 .env.local）
- **中文界面**: 所有用户界面中文
- **维度双语**: 中文 + 英文（如"构图 (Composition)"）

### Features
- Art Mentor System Prompt（6 维度分析）
- DeepSeek-VL API 集成
- IndexedDB 历史记录存储
- 网页设置页面
- SEO 优化

### Tests
- `lib/critique.test.ts`: 3 个测试用例
- `lib/critic-prompt.test.ts`: 3 个测试用例
- `lib/history.test.ts`: 1 个测试用例（跳过）

---

## [0.1.0] - 2026-05-10

### Added
- 项目初始化
- Next.js 16 脚手架
- Tailwind CSS 4 配置
- Vitest + Testing Library 测试框架
- ESLint + Prettier 代码质量
- Husky pre-commit 钩子
- GitHub Actions CI/CD
- 完整文档体系

---

[0.1.6]: https://github.com/Legeo969/MyPrj/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/Legeo969/MyPrj/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/Legeo969/MyPrj/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/Legeo969/MyPrj/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Legeo969/MyPrj/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Legeo969/MyPrj/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Legeo969/MyPrj/releases/tag/v0.1.0
