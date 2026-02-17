export const dynamic = 'force-dynamic' // Ensures it's always dynamic

import { articles } from '../../articles.js'
import { tags } from '../../tags.js'

function generateSiteMap(articles) {
  const toIso = (dateStr) => {
    if (!dateStr) return new Date().toISOString()

    if (dateStr.includes('T')) {
      const standard = dateStr.replace(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
        '$1-$2-$3T$4:$5:$6.$7Z'
      )
      const d = new Date(standard)
      if (!isNaN(d.getTime())) return d.toISOString()

      const d2 = new Date(dateStr)
      if (!isNaN(d2.getTime())) return d2.toISOString()

      return new Date().toISOString()
    }

    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) return d.toISOString()

    return new Date().toISOString()
  }

  const staticUrls = [
    { loc: 'https://alameer-hafalat.com', priority: 1.0 },
    { loc: 'https://alameer-hafalat.com/services', priority: 0.8 },
    { loc: 'https://alameer-hafalat.com/about', priority: 0.8 },
    { loc: 'https://alameer-hafalat.com/gallery', priority: 0.8 },
    { loc: 'https://alameer-hafalat.com/blog', priority: 0.8 },
    { loc: 'https://alameer-hafalat.com/contact', priority: 0.8 },
  ]

  const staticEntries = staticUrls
    .map(({ loc, priority }) => {
      return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>${priority.toFixed(2)}</priority>
        </url>`
    })
    .join('')

  const dynamicEntries = articles
    .map(({ slug, created_at }) => {
      return `
        <url>
          <loc>https://alameer-hafalat.com/articles/${slug}</loc>
          <lastmod>${toIso(created_at)}</lastmod>
          <priority>0.6</priority>
        </url>`
    })
    .join('')

  const tagEntries = tags
    .map(({ slug }) => {
      return `
        <url>
          <loc>https://alameer-hafalat.com/tags/${slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.7</priority>
        </url>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static URLs -->
      ${staticEntries}
      <!-- Dynamic URLs (Articles) -->
      ${dynamicEntries}
      <!-- Dynamic URLs (Tags) -->
      ${tagEntries}
    </urlset>`
}

export async function GET(request) {
  const sitemap = generateSiteMap(articles)

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
