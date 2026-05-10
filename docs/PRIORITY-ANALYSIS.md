# Phase 2 优先级分析

## 评估维度

| 维度 | 说明 |
|------|------|
| **用户价值** | 功能对用户体验的提升程度 |
| **技术复杂度** | 实现难度和所需工作量 |
| **依赖关系** | 是否依赖其他功能 |
| **开发成本** | 预计开发时间 |

---

## 功能矩阵

| 功能 | 用户价值 | 技术复杂度 | 依赖关系 | 开发成本 |
|------|----------|------------|----------|----------|
| 拖拽上传 + 剪贴板 | ⭐⭐⭐⭐ | ⭐⭐ | 无 | 1-2 天 |
| AI 生成对比图 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 无 | 3-5 天 |
| 批量上传 | ⭐⭐⭐ | ⭐⭐ | 拖拽上传 | 2-3 天 |
| 同图多次对比 | ⭐⭐⭐ | ⭐⭐⭐ | 历史记录 | 2-3 天 |
| UI/UX 优化 | ⭐⭐ | ⭐⭐ | 无 | 2-3 天 |

---

## 优先级排序

### 🥇 P0: 拖拽上传 + 剪贴板粘贴

**用户价值**: ⭐⭐⭐⭐

**理由**:
- 显著降低上传门槛
- 符合用户习惯（艺术家常用拖拽）
- 实现简单，收益高

**技术方案**:
```typescript
// Dropzone 组件
const Dropzone = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    for (let item of items || []) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleFileSelect(file);
      }
    }
  };

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      className={isDragging ? 'drag-active' : ''}
    >
      拖拽图片或 Ctrl+V 粘贴到这里
    </div>
  );
};
```

**风险**:
- `navigator.clipboard.read()` 需要 HTTPS 环境
- 浏览器兼容性（现代浏览器已支持）

**预计时间**: 1-2 天

---

### 🥈 P1: AI 生成对比优化图

**用户价值**: ⭐⭐⭐⭐⭐

**理由**:
- 核心差异化功能
- 从"点评"升级为"指导 + 示范"
- 用户期望值最高

**技术方案**:
```typescript
// 使用多模态模型生成优化图
async function generateOptimizedImage(
  originalImage: string,
  critique: ArtworkCritique
): Promise<string> {
  const prompt = `
    请基于以下点评，生成优化后的作品：
    
    原作品点评：
    ${formatCritique(critique)}
    
    要求：
    1. 保持原作品的风格和构图
    2. 根据点评改进不足之处
    3. 输出为图片（base64 或 URL）
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // 或 claude-3-5-sonnet
    messages: [
      { role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: originalImage } }
      ]}
    ],
    // 使用 DALL-E 3 或模型内置生成能力
  });

  return response.data[0].message.content;
}
```

**风险**:
- 需要付费模型（GPT-4o / Claude 3.5 Sonnet）
- 生成质量不稳定
- API 成本较高

**替代方案**:
- 先用免费模型尝试（DeepSeek-VL 不支持图像生成）
- 作为付费功能（Phase 3）

**预计时间**: 3-5 天（含测试调优）

---

### 🥉 P2: 批量上传

**用户价值**: ⭐⭐⭐

**理由**:
- 提升效率（一次上传多张）
- 依赖拖拽上传（用户体验一致）
- 实现相对简单

**技术方案**:
```typescript
// 支持 multiple 和队列
const handleFiles = async (files: FileList) => {
  const queue = Array.from(files);
  const results = [];

  for (const file of queue) {
    const critique = await critiqueArtwork(file);
    results.push(critique);
    // 更新 UI 显示进度
  }

  return results;
};

// UI: 队列展示
<QueueList items={queue} onRemove={removeFromQueue} />
```

**依赖**: 拖拽上传（P0）完成后体验更好

**预计时间**: 2-3 天

---

### P3: 同图多次上传对比

**用户价值**: ⭐⭐⭐

**理由**:
- 追踪进步（用户长期价值）
- 依赖历史记录（已有基础）
- 需要额外 UI 设计

**技术方案**:
```typescript
// IndexedDB 按文件名分组
async function getHistoryByFilename(filename: string): Promise<Critique[]> {
  const all = await getHistory();
  return all.filter(c => c.filename === filename);
}

