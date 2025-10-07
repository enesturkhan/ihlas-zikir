# 🏗️ Proje Yapısı ve Mimari

İhlas Zikir projesinin detaylı yapısı ve her dosyanın sorumluluğu.

---

## 📁 Dizin Yapısı

```
ihlas-zikir/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (metadata, fonts)
│   │   ├── page.tsx              # Ana sayfa (Home)
│   │   ├── globals.css           # Global stiller ve animasyonlar
│   │   └── favicon.ico           # Favicon
│   │
│   └── components/               # React bileşenleri
│       ├── CustomCursor.tsx      # Özel mouse cursor
│       ├── CountdownCounter.tsx  # Ana sayaç bileşeni
│       ├── ResetModal.tsx        # Sıfırlama onay modalı
│       ├── Statistics.tsx        # İstatistik paneli
│       └── ShareButton.tsx       # Paylaşım butonu
│
├── public/                       # Statik dosyalar
│   ├── manifest.json             # PWA manifest
│   ├── *.svg                     # SVG ikonlar
│   └── icon-*.png                # App ikonları (eklenecek)
│
├── node_modules/                 # NPM paketleri
│
├── .next/                        # Build output (git ignore)
│
├── Configuration Files
├── package.json                  # NPM yapılandırması
├── package-lock.json             # Lock file
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config
├── .gitignore                    # Git ignore rules
│
└── Documentation
    ├── README.md                 # Ana dokümantasyon
    ├── FEATURES.md               # Özellik detayları
    ├── DEPLOYMENT.md             # Deploy rehberi
    ├── QUICKSTART.md             # Hızlı başlangıç
    └── PROJECT_STRUCTURE.md      # Bu dosya
```

---

## 📄 Dosya Detayları

### 🎯 Core Application Files

#### `src/app/layout.tsx`
**Sorumluluk**: Root layout ve metadata
- Metadata (SEO, PWA)
- Viewport ayarları
- Font yüklemeleri (Geist Sans, Geist Mono)
- HTML lang attribute (tr)
- Apple Web App meta tags

**Export Edilen**:
- `metadata`: SEO ve PWA metadata
- `viewport`: Viewport ve theme color
- `RootLayout`: Root layout component

---

#### `src/app/page.tsx`
**Sorumluluk**: Ana sayfa ve state orchestration
- Global state yönetimi (hover, click, modal)
- localStorage operasyonları
- Tüm bileşenlerin entegrasyonu
- Custom cursor kontrolü
- Reset handler

**State**:
```typescript
isHovering: boolean        // Cursor hover durumu
isClicking: boolean        // Click animasyon durumu
isModalOpen: boolean       // Modal açık/kapalı
isResetHovered: boolean    // Reset butonu hover
```

**Functions**:
- `handleClick()`: Click animasyonunu tetikler
- `handleReset()`: Sayacı sıfırlar
- `getCurrentCount()`: localStorage'dan sayıyı okur

---

#### `src/app/globals.css`
**Sorumluluk**: Global stiller ve animasyonlar
- CSS custom properties (color variables)
- Custom cursor gizleme (@media desktop)
- Keyframe animations:
  - `scale-in`: Modal animasyonu
  - `confetti`: Konfeti patlaması
- Utility classes
- Reset/normalize styles

**Animasyonlar**:
```css
@keyframes scale-in        # Modal zoom-in
@keyframes confetti        # Konfeti hareketi
```

---

### 🧩 Component Files

#### `src/components/CustomCursor.tsx`
**Sorumluluk**: Desktop için custom cursor

**Props**:
```typescript
isHovering?: boolean    // Hover durumu
isClicking?: boolean    // Click durumu
```

**State**:
```typescript
position: {x, y}        // Mouse koordinatları
isVisible: boolean      // Cursor görünürlüğü
```

**Features**:
- Real-time mouse tracking
- Smooth transitions (150ms)
- Scale animations (hover: 1.5x, click: 0.75x)
- Color changes (blue → purple)
- Outer ring + inner dot design

