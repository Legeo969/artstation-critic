# ADR-002: 使用 Server Action 调用 AI API

**日期**: 2026-05-10
**状态**: ✅ 已接受

## 背景

AI API 调用需要在服务端还是客户端执行？

## 决策

使用 Next.js Server Action。

## 理由

- API Key 不暴露在客户端
- 减少客户端包体积（无需在浏览器加载 OpenAI SDK）
- 代码更简洁（无需单独的 API 路由）

## 后果

- 需要 `'use client'` 标记客户端组件
- Server Action 不能直接访问浏览器 API
