# ⚡ Hızlı Başlangıç Rehberi

İhlas Zikir uygulamasını 5 dakikada çalıştırın!

---

## 📦 1. Kurulum

```bash
# 1. Projeyi klonlayın (veya zip olarak indirin)
git clone <repo-url>
cd ihlas-zikir

# 2. Bağımlılıkları yükleyin
npm install

# 3. Development sunucusunu başlatın
npm run dev
```

✅ Tarayıcınızda açın: **http://localhost:3000**

---

## 🎮 2. Nasıl Kullanılır?

### Zikir Çekmek
- 🖱️ **Masaüstü**: Yuvarlak üzerine tıklayın veya **Space** tuşuna basın
- 📱 **Mobil**: Yuvarlak alana dokunun

### İstatistikleri Görmek
- Sol alt köşedeki 📊 ikona tıklayın
- İlerlemenizi, hızınızı ve tahmini süreyi görün

### İlerlemeyi Paylaşmak
- İstatistik panelinde "Paylaş" butonuna tıklayın
- Mobilde: Native share menüsü açılır
- Masaüstünde: Metin panoya kopyalanır

### Sıfırlamak
- Sağ alt köşedeki "Sıfırla" butonuna tıklayın
- Modalda ilerlemenizi görün
- "Sıfırla" ile onaylayın

---

## 🛠️ 3. Komutlar

```bash
# Development sunucusu (hot reload ile)
npm run dev

# Production build oluştur
npm run build

# Production sunucusu başlat
npm start

# Linter çalıştır
npm run lint
```

---

## 📱 4. Mobil Test

### iOS Safari
1. iPhone'unuzdan http://YOUR_LOCAL_IP:3000 adresine gidin
2. Paylaş butonu → "Ekrana Ekle"
3. PWA olarak kullanın

### Android Chrome
1. Android cihazınızdan http://YOUR_LOCAL_IP:3000 adresine gidin
2. Menü → "Ana ekrana ekle"
3. PWA olarak kullanın

**Local IP'nizi bulmak için:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

## 🎨 5. Özelleştirme

### Renkleri Değiştirmek
`src/app/globals.css` dosyasını düzenleyin:

```css
/* Ana renkler */
:root {
  --background: #0a0a0a;  /* Arka plan */
  --foreground: #ededed;  /* Metin */
}
```

### Sayacı Değiştirmek
`src/app/page.tsx` ve `src/components/CountdownCounter.tsx`:

```typescript
// 40K yerine farklı bir sayı
const INITIAL_COUNT = 100000; // Örnek: 100K
```

### Metinleri Değiştirmek
`src/app/page.tsx`:

```tsx
<h1>İhlas Zikir</h1>
<p>40.000 defa "Lâ ilahe illallah" zikrini tamamlayın</p>
```

---

## 🐛 6. Sorun Giderme

### Port zaten kullanımda
```bash
# Farklı bir port kullanın
npm run dev -- -p 3001
```

### Build hatası
```bash
# Cache'i temizleyin
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript hatası
```bash
# TypeScript'i kontrol edin
npx tsc --noEmit
```

---

## 📚 7. Daha Fazla Bilgi

- 📖 **Tüm Özellikler**: [FEATURES.md](./FEATURES.md)
- 🚀 **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📘 **Ana Dokümantasyon**: [README.md](./README.md)

---

## ✅ İlk Kullanım Kontrol Listesi

- [ ] npm install başarılı
- [ ] npm run dev çalışıyor
- [ ] http://localhost:3000 açılıyor
- [ ] Sayaç tıklanabiliyor
- [ ] Sayı azalıyor
- [ ] Sayfa yenilendiğinde kayıt korunuyor
- [ ] İstatistik paneli açılıyor
- [ ] Sıfırlama butonu çalışıyor
- [ ] Modal açılıyor ve iptal ediliyor
- [ ] (Masaüstünde) Custom cursor görünüyor
- [ ] (Mobilede) Titreşim hissediliyor

---

## 🎉 Başarılar!

Artık uygulamayı kullanmaya hazırsınız!

### Önerilen İlk Adımlar:
1. ✅ 10-20 zikir çekerek test edin
2. 📊 İstatistik panelini açın
3. 🔄 Sayfayı yenileyin (kayıt korunmalı)
4. 📱 Mobil cihazda deneyin
5. 🎨 Kendi özelleştirmelerinizi yapın

---

## 💡 İpuçları

1. **Klavye Kısayolu**: Space tuşu ile hızlıca zikir çekebilirsiniz
2. **İstatistikler**: İlerlemenizi takip etmek için düzenli kontrol edin
3. **Paylaşım**: Arkadaşlarınızla ilerlemenizi paylaşarak motive olun
4. **Hedef Koyun**: Günlük mini hedefler belirleyin (örn: 500/gün)

---

## 🤝 Katkıda Bulunma

Geliştirme yapmak isterseniz:

```bash
# 1. Yeni branch oluşturun
git checkout -b feature/yeni-ozellik

# 2. Değişikliklerinizi yapın
# ...

# 3. Commit edin
git commit -m "Yeni özellik: ..."

# 4. Push edin
git push origin feature/yeni-ozellik

# 5. Pull Request açın
```

---

## 📞 Yardım

Sorunuz mu var?
- 📖 [FEATURES.md](./FEATURES.md) - Tüm özellikler
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy rehberi
- 💬 Issue açın (GitHub)

---

**Keyifli zikir çekimler! 🤲**

