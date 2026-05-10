# 测试指南

## 测试架构

```
┌─────────────────────────────────────────┐
│              测试层级                     │
├─────────────────────────────────────────┤
│  1. 单元测试 (Unit Tests)               │
│     - lib/critique.test.ts              │
│     - lib/critic-prompt.test.ts         │
│     - lib/history.test.ts (跳过)        │
│                                         │
│  2. 组件测试 (Component Tests)          │
│     - app/page.test.tsx                 │
│                                         │
│  3. E2E 测试 (待添加)                   │
│     - Playwright / Cypress              │
└─────────────────────────────────────────┘
```

## 运行测试

```bash
# 运行所有测试
npx vitest run

# 交互式模式（开发时推荐）
npx vitest

# 运行特定测试文件
npx vitest run lib/critique.test.ts

# 运行特定测试
npx vitest run -t "critiqueArtwork"
```

## 测试文件说明

### lib/critique.test.ts

测试 AI 点评逻辑：
- `critiqueArtwork` 函数
- API 调用参数验证
- JSON 响应解析

**运行环境**: Node.js

### lib/critic-prompt.test.ts

测试 System Prompt：
- Prompt 内容完整性
- 维度定义正确性

**运行环境**: Node.js

### lib/history.test.ts

测试 IndexedDB 存储：
- `saveCritique`
- `getHistory`
- `deleteCritique`
- `clearHistory`

**注意**: IndexedDB 在 Node.js 环境下不可用，测试已跳过 (`describe.skip`)

**验证方式**: 在浏览器中手动测试

### app/page.test.tsx

测试首页组件：
- 页面标题渲染
- 上传按钮渲染
- 点评结果渲染

**运行环境**: jsdom (模拟浏览器)

## 测试覆盖率

目标覆盖率: **80%+**

```bash
# 生成覆盖率报告
npx vitest run --coverage
```

## 编写测试

### 单元测试示例

```typescript
// lib/my-feature.test.ts
import { describe, it, expect, vi } from 'vitest';
import { myFunction } from './my-feature';

describe('myFunction', () => {
  it('应该正确处理有效输入', () => {
    const result = myFunction('valid input');
    expect(result).toBe('expected output');
  });

  it('应该抛出错误当输入无效', () => {
    expect(() => myFunction('')).toThrow('Invalid input');
  });

  it('应该调用依赖函数', () => {
    const mock = vi.fn().mockReturnValue('mocked');
    const result = myFunction('input', mock);
    expect(mock).toHaveBeenCalled();
    expect(result).toBe('mocked');
  });
});
```

### 组件测试示例

```typescript
// app/my-page.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyPage from './page';

describe('MyPage', () => {
  it('应该渲染页面标题', () => {
    render(<MyPage />);
    expect(screen.getByText(/my page/i)).toBeInTheDocument();
  });

  it('应该渲染按钮', () => {
    render(<MyPage />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

## 测试最佳实践

### ✅ 推荐

- **测试行为，不测试实现**: 测试用户能看到的结果
- **小测试**: 每个测试只验证一件事
- **清晰命名**: 测试名描述预期行为
- **模拟外部依赖**: API、数据库等用 mock

### ❌ 避免

- **测试实现细节**: 不要测试内部函数调用
- **大测试**: 一个测试验证太多事情
- **脆弱测试**: 依赖具体实现，重构就失败
- **跳过测试**: 除非有充分理由

## 已知限制

### IndexedDB 测试

IndexedDB 在 Node.js 环境下不可用，`lib/history.test.ts` 已跳过：

```typescript
describe.skip('IndexedDB History', () => {
  // 测试代码
});
```

**验证方式**:
1. 启动开发服务器
2. 打开浏览器开发者工具
3. 查看 IndexedDB → artstation-critic-history
4. 手动上传作品验证存储

### 浏览器 API 测试

`FileReader`、`localStorage` 等浏览器 API 在 jsdom 中支持有限：

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';

// 模拟 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx vitest run --coverage
```