// UI: 时间线视图
<Timeline critiques={history} onCompare={showComparison} />
```

**UI 设计**:
- 评分趋势图（折线图）
- 对比视图（并排展示）
- 改进点高亮

**预计时间**: 2-3 天

---

### P4: UI/UX 优化

**用户价值**: ⭐⭐

**理由**:
- 提升使用体验
- 非功能性需求
- 可并行进行

**内容**:
- 响应式布局优化
- 加载动画（骨架屏）
- 错误提示优化
- 移动端适配
- 深色模式完善

**预计时间**: 2-3 天

---

## ✅ 用户决策确认（2026-05-10）

| 决策项 | 用户选择 |
|--------|----------|
| AI 生成模型 | GPT-4o（付费）✅ |
| 批量上传数量 | 5 张 ✅ |
| 同图对比展示 | 折线图图表 ✅ |
| UI 优化参考 | 主流趋势 ✅ |

---

## 推荐开发顺序

```
Week 1: P0 → P1
  Day 1-2: 拖拽上传 + 剪贴板
  Day 3-5: AI 生成对比图（GPT-4o）

Week 2: P2 → P3 → P4
  Day 1-2: 批量上传（5 张）
  Day 3-4: 同图多次对比（折线图）
  Day 5:   UI/UX 优化（主流趋势）
```

---

## 关键决策（已确认）

### 1. AI 生成对比图：GPT-4o

- **模型**: GPT-4o（多模态，支持图像生成）
- **成本**: 付费 API
- **实现**: 使用 OpenAI SDK 的图像生成能力
- **UI**: 原图 vs 优化图并排对比

### 2. 批量上传：5 张

- **上限**: 5 张图片
- **处理方式**: 串行处理（逐个上传 + 点评）
- **UI**: 队列展示 + 进度条
- **依赖**: 拖拽上传（P0）完成后体验一致

### 3. 同图对比：折线图

- **存储**: IndexedDB 按文件名分组
- **展示**: 评分趋势折线图（6 个维度）
- **交互**: 选择两张历史版本对比
- **图表库**: 使用轻量级图表（如 Chart.js 或纯 SVG）

### 4. UI 优化：主流趋势

参考 mattpocock/skills 的 `prototype` skill 原则：
- **结构性差异**: 变体之间布局/信息层级不同，不仅是颜色
- **快速切换**: URL search param + 悬浮切换栏
- **主流趋势**: 
  - 深色模式完善
  - 圆角 + 阴影卡片设计
  - 微交互（hover/active 状态）
  - 响应式布局优化
  - 加载状态（骨架屏/进度条）

---

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| GPT-4o API 成本 | 中 | 中 | 设置每日限额 + 用户提示 |
| AI 生成质量不稳定 | 中 | 高 | 提供"重新生成"按钮 |
| 浏览器兼容性 | 低 | 中 | 渐进增强，优雅降级 |
| 用户反馈不佳 | 低 | 高 | 快速迭代，收集反馈 |

---

## 下一步行动

1. ✅ **优先级确认**: 用户已确认所有决策
2. ⏳ **创建 Issue**: 将 Phase 2 拆分为独立 Issue
3. ⏳ **开始开发**: 按 TDD 流程实现 P0（拖拽上传）

---

## Issue 列表

| Issue | 功能 | 优先级 | 预计时间 |
|-------|------|--------|----------|
| #8 | 拖拽上传 + 剪贴板 | P0 | 1-2 天 |
| #9 | AI 生成对比图（GPT-4o） | P1 | 3-5 天 |
| #10 | 批量上传（5 张） | P2 | 2-3 天 |
| #11 | 同图多次对比（折线图） | P3 | 2-3 天 |
| #12 | UI/UX 优化（主流趋势） | P4 | 2-3 天 |
