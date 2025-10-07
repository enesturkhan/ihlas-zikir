# 🚀 Deployment Rehberi - İhlas Zikir

Bu rehber, İhlas Zikir uygulamasını çeşitli platformlara nasıl deploy edeceğinizi adım adım açıklar.

---

## 📋 Önkoşullar

- ✅ Node.js 18.x veya üzeri yüklü olmalı
- ✅ Git yüklü olmalı
- ✅ Bir GitHub hesabınız olmalı (Vercel/Netlify için)
- ✅ npm veya yarn package manager

---

## 🎯 Vercel'e Deploy (Önerilen)

Vercel, Next.js'in yaratıcıları tarafından geliştirilmiştir ve en iyi performansı sağlar.

### Adım 1: GitHub'a Yükleyin
```bash
# Git repository'si başlatın
git init

# Dosyaları ekleyin
git add .

# Commit yapın
git commit -m "Initial commit: İhlas Zikir MVP"

# GitHub'da yeni bir repository oluşturun ve push edin
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Adım 2: Vercel ile Bağlayın

**Yöntem 1: Vercel Dashboard (Kolay)**
1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. Repository'nizi seçin
5. Framework: **Next.js** (otomatik algılanır)
6. Build Command: `npm run build` (varsayılan)
7. "Deploy" butonuna tıklayın

**Yöntem 2: Vercel CLI**
```bash
# Vercel CLI'yi yükleyin
npm install -g vercel

# Deploy edin
vercel

# Production deploy
vercel --prod
```

### Adım 3: Domain Ayarları (Opsiyonel)
1. Vercel Dashboard → Project Settings → Domains
2. Özel domain ekleyin
3. DNS ayarlarını yapın

### Vercel Avantajları
- ⚡ Instant deployment (saniyeler içinde)
- 🌍 Global CDN
- 🔄 Automatic SSL
- 📊 Analytics dahil
- 🔁 Auto-deploy on push

---

## 🔷 Netlify'a Deploy

### Adım 1: Netlify Build Ayarları
Projenize `netlify.toml` dosyası ekleyin:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Adım 2: Deploy

**Yöntem 1: Netlify Dashboard**
1. [netlify.com](https://netlify.com) adresine gidin
2. "Add new site" → "Import an existing project"
3. GitHub repository'nizi seçin
4. Build settings otomatik algılanır
5. "Deploy site" butonuna tıklayın

**Yöntem 2: Netlify CLI**
```bash
# Netlify CLI'yi yükleyin
npm install -g netlify-cli

# Giriş yapın
netlify login

# Deploy edin
netlify deploy

# Production deploy
netlify deploy --prod
```

---

## 🐳 Railway'e Deploy

Railway, container-based deployment sağlar.

### Adımlar
1. [railway.app](https://railway.app) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Repository'nizi seçin
5. Railway otomatik olarak Next.js'i algılar
6. Deploy başlar

### Railway Avantajları
- 🚀 Hızlı başlangıç
- 💰 Generous free tier
- 🔧 Kolay configuration

---

## 📄 Static Export (GitHub Pages)

Eğer tamamen statik bir site istiyorsanız:

### Adım 1: next.config.ts'yi Güncelleyin
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### Adım 2: Build ve Deploy
```bash
# Static export oluşturun
npm run build

# out/ klasörü oluşturulur
# Bu klasörü GitHub Pages'e deploy edin
```

### GitHub Pages Deploy
```bash
# gh-pages branch oluşturun
npm install -g gh-pages

# Deploy edin
gh-pages -d out
```

**Not**: Static export kullanırken bazı Next.js özellikleri (API routes, ISR) çalışmaz.

---

## 🔧 Build ve Test

### Local Production Build
```bash
# Production build
npm run build

# Production server başlatın
npm start

# Tarayıcıda açın: http://localhost:3000
```

### Build Size Kontrolü
```bash
npm run build

# Output:
# Route (app)                         Size  First Load JS
# ┌ ○ /                            4.44 kB         117 kB
# └ ○ /_not-found                      0 B         113 kB
```

### Performance Test
```bash
# Lighthouse ile test edin
npm run build
npm start

# Chrome DevTools → Lighthouse → Generate Report
```

---

## 🌍 Domain Ayarları

### Özel Domain Ekleme

#### Vercel
1. Project Settings → Domains
2. Domain adınızı girin
3. DNS'de bu kayıtları ekleyin:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

#### Netlify
1. Site Settings → Domain Management
2. Add custom domain
3. DNS kayıtları:
   ```
   Type: CNAME
   Name: www
   Value: <your-site>.netlify.app
   ```

---

## 🔒 Environment Variables

Bu projede environment variable gerekmez, ancak gelecekte eklemek isterseniz:

### Vercel
```bash
# CLI ile
vercel env add <NAME>

# veya Dashboard'dan:
# Project Settings → Environment Variables
```

### Netlify
```bash
# netlify.toml içinde
[build.environment]
  NODE_VERSION = "18"
```

---

## 📊 Analytics Kurulumu (Opsiyonel)

### Vercel Analytics
```bash
# Paket yükleyin
npm install @vercel/analytics

# _app.tsx veya layout.tsx'e ekleyin
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics
```typescript
// app/layout.tsx
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `}
  </script>
</head>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Örneği

`.github/workflows/deploy.yml` oluşturun:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Build Hataları

**Problem**: `Module not found`
```bash
# Çözüm: node_modules'u temizleyin
rm -rf node_modules package-lock.json
npm install
```

**Problem**: TypeScript hataları
```bash
# Çözüm: TypeScript cache'i temizleyin
rm -rf .next
npm run build
```

### Performance Sorunları

**Problem**: Yavaş yükleniyor
- ✅ Image optimization kullanın
- ✅ Code splitting kontrol edin
- ✅ Bundle analyzer çalıştırın:
  ```bash
  npm install -D @next/bundle-analyzer
  ```

---

## 📱 PWA Deployment (Gelecek)

PWA özelliklerini etkinleştirmek için:

```bash
# next-pwa yükleyin
npm install next-pwa

# next.config.ts'ye ekleyin
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... diğer ayarlar
});
```

---

## ✅ Deployment Checklist

Deploy etmeden önce kontrol edin:

- [ ] `npm run build` başarılı
- [ ] `npm run lint` hatasız
- [ ] Tüm environment variables ayarlandı
- [ ] manifest.json ve PWA ayarları doğru
- [ ] SEO metadata eksiksiz
- [ ] Analytics entegre (isterseniz)
- [ ] Domain DNS kayıtları yapılandırıldı
- [ ] HTTPS etkin
- [ ] Performance test yapıldı (Lighthouse)

---

## 📞 Destek

Deployment sırasında sorun yaşarsanız:

1. **Vercel**: [vercel.com/support](https://vercel.com/support)
2. **Netlify**: [netlify.com/support](https://netlify.com/support)
3. **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 Başarılı Deployment Sonrası

✅ Uygulamanız canlıda!
- 🌍 URL'i paylaşın
- 📱 Mobilde test edin
- 🔍 SEO kontrolü yapın
- 📊 Analytics'i takip edin
- 🐛 Error monitoring ekleyin (Sentry gibi)

**Demo URL Örneği**: `https://ihlas-zikir.vercel.app`

---

## 🚀 Production Optimizasyonları

### 1. Caching Strategy
```typescript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*).(jpg|png|svg|ico)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

### 2. Compression
Vercel ve Netlify otomatik olarak gzip/brotli compression uygular.

### 3. Security Headers
```typescript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

---

Tebrikler! 🎉 Uygulamanız artık production'da!

