# ADR-004: DeepSeek 作为默认 AI 提供商

**日期**: 2026-05-10
**状态**: ✅ 已接受

## 背景

选择哪个 AI API 提供商？

## 决策

DeepSeek 作为默认，火山方舟作为备选。

## 理由

- DeepSeek: 免费额度充足，兼容 OpenAI 格式，改动最小
- 火山方舟: 备选方案，适合国内用户
- 通过 Settings 页面支持动态切换

## 后果

- 需要处理不同 API 的响应格式差异
- 用户需要自行获取 API Key

## 替代方案考虑

- OpenAI GPT-4o: 成本高
- Claude 3.5 Sonnet: 无免费额度
- DeepSeek: ✅ 免费 + 兼容
