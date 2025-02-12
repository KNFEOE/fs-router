/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-12 11:26:18
 */

import { expect, it } from 'vitest';
import { type PathParserResult, pathParser } from '../src/core/path-parser';

const PathExamples = [
  {
    path: 'app/blog/[slug]/page',
    expect: {
      route: 'app/blog/:slug',
      params: [
        {
          name: 'slug',
        },
      ],
    },
  },
  {
    path: 'app/blog/[[slug]]/page',
    expect: {
      route: 'app/blog/:slug?',
      params: [
        {
          name: 'slug',
          optional: true,
        },
      ],
    },
  },
  {
    path: 'app/shop/[...slug]/page',
    expect: {
      route: 'app/shop/*',
      params: [
        {
          name: 'slug',
          catchAll: true,
        },
      ],
    },
  },
  {
    path: 'app/shop/[[...slug]]/page',
    expect: {
      route: 'app/shop/*?',
      params: [
        {
          name: 'slug',
          catchAll: true,
          optional: true,
        },
      ],
    },
  },
  {
    path: 'app/[categoryId]/[itemId]/page',
    expect: {
      route: 'app/:categoryId/:itemId',
      params: [
        {
          name: 'categoryId',
        },
        {
          name: 'itemId',
        },
      ],
    },
  },
  {
    path: 'app/(shop)/account/page',
    expect: {
      route: 'app/account',
      params: [],
    },
  },
] satisfies Array<{
  path: string;
  expect: PathParserResult;
}>;

for (const pathCase of PathExamples) {
  const result = pathParser(pathCase.path);
  it(`text path-parser of ${pathCase.path} should be ok`, () => {
    expect(result).toEqual(pathCase.expect);
  });
}
