import { describe, it, expect } from 'vitest';
import { GET } from '~/pages/robots.txt';
import { siteUrl } from '~/config/site';

describe('robots.txt route', () => {
  it('points Sitemap at /sitemap.xml (not /sitemap-index.xml)', async () => {
    const get = GET as unknown as () => Promise<Response>;
    const res = await get();
    const text = await res.text();

    expect(res.headers.get('Content-Type')).toContain('text/plain');
    expect(text).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
    expect(text).not.toContain('sitemap-index');
  });
});
