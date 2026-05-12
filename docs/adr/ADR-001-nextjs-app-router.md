# ADR-001: 使用 Next.js 16 App Router

**日期**: 2026-05-10
**状态**: ✅ 已接受

## 背景

需要选择一个前端框架来构建 Artstation Critic。

## 决策

使用 Next.js 16 with App Router。

## 理由

- Server Components 减少客户端包体积
- Server Action 简化 API 调用（无需单独 API 路由）
- 内置路由、布局、加载状态
- 支持多种部署平台（Netlify OpenNext 适配器／Vercel）

## 后果

- 学习曲线（App Router 与 Pages Router 不同）
- 某些浏览器 API 需要在 `'use client'` 中
