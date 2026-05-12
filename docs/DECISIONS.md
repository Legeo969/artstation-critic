# 架构决策记录 (ADRs)

项目中的重要技术决策记录。每个 ADR 是独立文件，按编号组织。

## 索引

| ADR | 标题 | 状态 |
|-----|------|------|
| [ADR-001](./adr/ADR-001-nextjs-app-router.md) | 使用 Next.js 16 App Router | ✅ |
| [ADR-002](./adr/ADR-002-server-action.md) | 使用 Server Action 调用 AI API | ✅ |
| [ADR-003](./adr/ADR-003-indexeddb-storage.md) | IndexedDB 本地存储历史记录 | ✅ |
| [ADR-004](./adr/ADR-004-ai-provider.md) | DeepSeek 作为默认 AI 提供商 | ✅ |
| [ADR-005](./adr/ADR-005-chinese-ui.md) | 中文界面 + 英文品牌 | ✅ |
| [ADR-006](./adr/ADR-006-tdd-flow.md) | TDD 开发流程 | ✅ |
| [ADR-007](./adr/ADR-007-no-user-system.md) | 不实现用户系统（Phase 1） | ✅ |
| [ADR-008](./adr/ADR-008-single-upload-first.md) | 单图上传优先于批量上传 | ✅（部分过时） |

## 决策原则

1. **用户价值优先**: 决策应该提升用户体验
2. **技术可行性**: 选择成熟稳定的方案
3. **可逆性**: 优先选择容易回滚的决策
4. **文档化**: 重要决策必须记录原因