**Event Listeners**:
- `mousemove`: Pozisyon güncelleme
- `mouseleave`: Cursor gizleme

---

#### `src/components/CountdownCounter.tsx`
**Sorumluluk**: Ana sayaç mantığı ve görselleştirme

**Props**:
```typescript
onHover: (hovering: boolean) => void
onClick: () => void
```

**State**:
```typescript
count: number           // Mevcut sayaç değeri
isAnimating: boolean    // Animasyon durumu
showConfetti: boolean   // Konfeti gösterimi
```

**Features**:
- localStorage persistence
- Circular SVG progress ring
- Gradient colors
- Click/touch decrement
- Keyboard support (Space)
- Haptic feedback
- Completion celebration
- Scale animations

**localStorage Keys**:
- `ihlas-zikir-count`: Sayaç değeri

**Calculations**:
```typescript
progress = (completed / total) * 100
circumference = 2 * π * radius
strokeDashoffset = circumference - (progress/100) * circumference
```

---

#### `src/components/ResetModal.tsx`
**Sorumluluk**: Sıfırlama onay modalı

**Props**:
```typescript
isOpen: boolean
onClose: () => void
onConfirm: () => void
progress: number        // Tamamlanan zikir sayısı
```

**Features**:
- Backdrop blur
- Body scroll lock
- Warning icon
- Progress display
- Two-button system (Cancel/Confirm)
- Escape to close
- Click outside to close

**Styling**:
- Glassmorphism effect
- Scale-in animation
- Gradient background
- Accessibility (focus trap)

---

#### `src/components/Statistics.tsx`
**Sorumluluk**: İstatistik paneli ve hesaplamalar

**Props**:
```typescript
count: number           // Kalan sayı
initialCount: number    // Başlangıç (40000)
```

**State**:
```typescript
startTime: number | null    // Başlangıç timestamp
isOpen: boolean             // Panel açık/kapalı
```

**localStorage Keys**:
- `ihlas-zikir-start-time`: Başlangıç zamanı

**Calculated Metrics**:
```typescript
completed = initialCount - count
progress = (completed / initialCount) * 100
elapsedTime = now - startTime
averagePerMinute = completed / elapsedMinutes
estimatedTime = remainingCount / averagePerMinute
```

**Features**:
- Collapsible panel
- Real-time calculations
- Progress bar
- Time formatting (hours:minutes)
- Completion detection
- ShareButton integration

---

#### `src/components/ShareButton.tsx`
**Sorumluluk**: Sosyal paylaşım

**Props**:
```typescript
completed: number
total: number
```

**State**:
```typescript
showCopied: boolean     // Toast gösterimi
```

**Features**:
- Native Share API (mobil)
- Clipboard fallback (desktop)
- Formatted text template
- Success toast notification
- Auto-hide after 2s

**Share Template**:
```
🕌 İhlas Zikir İlerlemem

✅ Tamamlanan: X / 40.000
📊 İlerleme: %Y

"Lâ ilahe illallah" zikrini tamamlama 
yolculuğumda devam ediyorum! 🤲

#İhlasZikir #Zikir #Tesbih
```

---

## 🔄 Data Flow

### 1. İlk Yükleme
```
User → page.tsx loads
  ↓
CountdownCounter mounts
  ↓
useEffect reads localStorage
  ↓
State initialized with saved value (or 40000)
  ↓
Statistics component starts tracking
```

### 2. Zikir Çekme
```
User clicks/presses space
  ↓
CountdownCounter.handleClick()
  ↓
count - 1
  ↓
useEffect triggers
  ↓
localStorage updated
  ↓
UI re-renders
  ↓
Haptic feedback (mobile)
  ↓
Animation triggers
```

### 3. Sıfırlama
```
User clicks "Reset"
  ↓
page.tsx opens modal
  ↓
Modal shows progress
  ↓
User confirms
  ↓
localStorage.setItem(40000)
  ↓
localStorage.removeItem(start-time)
  ↓
window.location.reload()
```

---

## 🎨 Styling Architecture

