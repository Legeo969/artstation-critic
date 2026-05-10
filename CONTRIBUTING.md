# 贡献指南

## 开发流程

1. **创建分支**: `git checkout -b feature/your-feature-name`
2. **小步提交**: 每个功能一个提交，遵循垂直切片原则
3. **测试先行**: 先写测试，再实现功能（TDD）
4. **提交信息**: 使用约定式提交格式

## 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `test` | 添加或修改测试 |
| `chore` | 构建/工具变更 |

### 示例

```
feat(history): 添加历史记录删除功能

- 在历史记录页面添加删除按钮
- 添加 confirm 对话框防止误删
- 更新测试用例

Closes #6
```

## 代码规范

- **TypeScript**: 严格模式，避免 `any`
- **组件**: 单一职责，不超过 200 行
- **函数**: 短小精悍，不超过 50 行
- **命名**: 语义化，组件用 PascalCase，函数用 camelCase

## 测试要求

- 核心逻辑必须有单元测试
- 测试覆盖率目标: 80%+
- 运行测试: `npx vitest run`

## 分支策略

- `main`: 生产分支，只接受合并
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
