# 项目 Issue 列表

## Phase 1: MVP ✅ (已完成)

| # | Issue | 状态 |
|---|-------|------|
| 1 | Next.js 项目骨架 | ✅ |
| 2 | 单图上传功能 | ✅ |
| 3 | 美术导师 System Prompt | ✅ |
| 4 | AI API 集成 | ✅ |
| 5 | 点评结果页面 | ✅ |
| 6 | IndexedDB 历史记录 | ✅ |
| 7 | 历史记录页面 | ✅ |

---

## Phase 2: 迭代增强

### Issue #8: 拖拽上传 + 剪贴板粘贴

**优先级**: P0

**目标**: 支持拖拽图片上传和 Ctrl+V 剪贴板粘贴

**验收标准**:
- [ ] 拖拽区域视觉反馈（hover/drag-over 状态）
- [ ] 支持拖拽单个图片文件
- [ ] 支持 Ctrl+V 剪贴板粘贴图片
- [ ] 粘贴后自动识别并上传
- [ ] 错误提示（非图片文件、空剪贴板等）

**技术方案**:
```typescript
// Dropzone 组件
interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, onError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndProcess(file);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    for (let item of items || []) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) validateAndProcess(file);
      }
    }
  };

  const validateAndProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('请选择图片文件');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      className={`dropzone ${isDragging ? 'drag-active' : ''}`}
    >
      {isDragging ? '松开上传' : '拖拽图片或 Ctrl+V 粘贴'}
    </div>
  );
};
```

**测试**:
```typescript
describe('Dropzone', () => {
  it('应该显示拖拽状态', () => {
    // ...
  });

  it('应该处理拖拽文件', () => {
    // ...
  });

  it('应该处理剪贴板粘贴', () => {
    // ...
  });

  it('应该拒绝非图片文件', () => {
    // ...
  });
});
```

---

### Issue #9: AI 生成对比优化图

**优先级**: P1

**目标**: AI 不仅点评，还能生成优化版本

**验收标准**:
- [ ] 使用 GPT-4o 生成优化图
- [ ] 原图 vs 优化图并排对比展示
- [ ] 支持"重新生成"功能
- [ ] 生成失败时的错误处理
- [ ] 生成进度提示

**技术方案**:
```typescript
// lib/generate-optimization.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OptimizationResult {
  originalImage: string;
  optimizedImage: string;
  critique: ArtworkCritique;
  prompt: string;
}

export async function generateOptimizedImage(
  originalImage: string, // base64 data URL
  critique: ArtworkCritique
): Promise<OptimizationResult> {
  const prompt = `
    你是一位专业的美术导师。请基于以下点评，生成优化后的作品。

    原作品点评：
    ${formatCritique(critique)}

    要求：
    1. 保持原作品的风格和构图
    2. 根据点评改进不足之处
    3. 输出为图片

    请生成优化后的作品图片。
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: originalImage } }
        ]
      }
    ],
  });

  // GPT-4o 可以生成图像（通过 DALL-E 3 集成）
  // 或者使用专门的图像生成 API
  return {
    originalImage,
    optimizedImage: response.data[0].message.content, // 需要解析
    critique,
    prompt,
  };
}
```

**注意**: GPT-4o 的图像生成能力需要通过 DALL-E 3 API 或模型内置功能实现。

**测试**:
```typescript
describe('generateOptimizedImage', () => {
  it('应该生成优化图', async () => {
    // mock GPT-4o API
    // ...
  });

  it('应该在 API 失败时抛出错误', async () => {
    // ...
  });
});
```

**成本估算**:
- GPT-4o: ~$0.05/次（含图像生成）
- 建议: 用户端提示"此功能使用付费模型"

---

### Issue #10: 批量上传（5 张）

**优先级**: P2

**目标**: 支持一次上传最多 5 张图片

**验收标准**:
- [ ] 支持 `<input multiple>` 选择多张图片
- [ ] 支持拖拽多张图片
- [ ] 上传队列 UI（显示进度）
- [ ] 单个失败不影响其他图片
- [ ] 完成后可批量查看结果

**技术方案**:
```typescript
// lib/upload-queue.ts
interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  critique?: ArtworkCritique;
  error?: string;
}

export async function processUploadQueue(
  files: File[],
  onProgress: (completed: number, total: number) => void
): Promise<ArtworkCritique[]> {
  const queue: UploadQueueItem[] = files.map(file => ({
    id: crypto.randomUUID(),
    file,
    status: 'pending',
  }));

  const results: ArtworkCritique[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    item.status = 'uploading';

    try {
      const critique = await critiqueArtwork(item.file);
      item.status = 'success';
      item.critique = critique;
      results.push(critique);
    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : '上传失败';
    }

    onProgress(i + 1, queue.length);
  }

  return results;
}
```

**UI 组件**:
```typescript
// components/UploadQueue.tsx
interface UploadQueueProps {
  items: UploadQueueItem[];
  onRemove: (id: string) => void;
  onViewResult: (critique: ArtworkCritique) => void;
}

