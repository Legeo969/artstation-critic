# 部署指南

## 部署选项

### 1. Vercel（推荐）

Vercel 是 Next.js 的官方部署平台，一键部署，免费额度充足。

#### 步骤

1. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/artstation-critic.git
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 选择 "Import Git Repository"
   - 选择你的仓库

3. **配置环境变量**
   - 在 Vercel 项目设置中添加 `DEEPSEEK_API_KEY`
   - 或使用 `.env.local`（不推荐提交到 Git）

4. **部署**
   - 点击 "Deploy"
   - Vercel 自动构建并部署

#### 优势

- 一键部署
- 自动 HTTPS
- 全球 CDN
- 免费额度（100GB 带宽/月）
- 预览部署（每个 PR 一个预览 URL）

---

### 2. Netlify

#### 步骤

1. 推送到 GitHub
2. 在 Netlify 导入项目
3. 配置构建命令：
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 添加环境变量
5. 部署

---

### 3. 自建服务器

#### Docker 部署

```dockerfile
# Dockerfile
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
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t artstation-critic .
docker run -p 3000:3000 -e DEEPSEEK_API_KEY=your-key artstation-critic
```

---

## 环境变量配置

### 生产环境

**不要**将 `.env.local` 提交到 Git！

#### Vercel

1. 项目设置 → Environment Variables
2. 添加 `DEEPSEEK_API_KEY`
3. 选择环境（Production / Preview / Development）

#### 自建服务器

```bash
# systemd 服务
Environment="DEEPSEEK_API_KEY=your-key"

# 或 .env.production.local
echo "DEEPSEEK_API_KEY=your-key" > .env.production.local
```

---

## 构建优化

### 生产构建

```bash
npm run build
```

### 构建分析

```bash
# 分析包大小
ANALYZE=true npm run build
```

### 输出优化

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',  // 减小部署体积
  images: {
    unoptimized: true,   // 禁用图片优化（简化部署）
  },
};
```

---

## 监控

### Vercel 内置监控

- 访问分析（Vercel Analytics）
- 性能监控（Web Vitals）
- 错误日志

### 自定义监控

```bash
# 添加 Sentry
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 域名配置

### Vercel

1. 项目设置 → Domains
2. 添加自定义域名
3. 配置 DNS（CNAME 或 A 记录）
4. Vercel 自动配置 SSL

---

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      # 使用 Vercel CLI 部署
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 常见问题

### Q: 部署后 API Key 不生效？

A: 确保环境变量在部署平台正确配置，而不是只在本地 `.env.local`。

### Q: 构建失败？

A: 检查 Node.js 版本（需要 20+），运行 `npm run build` 查看错误。

### Q: 图片上传失败？

A: 检查 `next.config.ts` 中的图片配置，或禁用图片优化。

### Q: 如何回滚？

A: Vercel 自动保留历史部署，可在 Dashboard 选择回滚到之前的版本。
