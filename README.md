# 🕌 İhlas Zikir - 40K Geri Sayım Sayacı

Modern ve etkileyici bir zikir sayacı uygulaması. 40.000 defa "İhlas Suresi" zikrini takip etmenizi sağlar.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

## ✨ Özellikler

### 🎯 Temel Özellikler
- **40.000 Sayaç**: 40.000'den başlayarak 0'a doğru inen sayaç
- **Kalıcı Saklama**: İlerlemeniz localStorage ile otomatik kaydedilir
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel çalışır
- **Klavye Desteği**: Boşluk tuşu ile zikir sayabilirsiniz
- **Güvenli Sıfırlama**: İki aşamalı onay sistemi ile kazara sıfırlamayı önler

### 🎨 Görsel ve UX Özellikleri
- **Custom Cursor**: Masaüstünde özel tasarlanmış animasyonlu imleç
- **Circular Progress Ring**: SVG tabanlı dairesel ilerleme göstergesi
- **Gradient Efektleri**: Modern ve etkileyici renk geçişleri
- **Hover Animasyonları**: Kullanıcı etkileşimlerine anlık tepki
- **Tamamlanma Kutlaması**: 0'a ulaştığında confetti animasyonu
- **Arka Plan Efektleri**: Dinamik blur efektleri

### 🔧 Teknik Özellikler
- **Server/Client Rendering**: Next.js 15 ile optimize edilmiş performans
- **React Hooks**: useState, useEffect, useCallback ile modern state yönetimi
- **TypeScript**: Tip güvenliği ve gelişmiş IDE desteği
- **Tailwind CSS**: Utility-first CSS ile hızlı ve temiz styling
- **Local Storage API**: Tarayıcı tabanlı veri kalıcılığı

## 🚀 Kurulum

### Gereksinimler
- Node.js 18.x veya üzeri
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
\`\`\`bash
git clone <repo-url>
cd ihlas-zikir
\`\`\`

2. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

3. Geliştirme sunucusunu başlatın:
\`\`\`bash
npm run dev
\`\`\`

4. Tarayıcınızda açın:
\`\`\`
http://localhost:3000
\`\`\`

## 📱 Kullanım

### Zikir Çekme
- **Masaüstü**: Yuvarlak üzerine tıklayın veya boşluk tuşuna basın
- **Mobil**: Yuvarlak alana dokunun

### İlerleme Takibi
- Sayaç her tıklamada 1 azalır
- İlerleme yüzdesi gerçek zamanlı güncellenir
- Tüm veriler otomatik olarak kaydedilir

### Sıfırlama
1. Sağ alt köşedeki "Sıfırla" butonuna tıklayın
2. Açılan modalda ilerlemenizi görün
3. "Sıfırla" butonuna basarak onaylayın

## 🏗️ Proje Yapısı

\`\`\`
ihlas-zikir/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Ana sayfa
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global stiller ve animasyonlar
│   └── components/
│       ├── CustomCursor.tsx   # Özel imleç bileşeni
│       ├── CountdownCounter.tsx # Sayaç bileşeni
│       └── ResetModal.tsx     # Sıfırlama modal bileşeni
├── public/                    # Statik dosyalar
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## 🎨 Tasarım Kararları

### Renk Paleti
- **Primary**: Blue (rgb(59, 130, 246))
- **Secondary**: Purple (rgb(139, 92, 246))
- **Accent**: Pink (rgb(236, 72, 153))
- **Background**: Dark Gray (rgb(10, 10, 10))
- **Text**: Light Gray (rgb(237, 237, 237))

### Animasyonlar
- **Scale**: 0.95x tıklama, 1.05x hover
- **Duration**: 300ms geçişler
- **Easing**: ease-out fonksiyonu

### Tipografi
- **Başlıklar**: 48-60px, bold, gradient
- **Sayaç**: 72px, tabular-nums
- **Gövde**: 16-20px, normal

## 🔮 Gelecek Özellikler

- [ ] Offline PWA desteği
- [ ] İstatistik sayfası (günlük/haftalık/aylık)
- [ ] Sesli geri bildirim
- [ ] Farklı zikir türleri
- [ ] Sosyal paylaşım
- [ ] Dark/Light mode toggle
- [ ] Veritabanı entegrasyonu (Firebase)
- [ ] Kullanıcı hesapları ve senkronizasyon

## 📊 Performans

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

## 🛠️ Geliştirme

### Build
\`\`\`bash
npm run build
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

### Production Start
\`\`\`bash
npm start
\`\`\`

## 📄 Lisans

Bu proje kişisel kullanım içindir.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (\`git checkout -b feature/AmazingFeature\`)
3. Commit yapın (\`git commit -m 'Add some AmazingFeature'\`)
4. Push edin (\`git push origin feature/AmazingFeature\`)
5. Pull Request açın

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not**: Bu uygulama localStorage kullandığı için verileriniz yalnızca kullandığınız tarayıcıda saklanır. Tarayıcı verilerini temizlerseniz ilerlemeniz kaybolur.
