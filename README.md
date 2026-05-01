# نضيد — NADEED v3
## دار الأدب والفكر والمعرفة

موقع نضيد المؤسسي — مبني بـ Astro + Decap CMS + GitHub + Vercel

---

## ⚠️ قبل الإطلاق — قائمة TODO الإلزامية

### 1. إعداد GitHub
- [ ] أنشئ repository جديداً على GitHub
- [ ] ارفع محتوى هذا المشروع إليه
- [ ] تأكد أن الـ branch الرئيسي اسمه `main`

### 2. ضبط SITE_URL
في ملف `astro.config.mjs`، السطر:
```js
const SITE_URL = process.env.SITE_URL || 'https://nadeed-v3.vercel.app';
```
- [ ] استبدل `https://nadeed-v3.vercel.app` بدومين الموقع الفعلي بعد معرفته

### 3. ضبط Decap CMS
في ملف `public/admin/config.yml`:
```yaml
backend:
  repo: GITHUB_USERNAME/GITHUB_REPO_NAME   # ← استبدل هذا
  base_url: OAUTH_PROXY_URL                # ← استبدل هذا
```
- [ ] استبدل `GITHUB_USERNAME/GITHUB_REPO_NAME` باسم المستخدم/اسم المستودع
- [ ] أعدّ OAuth Proxy (انظر قسم Decap CMS أدناه)

### 4. استبدل المحتوى الافتتاحي
في المسارات التالية توجد محتويات مؤقتة يجب استبدالها:
- [ ] `src/content/articles/bayan-nadeed-alawwal.md` — المقال الافتتاحي
- [ ] `src/content/books/isdaar-awwal.md` — الإصدار الأول
- [ ] `src/content/authors/muallif-awwal.md` — المؤلف الأول
- [ ] `src/content/magazine/adad-awwal.md` — العدد الأول من المجلة

### 5. صورة OG الافتراضية
- [ ] أضف ملف `public/assets/og-default.png` (مقاس 1200×630) للمشاركة على وسائل التواصل

---

## 🚀 التشغيل المحلي

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
# الموقع على: http://localhost:4321

# بناء نسخة الإنتاج
npm run build

# معاينة نسخة الإنتاج
npm run preview
```

---

## 📁 هيكل المشروع

```
nadeed-v3/
├── public/
│   ├── admin/
│   │   ├── index.html          # لوحة تحكم Decap CMS
│   │   └── config.yml          # إعدادات Decap CMS
│   ├── uploads/                # الصور المرفوعة من لوحة التحكم
│   ├── assets/                 # ملفات ثابتة (صور OG، إلخ)
│   └── favicon.svg
│
├── src/
│   ├── content/
│   │   ├── config.ts           # مخططات Content Collections
│   │   ├── articles/           # ملفات المقالات (.md)
│   │   ├── books/              # ملفات الإصدارات (.md)
│   │   ├── authors/            # ملفات المؤلفين (.md)
│   │   └── magazine/           # ملفات أعداد المجلة (.md)
│   │
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.astro
│   │   ├── BookCard.astro
│   │   ├── AuthorCard.astro
│   │   ├── MagazineCard.astro
│   │   └── Seo.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   ├── BookLayout.astro
│   │   ├── AuthorLayout.astro
│   │   └── PageLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── shuroot.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── articles/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── books/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── authors/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── magazine/
│   │       ├── index.astro
│   │       └── [slug].astro
│   │
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🌐 النشر على Vercel

### الخطوات:
1. اذهب إلى [vercel.com](https://vercel.com) وسجّل الدخول بحساب GitHub
2. اضغط **Add New Project**
3. اختر الـ repository الخاص بنضيد
4. Vercel سيكتشف Astro تلقائياً، لكن تأكد:
   - **Framework Preset:** Astro
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. أضف متغيرات البيئة:
   ```
   SITE_URL = https://your-domain.com
   ```
6. اضغط **Deploy**
7. كل `git push` سيُطلق deploy تلقائياً

---

## 🔧 إعداد Decap CMS (GitHub Backend)

### المشكلة:
Decap CMS مع GitHub backend يحتاج OAuth proxy للعمل في بيئة الإنتاج.

### الحل الأبسط — استخدام `sveltia-cms-auth`:

1. انسخ هذا الـ repository:
   ```
   https://github.com/sveltia/sveltia-cms-auth
   ```
2. انشر نسخة منه على Vercel أو Cloudflare Workers (مجاناً)
3. استبدل في `config.yml`:
   ```yaml
   base_url: https://YOUR-AUTH-PROXY.vercel.app
   ```

### بديل — استخدام Netlify Identity (إن انتقلت لـ Netlify):
```yaml
backend:
  name: git-gateway
```
هذا لا يحتاج OAuth proxy لكنه يعمل على Netlify فقط.

### الوصول للوحة التحكم:
بعد الإعداد: `https://your-site.com/admin/`

---

## 🔍 Google Search Console

### الخطوات:
1. اذهب إلى [search.google.com/search-console](https://search.google.com/search-console)
2. أضف الموقع → اختر **URL Prefix**
3. أدخل رابط الموقع المنشور على Vercel
4. اختر طريقة التحقق: **HTML Tag**
5. ستحصل على كود مثل:
   ```html
   <meta name="google-site-verification" content="XXXX..." />
   ```
6. أضفه في `src/layouts/BaseLayout.astro` داخل `<head>` قبل `<Seo />`
7. ارجع لـ Search Console واضغط **Verify**
8. في قسم **Sitemaps** أضف: `sitemap-index.xml`
   - Astro ينشئ الـ sitemap تلقائياً عند البناء على المسار: `/sitemap-index.xml`
9. اطلب فهرسة الصفحات المهمة: الرئيسية، المقالات، الإصدارات

---

## 📝 إدارة المحتوى

### من لوحة Decap CMS:
- الوصول: `/admin/`
- يمكن إضافة مقالات، إصدارات، مؤلفين، أعداد مجلة
- كل إضافة تُحفظ كـ commit في GitHub وتُطلق deploy تلقائياً

### بدون لوحة التحكم (مباشرة):
- أضف ملف `.md` جديد في المجلد المناسب داخل `src/content/`
- التزم بالـ frontmatter المحدد في `src/content/config.ts`
- ادفع التغييرات إلى GitHub

### مثال مقال جديد:
```markdown
---
title: "عنوان المقال"
description: "وصف قصير"
author: "اسم الكاتب"
category: "مقالات"
publishedAt: 2025-06-01
draft: false
---

محتوى المقال هنا...
```

---

## 🎨 تخصيص التصميم

- الألوان والـ design tokens: `src/styles/global.css` (قسم `:root`)
- الخطوط: Google Fonts في `BaseLayout.astro`
- اللوجو: SVG مضمّن في `Header.astro`

---

## 📦 التبعيات

| الحزمة | الوظيفة |
|--------|---------|
| `astro` | الـ framework الأساسي |
| `@astrojs/sitemap` | توليد sitemap.xml تلقائياً |
| `@astrojs/vercel` | adapter للنشر على Vercel |

---

## 🔐 الأمان

- لا أسرار (secrets) في الكود
- OAuth credentials تبقى في الـ OAuth proxy فقط
- `/admin/` محمي بـ `noindex` header وـ Decap CMS authentication

---

## 📧 جهة الاتصال

نضيد — دار الأدب والفكر والمعرفة
nadeed.pub@outlook.com
