# Remindr Design System Export

This document catalogs the visual design language of the Remindr Web App for translation to React Native.

---

## 1. Color Palette

### CSS Variables (Source of Truth: `index.css`)
| Variable Name       | Hex Code    | Usage                                  |
|---------------------|-------------|----------------------------------------|
| `--bg-primary`      | `#050505`   | Main app background                    |
| `--bg-secondary`    | `#0f172a`   | Deep navy, alternative bg              |
| `--bg-surface`      | `#1e293b`   | Cards, inputs, elevated surfaces       |
| `--accent-purple`   | `#8B5CF6`   | Primary brand accent, buttons, links   |
| `--accent-fuchsia`  | `#d946ef`   | Secondary gradient end, highlights     |
| `--text-primary`    | `#ffffff`   | Main text                              |
| `--text-secondary`  | `#a1a1aa`   | Muted text, subtitles (zinc-400)       |

### Additional Palette (Used Inline)
| Color               | Hex Code    | Usage                                  |
|---------------------|-------------|----------------------------------------|
| Logo Container BG   | `#0B0B0F`   | App icon/logo container                |
| Telegram Blue       | `#24A1DE`   | Telegram button                        |
| Destructive/Error   | `#ef4444`   | Error text, red icons                  |
| Success             | `#22c55e`   | Success checkmarks, green text         |
| Muted Text (Dark)   | `#52525b`   | Footer text, disabled (zinc-600)       |
| Dim Text            | `#71717a`   | Help text (zinc-500)                   |

### React Native Color Object
```typescript
export const Colors = {
  bgPrimary: '#050505',
  bgSecondary: '#0f172a',
  bgSurface: '#1e293b',
  logoContainer: '#0B0B0F',

  accentPurple: '#8B5CF6',
  accentFuchsia: '#d946ef',
  telegramBlue: '#24A1DE',

  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  textDim: '#52525b',

  destructive: '#ef4444',
  success: '#22c55e',
};
```

---

## 2. Typography

### Font Family
- **Primary Font**: `Plus Jakarta Sans`
- **Google Fonts URL**: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap`
- **Fallback**: `sans-serif`

### Font Weights
| Weight | Tailwind Class | Usage               |
|--------|----------------|---------------------|
| 400    | `font-normal`  | Body text           |
| 500    | `font-medium`  | Subtitles, labels   |
| 600    | `font-semibold`| Buttons, emphasis   |
| 700    | `font-bold`    | Card titles         |
| 800    | `font-extrabold`| Headlines          |
| 900    | `font-black`   | Hero headlines      |

### Font Sizes (Common)
| Tailwind Class | Size (px/rem) | Usage                          |
|----------------|---------------|--------------------------------|
| `text-5xl`     | 48px          | Hero headline (Login)          |
| `text-4xl`     | 36px          | Page titles (Timeline)         |
| `text-3xl`     | 30px          | Section headers                |
| `text-xl`      | 20px          | Sub-section titles (Up Next)   |
| `text-lg`      | 18px          | Large body text                |
| `text-base`    | 16px          | Standard body / buttons        |
| `text-sm`      | 14px          | Secondary text, labels         |
| `text-xs`      | 12px          | Captions, helper text          |
| `text-[11px]`  | 11px          | Micro labels, section headers  |
| `text-[10px]`  | 10px          | Uppercase section labels       |

### React Native Typography Preset
```typescript
export const Typography = {
  hero: { fontSize: 48, fontWeight: '900', letterSpacing: -1.5 },
  pageTitle: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  sectionTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '500' },
  micro: { fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
};
```

---

## 3. Spacing

### Base Scale (px)
| Name | Value | Tailwind |
|------|-------|----------|
| xs   | 4     | `p-1`    |
| sm   | 8     | `p-2`    |
| md   | 16    | `p-4`    |
| lg   | 24    | `p-6`    |
| xl   | 32    | `p-8`    |
| 2xl  | 48    | `p-12`   |

### Common Spacing Patterns
- **Page padding**: `px-6 py-8` (horizontal 24px, vertical 32px)
- **Card padding**: `p-6` (24px all around)
- **Button padding**: `px-6 py-3.5` (~24px H, 14px V)
- **Gap between items**: `space-y-4` (16px) or `gap-3` (12px)

---

## 4. Border Radius

| Name  | Value (px) | Tailwind          | Usage                     |
|-------|------------|-------------------|---------------------------|
| sm    | 8          | `rounded-lg`      | Tags, small buttons       |
| md    | 16         | `rounded-2xl`     | Standard cards, buttons   |
| lg    | 24         | `rounded-[24px]`  | Large buttons             |
| xl    | 32         | `rounded-[32px]`  | Feature cards, modals     |
| 2xl   | 45         | `rounded-[45px]`  | Hero empty states         |
| full  | 9999       | `rounded-full`    | Avatars, circular buttons |

### React Native BorderRadius Object
```typescript
export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 45,
  full: 9999,
};
```

---

## 5. Shadows

| Name           | CSS / Tailwind                             | Usage                 |
|----------------|--------------------------------------------|-----------------------|
| Card Shadow    | `shadow-xl` / box-shadow                   | Buttons, cards        |
| Deep Shadow    | `shadow-[0_25px_60px_rgba(0,0,0,0.5)]`     | Logo container        |
| Heavy Shadow   | `shadow-[0_30px_70px_rgba(0,0,0,0.9)]`     | Login hero icon       |
| Accent Shadow  | `shadow-purple-500/20`                     | CTA buttons           |

### React Native Shadow Preset
```typescript
export const Shadows = {
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  deepShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
};
```

---

## 6. Gradients

| Name             | From         | To            | Usage                          |
|------------------|--------------|---------------|--------------------------------|
| Brand Gradient   | `#a855f7`    | `#d946ef`     | Hero "r" letter, CTA buttons   |
|                  | (purple-400) | (fuchsia-500) |                                |
| Background Glow  | `#9333ea/15` | transparent   | Decorative bg blurs            |

