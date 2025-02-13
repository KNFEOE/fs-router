import { describe, it, expect } from 'vitest';
import { RouteExtractor } from '../../src/router/extractor';
import * as path from 'path';

describe('RouteExtractor', () => {
  const fixturesDir = path.join(__dirname, '../fixtures/nested-routes');

  it('should scan nested routes correctly', async () => {
    const extractor = new RouteExtractor(fixturesDir);
    const routes = await extractor.extract();

    console.log(JSON.stringify(routes, null, 2));

    expect(routes).toEqual(
      [
        {
          "path": "/",
          "children": [
            {
              "children": [
                {
                  "children": [
                    {
                      "path": "item",
                      "_component": "__auth/__shop/item/page.tsx",
                      "loader": "",
                      "config": "",
                      "clientData": "",
                      "data": "",
                      "action": ""
                    }
                  ],
                  "isRoot": false,
                  "type": "nested",
                  "_component": "__auth/__shop/layout.tsx",
                  "id": "__auth/__shop"
                },
                {
                  "path": "login",
                  "_component": "__auth/login/page.tsx",
                  "loader": "",
                  "config": "",
                  "clientData": "",
                  "data": "",
                  "action": ""
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "__auth/layout.config.ts",
              "loader": "__auth/layout.loader.tsx",
              "_component": "__auth/layout.tsx",
              "id": "__auth"
            },
            {
              "path": "user",
              "children": [
                {
                  "path": "",
                  "_component": "user/page.tsx",
                  "loader": "",
                  "config": "",
                  "clientData": "",
                  "data": "",
                  "action": "",
                  "index": true
                },
                {
                  "path": ":id",
                  "_component": "user/[id]/page.tsx",
                  "loader": "",
                  "config": "",
                  "clientData": "",
                  "data": "",
                  "action": ""
                },
                {
                  "path": "profile",
                  "children": [
                    {
                      "path": "",
                      "_component": "user/profile/page.tsx",
                      "loader": "",
                      "config": "",
                      "clientData": "",
                      "data": "",
                      "action": "",
                      "index": true
                    }
                  ],
                  "isRoot": false,
                  "type": "nested",
                  "_component": "user/profile/layout.tsx",
                  "id": "user/profile"
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "user/layout.config.ts",
              "loader": "user/layout.loader.ts",
              "_component": "user/layout.tsx",
              "id": "user"
            },
            {
              "path": "user/profile/name",
              "children": [
                {
                  "path": "",
                  "_component": "user.profile.name/page.tsx",
                  "loader": "",
                  "config": "",
                  "clientData": "",
                  "data": "",
                  "action": "",
                  "index": true
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "user.profile.name/layout.config.ts",
              "_component": "user.profile.name/layout.tsx",
              "id": "user.profile"
            }
          ],
          "isRoot": true,
          "type": "nested",
          "error": "error.tsx",
          "config": "layout.config.ts",
          "clientData": "layout.data.client.ts",
          "data": "layout.data.ts",
          "loader": "layout.loader.ts",
          "_component": "layout.tsx",
          "loading": "loading.tsx",
          "id": ""
        }
      ]
    );
  });

  it('should handle associated files correctly', async () => {
    const extractor = new RouteExtractor(fixturesDir);
    const routes = await extractor.extract();

    expect(routes[0].config).toBe('layout.config.ts');
    expect(routes[0].loader).toBe('layout.loader.ts');
    expect(routes[0].data).toBe('layout.data.ts');
    expect(routes[0].clientData).toBe('layout.data.client.ts');
    expect(routes[0].error).toBe('error.tsx');
    expect(routes[0].loading).toBe('loading.tsx');
  });
});