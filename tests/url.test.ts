import { describe, it, expect } from 'vitest';
import {
  localizePath,
  listPath,
  detailPath,
  homeUrl,
  localeFromPath,
  withTrailingSlash,
} from '~/lib/url';

describe('url helpers', () => {
  describe('localizePath', () => {
    it('returns the path unchanged for the default locale (en)', () => {
      expect(localizePath('/bosses', 'en')).toBe('/bosses/');
      expect(localizePath('/bosses/gelum', 'en')).toBe('/bosses/gelum/');
    });

    it('prepends the locale prefix for non-default locales', () => {
      expect(localizePath('/bosses', 'ja')).toBe('/ja/bosses/');
      expect(localizePath('/bosses/gelum', 'ja')).toBe('/ja/bosses/gelum/');
    });

    it('ensures leading slash on input without one', () => {
      expect(localizePath('about', 'en')).toBe('/about/');
      expect(localizePath('about', 'ja')).toBe('/ja/about/');
    });

    it('appends a trailing slash (trailingSlash: always)', () => {
      expect(localizePath('/about', 'en')).toBe('/about/');
      expect(localizePath('/faq', 'ja')).toBe('/ja/faq/');
    });

    it('is idempotent — does not double the trailing slash', () => {
      expect(localizePath('/bosses/', 'en')).toBe('/bosses/');
      expect(localizePath('/bosses/', 'ja')).toBe('/ja/bosses/');
    });

    it('keeps the bare root as "/" for the default locale', () => {
      expect(localizePath('/', 'en')).toBe('/');
    });

    it('returns "/<locale>/" for the root of a non-default locale', () => {
      expect(localizePath('/', 'ja')).toBe('/ja/');
    });
  });

  describe('homeUrl', () => {
    it('returns / for default locale', () => {
      expect(homeUrl('en')).toBe('/');
    });
    it('returns /ja/ for non-default locale', () => {
      expect(homeUrl('ja')).toBe('/ja/');
    });
  });

  describe('listPath', () => {
    it('builds the correct list URL for each locale', () => {
      expect(listPath('bosses', 'en')).toBe('/bosses/');
      expect(listPath('bosses', 'ja')).toBe('/ja/bosses/');
      expect(listPath('codes', 'en')).toBe('/codes/');
    });
  });

  describe('detailPath', () => {
    it('builds the correct article URL for each locale', () => {
      expect(detailPath('bosses', 'gelum', 'en')).toBe('/bosses/gelum/');
      expect(detailPath('bosses', 'gelum', 'ja')).toBe('/ja/bosses/gelum/');
    });

    it('handles nested slugs', () => {
      expect(detailPath('guides', 'early-game/beginner', 'en')).toBe(
        '/guides/early-game/beginner/',
      );
      expect(detailPath('guides', 'early-game/beginner', 'ja')).toBe(
        '/ja/guides/early-game/beginner/',
      );
    });
  });

  describe('localeFromPath', () => {
    it('extracts the locale from a prefixed path', () => {
      expect(localeFromPath('/ja/bosses/gelum')).toBe('ja');
      expect(localeFromPath('/ja')).toBe('ja');
    });

    it('extracts the locale from paths with trailing slashes', () => {
      expect(localeFromPath('/ja/bosses/gelum/')).toBe('ja');
      expect(localeFromPath('/ja/')).toBe('ja');
    });

    it('returns the default locale when no prefix is present', () => {
      expect(localeFromPath('/bosses/gelum')).toBe('en');
      expect(localeFromPath('/')).toBe('en');
      expect(localeFromPath('')).toBe('en');
    });
  });

  describe('withTrailingSlash', () => {
    it('appends a slash to plain paths', () => {
      expect(withTrailingSlash('/about')).toBe('/about/');
      expect(withTrailingSlash('/guides/early-game/beginner')).toBe('/guides/early-game/beginner/');
    });

    it('keeps the bare root as "/"', () => {
      expect(withTrailingSlash('/')).toBe('/');
      expect(withTrailingSlash('')).toBe('/');
    });

    it('is idempotent', () => {
      expect(withTrailingSlash('/about/')).toBe('/about/');
    });
  });
});
