/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-12 11:26:10
 */

import { describe, expect, it } from 'vitest';
import { buildURL } from '../src/core/build-url';

describe('buildURL', () => {
  it('should handle basic route without params', () => {
    expect(buildURL({ route: '/home' })).toBe('/home');
  });

  it('should handle required params', () => {
    expect(
      buildURL({
        route: '/user/:id',
        params: { id: 123 }
      })
    ).toBe('/user/123');

    expect(
      buildURL({
        route: '/:categoryId/:itemId',
        params: { categoryId: 'books', itemId: '456' }
      })
    ).toBe('/books/456');
  });

  it('should handle optional params', () => {
    expect(
      buildURL({
        route: '/user/:id?',
        params: { id: 123 }
      })
    ).toBe('/user/123');

    expect(
      buildURL({
        route: '/user/:id?',
        params: {}
      })
    ).toBe('/user');

    expect(
      buildURL({
        route: '/posts/:category?/:id?',
        params: { category: 'tech' }
      })
    ).toBe('/posts/tech');
  });

  it('should handle wildcard params', () => {
    expect(
      buildURL({
        route: '/shop/*',
        params: { '*': 'category/items' }
      })
    ).toBe('/shop/category/items');

    expect(
      buildURL({
        route: '/shop/*',
        params: {}
      })
    ).toBe('/shop/*');
  });

  it('should handle query params', () => {
    expect(
      buildURL({
        route: '/search',
        query: { q: 'test', page: 1 }
      })
    ).toBe('/search?q=test&page=1');
  });

  it('should handle both path and query params', () => {
    expect(
      buildURL({
        route: '/user/:id/posts/:postId?',
        params: { id: 123, postId: 456 },
        query: { sort: 'desc', filter: 'published' }
      })
    ).toBe('/user/123/posts/456?sort=desc&filter=published');

    expect(
      buildURL({
        route: '/user/:id/posts/:postId?',
        params: { id: 123 },
        query: { sort: 'desc' }
      })
    ).toBe('/user/123/posts?sort=desc');
  });

  it('should handle boolean and number values', () => {
    expect(
      buildURL({
        route: '/api/:version',
        params: { version: 2 },
        query: { enabled: true, count: 0 }
      })
    ).toBe('/api/2?enabled=true&count=0');
  });

  it('should handle multiple occurrences of the same param', () => {
    expect(
      buildURL({
        route: '/user/:id/posts/:id',
        params: { id: 123 }
      })
    ).toBe('/user/123/posts/123');
  });

  it('should handle no param match', () => {
    expect(
      buildURL({
        route: '/user/:id/posts/:no-match',
        params: { id: 123 }
      })
    ).toBe('/user/123/posts/:no-match');
  });
}); 