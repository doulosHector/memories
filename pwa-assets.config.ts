import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// Accent color, behind the maskable and Apple icons.
const background = '#14695B'

// Generates the PWA icons in /public from public/favicon.svg.
// Run `npm run generate-pwa-assets` after changing the logo.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { background },
    },
  },
  images: ['public/favicon.svg'],
})
