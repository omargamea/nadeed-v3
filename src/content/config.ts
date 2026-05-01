// src/content/config.ts
// ════════════════════════════════════════
// تعريف مجموعات المحتوى لـ NADEED v3
// ════════════════════════════════════════

import { defineCollection, z } from 'astro:content';

// ── مقالات ──────────────────────────────
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    category: z.enum(['مقالات', 'فكر', 'نقد', 'أدب', 'ثقافة', 'نشر']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    featuredImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// ── إصدارات / كتب ───────────────────────
const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    category: z.enum(['رواية', 'قصة قصيرة', 'شعر', 'فكر', 'نقد', 'معرفة']),
    year: z.number(),
    coverImage: z.string().optional(),
    status: z.enum(['available', 'coming-soon', 'unavailable']).default('available'),
    isbn: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// ── مؤلفون ──────────────────────────────
const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// ── مجلة نضيد ───────────────────────────
const magazine = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    issueNumber: z.number(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, books, authors, magazine };
