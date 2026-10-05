/**
 * rename-sitemap-index.ts
 *
 * @astrojs/sitemap hardcodes its index filename as `<filenameBase>-index.xml`
 * (i.e. `sitemap-index.xml`) — there is no config to emit it as `sitemap.xml`.
 * This module provides:
 *
 *   1. renameSitemapIndex() — pure fs helper: rename sitemap-index.xml →
 *      sitemap.xml inside a directory (child chunks like sitemap-0.xml stay).
 *   2. sitemapAlias()      — an Astro integration whose `astro:build:done`
 *      hook calls the helper. Register it AFTER the official sitemap()
 *      integration so the index file exists when this hook runs, and the
 *      rename happens no matter how the site is built.
 */

import { rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

/**
 * Rename `sitemap-index.xml` to `sitemap.xml` inside `dir`.
 * Returns true if renamed, false when the source file does not exist.
 * Child sitemap files (e.g. `sitemap-0.xml`) referenced by the index's
 * <loc> entries are left untouched.
 */
export async function renameSitemapIndex(dir: URL | string): Promise<boolean> {
  const dirPath = dir instanceof URL ? fileURLToPath(dir) : dir;
  try {
    await rename(path.join(dirPath, 'sitemap-index.xml'), path.join(dirPath, 'sitemap.xml'));
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw err;
  }
}

/** Astro integration: serve the sitemap index at /sitemap.xml. */
export function sitemapAlias(): AstroIntegration {
  return {
    name: 'anvilwiki:sitemap-alias',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (await renameSitemapIndex(dir)) {
          logger.info('sitemap-index.xml renamed to sitemap.xml');
        }
      },
    },
  };
}
