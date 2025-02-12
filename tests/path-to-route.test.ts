/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-12 11:26:28
 */

import { describe, expect, it } from 'vitest';
import { pathToRoute } from '../src/core/path-ro-route';

describe('pathToRoute', () => {
  it('should handle simple routes', () => {
    expect(pathToRoute('app/(shop)/account/page')).toBe('app/account');
  });

  it('should handle required parameters', () => {
    expect(pathToRoute('app/blog/[slug]/page')).toBe('app/blog/:slug');
  });

  it('should handle optional parameters', () => {
    expect(pathToRoute('app/user/[[id]]/page')).toBe('app/user/:id?');
  });

  it('should handle catch-all routes', () => {
    expect(pathToRoute('app/shop/[...slug]/page')).toBe('app/shop/*');
  });

  it('should handle optional catch-all routes', () => {
    expect(pathToRoute('app/shop/[[...slug]]/page')).toBe('app/shop/*');
  });

  it('should handle multiple parameters', () => {
    expect(pathToRoute('app/[categoryId]/[itemId]/page')).toBe(
      'app/:categoryId/:itemId',
    );
  });

  it('should handle routes without page suffix', () => {
    expect(pathToRoute('app/[categoryId]/[itemId]')).toBe(
      'app/:categoryId/:itemId',
    );
  });

  it('should handle group routes', () => {
    expect(pathToRoute('app/(auth)/login/page')).toBe('app/login');
    expect(pathToRoute('(auth)/login/page')).toBe('login');
  });
});