const UploadQueue: React.FC<UploadQueueProps> = ({ items, onRemove, onViewResult }) => {
  return (
    <div className="upload-queue">
      {items.map(item => (
        <QueueItem
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
          onViewResult={() => item.critique && onViewResult(item.critique)}
        />
      ))}
    </div>
  );
};
```

**测试**:
```typescript
describe('processUploadQueue', () => {
  it('应该处理多张图片', async () => {
    // ...
  });

  it('应该单个失败不影响其他', async () => {
    // ...
  });

  it('应该报告进度', async () => {
    // ...
  });
});
```

---

### Issue #11: 同图多次上传对比（折线图）

**优先级**: P3

**目标**: 追踪同一作品的改进进度，用折线图展示

**验收标准**:
- [ ] IndexedDB 按文件名分组存储
- [ ] 历史记录页面显示分组
- [ ] 选择同一作品的多个版本
- [ ] 折线图展示 6 维度评分趋势
- [ ] 支持选择两个版本进行对比

**技术方案**:
```typescript
// lib/history-grouped.ts
export interface CritiqueGroup {
  filename: string;
  critiques: ArtworkCritique[];
  avgScores: number[]; // 6 个维度的平均分
}

export async function getHistoryGrouped(): Promise<CritiqueGroup[]> {
  const all = await getHistory();
  const groups = new Map<string, ArtworkCritique[]>();

  for (const critique of all) {
    const key = critique.filename;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(critique);
  }

  return Array.from(groups.entries()).map(([filename, critiques]) => ({
    filename,
    critiques,
    avgScores: calculateAvgScores(critiques),
  }));
}

function calculateAvgScores(critiques: ArtworkCritique[]): number[] {
  const dims = ['composition', 'colorLighting', 'mood', 'technique', 'narrative', 'commercial'];
  return dims.map(dim => {
    const scores = critiques.map(c => c.scores[dim]);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });
}
```

**图表组件**:
```typescript
// components/CritiqueChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

interface CritiqueChartProps {
  groups: CritiqueGroup[];
  selectedGroup: string | null;
  onSelectedChange: (filename: string | null) => void;
}

const CritiqueChart: React.FC<CritiqueChartProps> = ({
  groups,
  selectedGroup,
  onSelectedChange,
}) => {
  const selected = groups.find(g => g.filename === selectedGroup);

  const chartData = {
    labels: ['第 1 次', '第 2 次', '第 3 次', ...], // 根据 critiques.length
    datasets: [
      {
        label: '构图',
        data: selected?.scores.composition || [],
        borderColor: 'rgb(255, 99, 132)',
      },
      // ... 其他 5 个维度
    ],
  };

  return (
    <div className="critique-chart">
      <select value={selectedGroup || ''} onChange={e => onSelectedChange(e.target.value || null)}>
        <option value="">选择作品</option>
        {groups.map(g => (
          <option key={g.filename} value={g.filename}>
            {g.filename} ({g.critiques.length} 次)
          </option>
        ))}
      </select>
      {selected && <Line data={chartData} options={chartOptions} />}
    </div>
  );
};
```

**测试**:
```typescript
describe('getHistoryGrouped', () => {
  it('应该按文件名分组', async () => {
    // ...
  });

  it('应该计算平均分', async () => {
    // ...
  });
});
```

---

### Issue #12: UI/UX 优化（主流趋势）

**优先级**: P4

**目标**: 提升整体用户体验，符合主流设计趋势

**验收标准**:
- [ ] 深色模式完善（系统偏好 + 手动切换）
- [ ] 响应式布局优化（移动端适配）
- [ ] 加载状态优化（骨架屏、进度条）
- [ ] 微交互效果（hover、active、focus 状态）
- [ ] 动画过渡（页面切换、组件出现）
- [ ] 可访问性改进（ARIA 标签、键盘导航）

**技术方案**:

### 1. 深色模式

```typescript
// app/globals.css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}
```

### 2. 响应式布局

```typescript
// 使用 Tailwind 响应式类
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 内容 */}
</div>
```

### 3. 加载状态

```typescript
// components/Skeleton.tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

// 使用
{loading ? <Skeleton className="h-64" /> : <CritiqueResults data={data} />}
```

### 4. 动画过渡

```typescript
// 使用 Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### 5. 可访问性

```typescript
// 添加 ARIA 标签
<button
  aria-label="上传图片"
  aria-describedby="upload-help"
  onClick={handleUpload}
>
  📷
</button>
<span id="upload-help" className="sr-only">
  支持 JPG、PNG 格式，最大 10MB
</span>
```

**测试**:
- [ ] 响应式断点测试
- [ ] 键盘导航测试
- [ ] 屏幕阅读器测试

---

## 开发顺序

```
P0 (#8) → P1 (#9) → P2 (#10) → P3 (#11) → P4 (#12)
```

每个 Issue 遵循 TDD 流程：
1. 创建测试文件
2. 编写失败测试（RED）
3. 实现功能（GREEN）
4. 重构优化（REFACTOR）

---

## 时间估算

| Issue | 预计时间 | 依赖 |
|-------|----------|------|
| #8 | 1-2 天 | 无 |
| #9 | 3-5 天 | 无 |
| #10 | 2-3 天 | #8 |
| #11 | 2-3 天 | #6 |
| #12 | 2-3 天 | 无 |

**总计**: 10-16 天