### Tailwind Usage
```html
<span class="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">r</span>
```

### React Native (expo-linear-gradient)
```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient colors={['#a855f7', '#d946ef']} start={{x:0,y:0}} end={{x:1,y:0}}>
  <Text>Gradient Button</Text>
</LinearGradient>
```

---

## 7. Animations

| Name        | Duration | Easing                           | Usage                      |
|-------------|----------|----------------------------------|----------------------------|
| Fade In     | 400ms    | `cubic-bezier(0.16, 1, 0.3, 1)` | Page/section entry         |
| Pulse       | default  | Tailwind `animate-pulse`         | Loading indicators, logos  |
| Spin        | default  | `animate-spin`                   | Spinner                    |
| Scale Press | instant  | `active:scale-95`                | Button press feedback      |
| Hover Scale | 500ms    | `hover:scale-105`                | Icon hover                 |

### React Native (react-native-reanimated)
```typescript
// Fade In
const fadeIn = useSharedValue(0);
useEffect(() => { fadeIn.value = withTiming(1, { duration: 400 }); }, []);
const animatedStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));
```

---

## 8. Component Blueprints

### Primary Button
```html
<button class="w-full h-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[24px] text-white font-semibold text-base active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20">
  Button Text
</button>
```

### Secondary Button (Outline)
```html
<button class="w-full h-14 bg-surface rounded-2xl text-white font-semibold border border-white/10 active:scale-[0.98]">
  Secondary
</button>
```

### Card / Surface
```html
<div class="bg-[#0B0B0F]/60 border border-white/5 rounded-[32px] p-6">
  Content
</div>
```

### Empty State Container
```html
<div class="py-14 flex flex-col items-center justify-center text-center bg-[#0B0B0F]/40 border border-white/5 rounded-[45px] px-8">
  <!-- Icon, Title, Subtext, Action Button -->
</div>
```

### Section Header
```html
<h3 class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-5 pl-1">Section Title</h3>
```

---

## 9. Logo SVG

The Remindr "r" logo as SVG path data:
```xml
<svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-60 -70) scale(1.12)">
    <path
      d="
        M 430 700
        L 430 420
        C 430 330 480 280 560 280
        L 650 280
        C 700 280 720 320 700 350
        C 680 380 640 400 600 400
        L 520 400
        L 520 700
        C 520 740 500 760 470 760
        C 445 760 430 740 430 700
        Z
      "
      fill="#FFFFFF"
    />
  </g>
</svg>
```

---

## 10. Summary for RN Implementation

1. Install `expo-linear-gradient` for gradients.
2. Install `react-native-svg` and port SVG icons/logos.
3. Use `Plus Jakarta Sans` via `expo-google-fonts`.
4. Map all colors to the `Colors` object above.
5. Translate Tailwind classes using the mapping tables.
6. Use `react-native-reanimated` for animations.
