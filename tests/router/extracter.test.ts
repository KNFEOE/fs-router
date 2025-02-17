import { describe, it, expect } from 'vitest';
import { RouteExtractor } from '../../src/router/extractor';
import * as path from 'node:path';

describe('RouteExtractor', () => {
  const fixturesDir = path.join(__dirname, '../fixtures/nested-routes');

  it('should scan nested routes correctly', async () => {
    const extractor = new RouteExtractor({
      routesDir: fixturesDir,
      alias: {
        name: '@',
        basename: 'tests/fixtures/'
      }
    });
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
                      "_component": "@/nested-routes/__auth/__shop/item/page",
                      "id": "__auth/__shop/item/page",
                      "type": "nested",
                      "path": "item"
                    }
                  ],
                  "isRoot": false,
                  "type": "nested",
                  "_component": "@/nested-routes/__auth/__shop/layout",
                  "id": "__auth/__shop/layout"
                },
                {
                  "_component": "@/nested-routes/__auth/login/page",
                  "id": "__auth/login/page",
                  "type": "nested",
                  "path": "login"
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "@/nested-routes/__auth/layout.config",
              "loader": "@/nested-routes/__auth/layout.loader",
              "_component": "@/nested-routes/__auth/layout",
              "id": "__auth/layout"
            },
            {
              "path": "user",
              "children": [
                {
                  "_component": "@/nested-routes/user/page",
                  "index": true,
                  "id": "user/page",
                  "type": "nested",
                  "loader": "@/nested-routes/user/page.loader",
                  "config": "@/nested-routes/user/page.config"
                },
                {
                  "_component": "@/nested-routes/user/$",
                  "path": "*",
                  "id": "user/$",
                  "type": "nested",
                  "clientData": "@/nested-routes/user/$.data.client",
                  "data": "@/nested-routes/user/$.data",
                  "config": "@/nested-routes/user/$.config.ts"
                },
                {
                  "_component": "@/nested-routes/user/[id]/page",
                  "id": "user/(id)/page",
                  "type": "nested",
                  "data": "@/nested-routes/user/[id]/page.data",
                  "path": ":id"
                },
                {
                  "path": "profile",
                  "children": [
                    {
                      "_component": "@/nested-routes/user/profile/page",
                      "index": true,
                      "id": "user/profile/page",
                      "type": "nested",
                      "loader": "@/nested-routes/user/profile/page.loader"
                    }
                  ],
                  "isRoot": false,
                  "type": "nested",
                  "_component": "@/nested-routes/user/profile/layout",
                  "id": "user/profile/layout"
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "@/nested-routes/user/layout.config",
              "loader": "@/nested-routes/user/layout.loader",
              "_component": "@/nested-routes/user/layout",
              "id": "user/layout"
            },
            {
              "path": "user/profile/name",
              "children": [
                {
                  "_component": "@/nested-routes/user.profile.name/page",
                  "index": true,
                  "id": "user.profile.name/page",
                  "type": "nested",
                  "config": "@/nested-routes/user.profile.name/page.config"
                }
              ],
              "isRoot": false,
              "type": "nested",
              "config": "@/nested-routes/user.profile.name/layout.config",
              "_component": "@/nested-routes/user.profile.name/layout",
              "id": "user.profile.name/layout"
            }
          ],
          "isRoot": true,
          "type": "nested",
          "error": "@/nested-routes/error",
          "config": "@/nested-routes/layout.config",
          "clientData": "@/nested-routes/layout.data.client",
          "data": "@/nested-routes/layout.data",
          "loader": "@/nested-routes/layout.loader",
          "_component": "@/nested-routes/layout",
          "loading": "@/nested-routes/loading",
          "id": "layout"
        }
      ]
    );
  });

  it('should handle associated files correctly', async () => {
    const extractor = new RouteExtractor({
      routesDir: fixturesDir
    });
    const routes = await extractor.extract();

    expect(routes[0].config).toContain('layout.config');
    expect(routes[0].loader).toContain('layout.loader');
    expect(routes[0].data).toContain('layout.data');
    expect(routes[0].clientData).toContain('layout.data.client');
    expect(routes[0].error).toContain('error');
    expect(routes[0].loading).toContain('loading');
  });
});