# Stay Hydrated — Asset Pack

A premium SVG asset library for the Stay Hydrated React Native app. Every file is a hand-coded SVG (no external dependencies, no rasters), so they stay crisp on every device and ship in a tiny bundle.

## What's inside

```
assets/
├── logo/
│   ├── app_icon.svg               1024 × 1024 — Play / App Store icon
│   └── logo_horizontal.svg        wordmark + tagline lockup
├── illustrations/
│   ├── welcome_hero.svg           login / onboarding hero
│   ├── goal_setup.svg             bottle being filled, for goal screen
│   ├── empty_state.svg            "no sips logged" empty state
│   └── goal_complete_celebration.svg   medallion + confetti, post-goal
├── badges/
│   ├── badge_first_sip.svg
│   ├── badge_streak_7.svg
│   ├── badge_streak_30.svg
│   ├── badge_hydration_pro.svg
│   ├── badge_wave_maker.svg
│   └── badge_all_star.svg
├── icons/                         24 × 24, stroke = currentColor
│   ├── icon_home.svg
│   ├── icon_stats.svg
│   ├── icon_profile.svg
│   ├── icon_settings.svg
│   ├── icon_drop.svg
│   ├── icon_bottle.svg
│   ├── icon_glass.svg
│   ├── icon_fire.svg
│   ├── icon_bell.svg
│   ├── icon_camera.svg
│   ├── icon_share.svg
│   ├── icon_plus.svg
│   ├── icon_target.svg
│   └── icon_check.svg
└── patterns/
    ├── wave_pattern.svg           soft aqua wave background
    └── bubbles_pattern.svg        deep gradient with floating bubbles
```

## Design tokens

| Token              | Value                          |
| ------------------ | ------------------------------ |
| Sky 500 (primary)  | `#0EA5E9`                      |
| Cyan 400           | `#22D3EE`                      |
| Cyan 300           | `#67E8F9`                      |
| Indigo 800         | `#1E40AF`                      |
| Streak 500         | `#F97316`                      |
| Surface mist start | `#E0F2FE`                      |
| Surface mist end   | `#DBEAFE`                      |
| Text primary       | `#0F172A`                      |
| Text secondary     | `#64748B`                      |
| Radius (cards)     | `16 px`                        |
| Font               | Inter (400 / 500 / 600 / 700)  |

## Use in React Native

### 1. Install once

```bash
npm install react-native-svg
npm install --save-dev react-native-svg-transformer
```

Add the transformer to `metro.config.js`:

```js
const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  const { transformer, resolver } = config;
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };
  return config;
})();
```

### 2. Import an SVG as a component

```tsx
import WelcomeHero from './assets/illustrations/welcome_hero.svg';
import IconHome from './assets/icons/icon_home.svg';
import BadgeStreak7 from './assets/badges/badge_streak_7.svg';

export default function Login() {
  return (
    <View style={{ alignItems: 'center', padding: 24 }}>
      <WelcomeHero width={320} height={240} />
      <Text style={styles.title}>Welcome back</Text>
    </View>
  );
}
```

### 3. Tint line icons via the `color` prop

The icons use `stroke="currentColor"`, so you can recolor them at runtime:

```tsx
<IconHome width={24} height={24} color="#0EA5E9" />
<IconHome width={24} height={24} color="#94A3B8" />   // inactive tab
```

### 4. Use the app icon

For the launch icon, export `logo/app_icon.svg` to PNG at the sizes Android expects (`mipmap-hdpi` 72 × 72, `mipmap-xhdpi` 96, `xxhdpi` 144, `xxxhdpi` 192, `play-store` 512). One-liner with `rsvg-convert`:

```bash
for size in 72 96 144 192 512; do
  rsvg-convert -w $size -h $size assets/logo/app_icon.svg \
    -o android/app/src/main/res/mipmap-${size}/ic_launcher.png
done
```

## Animation tips (water fill)

The `welcome_hero.svg` and `goal_setup.svg` both clip a water rectangle by the bottle path — you can animate the rectangle's `y` value over time with `react-native-reanimated` to create the live water-fill effect from the dashboard mock:

```tsx
const fillY = useSharedValue(180);
const props = useAnimatedProps(() => ({ y: fillY.value }));
return <AnimatedRect animatedProps={props} ... />;
```

For the wave inside the bottle, animate `transform="translate(x 0)"` from `0` to `-50%` on a loop.

## License

These assets are generated for the Stay Hydrated project. Use them freely in your app, fork them, recolor them, and ship them.
