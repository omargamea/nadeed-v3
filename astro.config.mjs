// astro.config.mjs — NADEED v3
// نضيد — دار الأدب والفكر والمعرفة
//
// TODO: ضع الدومين الفعلي في متغير SITE_URL على Vercel
// أو استبدل القيمة الافتراضية هنا مباشرة.

import { defineConfig } from 'astro/config';

const SITE_URL = process.env.SITE_URL || 'https://nadeed.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
