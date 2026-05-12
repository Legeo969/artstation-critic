# 部署指南

## 部署选项

### 1. Netlify（推荐）

Netlify 通过 OpenNext 适配器自动支持 Next.js 16，零配置部署。

#### 前提

- Node.js >= 20（已在 `netlify.toml` 中指定 `NODE_VERSION = "20"`）
- Next.js 16 自动被 OpenNext 适配器完整支持（RSC、Server Actions、SSR、SSG）

#### 步骤

1. **推送到 GitHub**
   ```bash
   git push origin main
   ```

2. **在 Netlify 导入项目**
   - 访问 https://app.netlify.com
   - "Add new site" → "Import an existing project"
   - 选择你的 Git 仓库

3. **配置环境变量**
   - Site settings → Environment variables
   - 添加 `DEEPSEEK_API_KEY`
   - （可选）添加 `DEEPSEEK_API_BASE`

4. **部署**
   - Netlify 自动检测 Next.js，使用 OpenNext 适配器构建
   - 构建命令：`npm run build`
   - 无需指定 Publish directory（适配器自动处理）

#### `netlify.toml` 配置

项目根目录已有 `netlify.toml`：

```toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"
```

> 无需添加 `[[plugins]]` 或 `@netlify/plugin-nextjs`，现代 Netlify 使用内置 OpenNext 适配器。

#### 常见问题

**Q: 部署后页面报 "Server Components render" 错误？**

A: 常见原因：
- **环境变量未配置**：在 Netlify Dashboard 添加 `DEEPSEEK_API_KEY`
- **Node.js 版本过旧**：确认 `netlify.toml` 中有 `NODE_VERSION = "20"`
- 如果以上都正确，检查 Netlify Build Log 是否有其他错误输出

**Q: Server Action 调用失败？**

A: 在 Settings 页面网页配置 API Key 即可，Server Action 会在 Netlify Functions 中运行。

#### 优势

- 零配置 OpenNext 适配器
- 自动 HTTPS + CDN
- 免费额度（300 分钟构建时间/月，100GB 带宽）
- 预览部署（每个 PR/分支独立 URL）
- Skew protection（防止部署切换时的客户端错误）

---

### 2. Vercel

Vercel 是 Next.js 官方部署平台，流程类似。

#### 步骤

1. 推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

---

### 3. 自建服务器

#### Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t artstation-critic .
docker run -p 3000:3000 -e DEEPSEEK_API_KEY=your-key artstation-critic
```

---

## 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `DEEPSEEK_API_KEY` | AI API 密钥 | 是（未设置时可在 Settings 页面网页配置） |
| `DEEPSEEK_API_BASE` | API 地址，默认 https://api.deepseek.com/v1 | 否 |

> 如果不在部署平台设置环境变量，用户需在首次访问时在 `/settings` 页面配置 API Key。

---

## 构建优化

```bash
npm run build
```

---

## 常见问题

### Q: 构建失败？

A: 确认 Node.js >= 20，运行 `npm run build` 本地验证。

### Q: 图片上传失败？

A: Server Action 默认 bodySizeLimit 为 10MB，通常够用。

### Q: 如何回滚？

A: Netlify Dashboard → Deploys → 选择历史版本 → "Publish deploy"。