### Tailwind Utility Classes
- **Spacing**: p-*, m-*, gap-*
- **Colors**: bg-gray-*, text-*, border-*
- **Layout**: flex, grid, absolute, fixed
- **Responsive**: sm:, md:, lg:
- **Effects**: hover:, active:, transition-*

### Custom CSS
- **Animations**: @keyframes in globals.css
- **Variables**: CSS custom properties
- **Media Queries**: Desktop-only cursor

### Color System
```css
/* Grays */
gray-950: #0a0a0a (background)
gray-900: #1a1a1a
gray-800: #2a2a2a (cards)
gray-700: #3a3a3a (borders)
gray-400: #9ca3af (secondary text)
gray-300: #d1d5db (tertiary text)
gray-200: #e5e7eb (primary text)

/* Gradients */
blue-400 → purple-400 → pink-400
blue-500 → purple-500
```

---

## 🧪 State Management

### Local Component State
- `useState` for simple values
- `useEffect` for side effects
- `useCallback` for memoization

### Persistence Layer
- `localStorage` for client-side storage
- Automatic sync on change
- Fallback to default values

### No External State Library
- Reason: Simple app, no complex state
- Benefits: Smaller bundle, less complexity
- Future: Consider Redux/Zustand if features grow

---

## ⚡ Performance Strategies

### 1. React Optimizations
- `useCallback` for stable references
- CSS transforms (GPU-accelerated)
- Minimal re-renders

### 2. Next.js Features
- Static generation
- Code splitting
- Image optimization (future)

### 3. Bundle Optimization
- Tree shaking
- Minification
- Gzip/Brotli compression

---

## 🔐 Security Considerations

### Client-Side Only
- No backend = No server vulnerabilities
- No database = No SQL injection
- No authentication = No auth exploits

### localStorage Safety
- Domain-specific storage
- No sensitive data stored
- XSS protection via React (escaped output)

---

## 🧪 Testing Strategy (Future)

### Unit Tests
```typescript
// CountdownCounter.test.tsx
test('decrements on click')
test('saves to localStorage')
test('loads from localStorage')
```

### Integration Tests
```typescript
// page.test.tsx
test('full user flow')
test('reset functionality')
```

### E2E Tests
```typescript
// cypress or playwright
test('complete user journey')
```

---

## 📦 Dependencies

### Production
```json
{
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "next": "15.5.4"
}
```

### Development
```json
{
  "typescript": "^5",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "tailwindcss": "^4",
  "eslint": "^9",
  "eslint-config-next": "15.5.4"
}
```

**Zero Runtime Dependencies** 🎉
- No axios, lodash, moment, etc.
- Native APIs only
- Smaller bundle size

---

## 🚀 Build Process

### Development
```bash
npm run dev
  ↓
Turbopack compilation
  ↓
Hot Module Replacement
  ↓
Fast Refresh
```

### Production
```bash
npm run build
  ↓
TypeScript compilation
  ↓
Turbopack bundling
  ↓
Code splitting
  ↓
Minification
  ↓
Static page generation
  ↓
Output to .next/
```

---

## 📊 Bundle Analysis

### Current Stats
```
First Load JS: ~117 KB
Page Size: ~4.44 KB
Chunks: 3 (shared)
```

### Optimization Targets
- ✅ < 200 KB First Load
- ✅ < 5 KB Per Page
- ✅ < 100ms TTI

---

## 🔮 Future Enhancements

### Potential New Files
```
src/
├── lib/
│   ├── analytics.ts      # Analytics utilities
│   ├── storage.ts        # Storage abstraction
│   └── firebase.ts       # Firebase integration
│
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useStatistics.ts
│   └── useSound.ts
│
├── types/
│   └── index.ts          # TypeScript types
│
└── utils/
    ├── calculations.ts   # Math utilities
    └── formatters.ts     # Format utilities
```

---

## 📚 Related Documentation

- [README.md](./README.md) - Genel bakış
- [FEATURES.md](./FEATURES.md) - Özellik detayları
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy rehberi
- [QUICKSTART.md](./QUICKSTART.md) - Hızlı başlangıç

---

**Son Güncelleme**: 2025-10-07

