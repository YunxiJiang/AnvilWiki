import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renameSitemapIndex } from '../scripts/rename-sitemap-index';

describe('renameSitemapIndex', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'sitemap-alias-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('renames sitemap-index.xml to sitemap.xml, preserving content', async () => {
    await writeFile(path.join(dir, 'sitemap-index.xml'), '<sitemapindex>index</sitemapindex>');
    await writeFile(path.join(dir, 'sitemap-0.xml'), '<urlset>urls</urlset>');

    const renamed = await renameSitemapIndex(pathToFileURL(dir));

    expect(renamed).toBe(true);
    await expect(readFile(path.join(dir, 'sitemap.xml'), 'utf8')).resolves.toBe(
      '<sitemapindex>index</sitemapindex>',
    );
    await expect(readFile(path.join(dir, 'sitemap-index.xml'), 'utf8')).rejects.toThrow();
    // Child chunk files are untouched.
    await expect(readFile(path.join(dir, 'sitemap-0.xml'), 'utf8')).resolves.toBe(
      '<urlset>urls</urlset>',
    );
  });

  it('accepts a plain directory path as well as a file URL', async () => {
    await writeFile(path.join(dir, 'sitemap-index.xml'), '<sitemapindex>x</sitemapindex>');

    expect(await renameSitemapIndex(dir)).toBe(true);
    await expect(readFile(path.join(dir, 'sitemap.xml'), 'utf8')).resolves.toBe(
      '<sitemapindex>x</sitemapindex>',
    );
  });

  it('returns false (no throw) when sitemap-index.xml is absent', async () => {
    await mkdir(dir, { recursive: true });

    expect(await renameSitemapIndex(pathToFileURL(dir))).toBe(false);
    await expect(readFile(path.join(dir, 'sitemap.xml'), 'utf8')).rejects.toThrow();
  });
});
