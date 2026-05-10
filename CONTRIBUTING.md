# 贡献指南

欢迎贡献 Artstation Critic！以下是开发规范和流程。

---

## 🚀 快速开始

### 环境准备

```bash
# Node.js 版本要求
node >= 20

# 克隆项目
git clone https://github.com/Legeo969/MyPrj.git
cd MyPrj

# 安装依赖
npm install
```

### 启动开发

```bash
npm run dev
```

访问 `http://localhost:3000`。

---

## 📋 开发规范

### 1. TDD 优先

**先写测试，再实现功能**

```
RED → GREEN → REFACTOR
```

1. **RED**: 编写失败的测试
2. **GREEN**: 实现功能使测试通过
3. **REFACTOR**: 优化代码，保持测试通过

### 2. 垂直切片

每次只做一个小功能，完成一个再下一个。

**示例**:

```
Issue #12: UI/UX 优化
  ├── 垂直切片 1: 全局样式系统 ✅
  ├── 垂直切片 2: Dropzone 组件 ✅
  ├── 垂直切片 3: CritiqueResults 组件 ✅
  ├── 垂直切片 4: 导航栏 ✅
  └── 垂直切片 5: 测试验证 ✅
```

### 3. 测试覆盖

核心逻辑必须有测试：

| 模块 | 测试要求 |
|------|----------|
| `lib/*.ts` | 单元测试 |
| `components/*.tsx` | 组件测试 |
| `app/*.tsx` | 集成测试 |

运行测试：

```bash
npx vitest run
```

### 4. 代码风格

#### TypeScript

```typescript
// ✅ 好
interface Props {
  value: string;
  onChange: (value: string) => void;
}

// ❌ 避免
const Props = { value: "", onChange: () => {} };
```

#### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `CritiqueResults` |
| 函数/变量 | camelCase | `handleUpload` |
| 常量 | UPPER_SNAKE | `MAX_FILE_SIZE` |
| 类型/接口 | PascalCase | `ArtworkCritique` |

#### 文件组织

```
lib/
├── index.ts              # 统一导出
├── module.ts             # 模块实现
└── module.test.ts        # 模块测试
```

---

## 🔄 开发流程

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发

```bash
# 运行开发服务器
npm run dev

# 运行测试
npx vitest watch
```

### 3. 提交

```bash
# 格式化代码
npm run lint

# 运行测试
npx vitest run

# 提交
git add .
git commit -m "feat: describe your change"
```

### 4. 推送

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

1. 在 GitHub 创建 PR
2. 填写 PR 描述
3. 等待 CI 检查
4. 响应审查意见

---

## 📝 Commit 规范

### 格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Type

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(critique): add batch upload` |
| `fix` | Bug 修复 | `fix(history): delete record not working` |
| `docs` | 文档变更 | `docs(readme): update installation steps` |
| `style` | 代码风格 | `style(components): format Dropzone` |
| `refactor` | 代码重构 | `refactor(lib): extract utility functions` |
| `test` | 测试变更 | `test(critique): add edge case tests` |
| `chore` | 构建/工具 | `chore(deps): update dependencies` |

### 示例

```
feat(batch-upload): add serial processing with error isolation

- Implement processUploadQueue with concurrency = 1
- Add error isolation for individual file failures
- Add progress callback for real-time UI updates
- Add UploadQueue component for queue visualization

Tests: 19 tests passing
```

---

## 🧪 测试指南

### 运行测试

```bash
# 运行所有测试
npx vitest run

# 交互式模式
npx vitest

# 监听模式
npx vitest watch

# 运行特定文件
npx vitest components/Dropzone.test.tsx
```

### 测试类型

#### 单元测试（lib/）

```typescript
// lib/critique.test.ts
describe('critiqueArtwork', () => {
  it('should return valid critique structure', async () => {
    const result = await critiqueArtwork('test.png', base64, settings);
    
    expect(result).toHaveProperty('overallImpression');
    expect(result.scores).toHaveProperty('composition');
  });
});
```

#### 组件测试（components/）

```typescript
// components/Dropzone.test.tsx
describe('Dropzone', () => {
  it('should show drag state styles', () => {
    render(<Dropzone {...defaultProps} />);
    const dropzone = screen.getByRole('button');
    
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    
    expect(dropzone).toHaveClass('border-emerald-500');
  });
});
```

### 测试最佳实践

1. **测试行为，不测试实现**
   ```typescript
   // ✅ 好：测试用户可见的行为
   expect(screen.getByRole('button', { name: /获取点评/i })).toBeInTheDocument();
   
   // ❌ 避免：测试内部实现细节
   expect(component.state.isDragging).toBe(true);
   ```

2. **使用语义化查询**
   ```typescript
   getByRole('button')     // 优先
   getByLabelText('上传')   // 次优
   getByText('获取点评')     // 最后
   ```

3. **清理副作用**
   ```typescript
   afterEach(() => {
     cleanup();
   });
   ```

---

## 📚 文档规范

### 更新文档

新功能需更新以下文档：

| 文档 | 更新内容 |
|------|----------|
| `README.md` | 功能列表、技术栈 |
| `CHANGELOG.md` | 变更条目 |
| `docs/ROADMAP.md` | 路线图更新 |
| `docs/ISSUES.md` | Issue 状态 |

### 中文优先

- 用户界面：中文
- 文档：中文
- 代码/术语：英文

---

## 🤝 如何贡献

### 报告 Bug

创建 Issue，包含：

1. Bug 描述
2. 复现步骤
3. 预期行为
4. 实际行为
5. 环境信息

### 请求功能

创建 Issue，包含：

1. 功能描述
2. 使用场景
3. 预期行为

### 提交代码

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 推送分支
5. 创建 Pull Request

---

## 📄 License

MIT License - 参见 [LICENSE](../LICENSE)

---

## 💬 获取帮助

| 问题 | 方式 |
|------|------|
| 开发问题 | 创建 Issue |
| 架构疑问 | 讨论区 |
| 紧急问题 | 联系维护者 |
