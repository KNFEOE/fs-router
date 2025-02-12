/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-11 17:40:26
 */
import path from 'node:path';
import { parseRouteFile } from '../src/core/route-file-parser';
import { expect, it } from 'vitest';

export const mockRouterFiles = [
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-1.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: false,
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-2.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: true,
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-3.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: true,
            },
            {
              name: 'page',
              optional: false,
              type: 'number',
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-4.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: false,
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-5.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: true,
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-6.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: true,
            },
            {
              name: 'page',
              optional: false,
              type: 'number',
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-7.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'id',
              type: 'number',
              optional: false,
            },
            {
              name: 'page',
              optional: false,
              type: 'number',
            },
          ],
        ],
      },
    },
  },
  {
    path: path.join(import.meta.dirname, 'router-file-demos/page-8.ts'),
    expect: {
      queryParams: {
        properties: [
          [
            {
              name: 'page',
              type: 'number',
              optional: false,
            }
          ],
          [
            {
              name: 'id',
              type: 'number',
              optional: false,
            }
          ]
        ],
      },
    },
  },
] as const;

for (const mockFile of mockRouterFiles) {
  const result = parseRouteFile(mockFile.path);
  it(`text path-parser of ${mockFile.path} should be ok`, () => {
    expect(result).toEqual(mockFile.expect);
  });
}
