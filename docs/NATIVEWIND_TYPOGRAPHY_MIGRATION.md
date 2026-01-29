# NativeWind Typography Migration Guide

## 1. Configuration Applied

Your `tailwind.config.js` has been updated to support **Plus Jakarta Sans** and **pixel-perfect** typography matching React Native conventions.

### Font Family Mapping
| Type | Font Family | Tailwind Class |
|------|-------------|----------------|
| Regular | PlusJakartaSans_400Regular | `font-sans` |
| Medium | PlusJakartaSans_500Medium | `font-sans-medium` |
| SemiBold | PlusJakartaSans_600SemiBold | `font-sans-semibold` |
| Bold | PlusJakartaSans_700Bold | `font-sans-bold` |
| ExtraBold | PlusJakartaSans_800ExtraBold | `font-sans-extrabold` |

### Font Size & Line Height Scale
The `fontSize` utility now automatically sets the correct line-height for you.

| Size | Font Size | Line Height | Tailwind Class |
|------|-----------|-------------|----------------|
| 2xs | 10px | 14px | `text-2xs` |
| xs | 12px | 16px | `text-xs` |
| sm | 14px | 20px | `text-sm` |
| base | 16px | 24px | `text-base` |
| lg | 18px | 26px | `text-lg` |
| xl | 20px | 28px | `text-xl` |
| 2xl | 24px | 32px | `text-2xl` |
| 3xl | 30px | 38px | `text-3xl` |
| 4xl | 36px | 44px | `text-4xl` |
| 5xl | 48px | 56px | `xlarge` |
| 6xl | 60px | 68px | `text-6xl` |

## 2. Migration Examples

### Standard Text
**Before (Inline Style)**
```jsx
<Text style={{ 
  fontFamily: 'PlusJakartaSans_400Regular', 
  fontSize: 16, 
  lineHeight: 24, 
  color: '#FFFFFF' 
}}>
  Hello World
</Text>
```

**After (NativeWind)**
```jsx
<Text className="font-sans text-base text-text-primary">
  Hello World
</Text>
```

### Headings (Bold + Large)
**Before (Inline Style)**
```jsx
<Text style={{ 
  fontFamily: 'PlusJakartaSans_700Bold', 
  fontSize: 24, 
  lineHeight: 32 
}}>
  Title
</Text>
```

**After (NativeWind)**
```jsx
<Text className="font-sans-bold text-2xl">
  Title
</Text>
```

### Custom Overrides
If you need a specific line-height that differs from the default pair:

**After (NativeWind)**
```jsx
// Uses text-base (16px) but overrides leading to 1.5 (24px) or specific value
<Text className="text-base leading-relaxed">
  Custom Leading
</Text>
```

## 3. Font Loading Setup
Your `src/app/_layout.tsx` is already correctly configured to load the required fonts:

```typescript
const [fontsLoaded] = useFonts({
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
});
```

Ensure this remains at the root level of your app.

## 4. Verification Checklist

- [ ] **Restart Server**: Run `npx expo start --clear` to apply the new `tailwind.config.js`.
- [ ] **Check Fonts**: Verify that `font-sans-bold` actually renders the Bold variant (it should look thicker than standard bolding).
- [ ] **Check Vertical Rhythm**: Ensure text blocks don't jump or shift. The `lineHeight` values are now hardcoded pixels matching your design system.
- [ ] **No Errors**: Ensure no "fontFamily '...'" not found errors in the console.
