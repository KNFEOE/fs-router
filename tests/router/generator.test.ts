import { describe, it, expect } from 'vitest';
import { RouteCodeGenerator } from '../../src/router/generator';
import { RouteNode } from '../../src/router/type';
import { RouteExtractor } from '../../src/router/extractor';
import * as path from 'path';

describe('RouteCodeGenerator', () => {
  const fixturesDir = path.join(__dirname, '../fixtures/nested-routes');

  it('should generate route code with default options', async () => {
    const extractor = new RouteExtractor(fixturesDir);
    const routes = await extractor.extract();
    const generator = new RouteCodeGenerator();
    const code = generator.generate(routes);

    console.log(code);

    expect(code).toContain(`import loadable from '@loadable/component';`);
    expect(code).toContain(`() => import(/* webpackChunkName: "user" */ 'user/layout.tsx')`);
    expect(code).toContain(`() => import(/* webpackChunkName: "user.profile" */ 'user.profile.name/layout.tsx')`);
    expect(code).toContain(`export const routes = [`);
  });

  it('should generate route code without code splitting', async () => {
    const extractor = new RouteExtractor(fixturesDir);
    const routes = await extractor.extract();
    const generator = new RouteCodeGenerator({ splitting: false });
    const code = generator.generate(routes);

    console.log(code);

    expect(code).toContain(`import Component_1 from '__auth/layout.tsx';`);
    expect(code).toContain(`import Component_2 from '__auth/__shop/layout.tsx';`);
    expect(code).toContain(`export const routes = [`);
  });

  it('should handle routes with loaders', () => {
    const routesWithLoader: RouteNode[] = [
      {
        id: 'home',
        path: '/',
        _component: './components/Home',
        loader: './loaders/homeLoader'
      }
    ];
    const generator = new RouteCodeGenerator();
    const code = generator.generate(routesWithLoader);

    console.log(code);

    expect(code).toContain(`import loader_0 from './loaders/homeLoader';`);
    expect(code).toContain(`loader: loader_0`);
  });

  it('should handle routes with loading/error', () => {
    const nestedRoutes: RouteNode[] = [
      {
        id: 'home',
        path: '/',
        _component: './components/Home',
        loading: "./loading.tsx",
        error: "./error.tsx",
        children: [
          {
            id: 'about',
            path: 'about',
            _component: './components/About'
          }
        ]
      }
    ];
    const generator = new RouteCodeGenerator();
    const code = generator.generate(nestedRoutes);

    console.log(code);

    expect(code).toContain(`children: [`);
    expect(code).toContain(`errorElement: loadable(() => import('./error.tsx'))`);
    expect(code).toContain(`fallback: loadable(() => import('./loading.tsx'))`);
  });
});