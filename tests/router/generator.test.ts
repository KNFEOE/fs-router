import { describe, it, expect } from "vitest";
import { RouteCodeGenerator } from "../../src/router/generator";
import type { RouteNode } from "../../src/router/type";
import { RouteExtractor } from "../../src/router/extractor";
import * as path from "node:path";

describe("RouteCodeGenerator", () => {
  const routesDir = path.join(__dirname, "../fixtures/nested-routes");

  it("should generate route code with default options & aliases", async () => {
    const extractor = new RouteExtractor({
      routesDir,
      alias: {
        name: "@",
        basename: "tests/fixtures/nested-routes",
      },
    });
    const routes = await extractor.extract();
    const generator = new RouteCodeGenerator();
    const code = generator.generate(routes);

    // console.log(code);

    expect(code).toContain(`import loadable from '@loadable/component';`);
    expect(code).toContain("export const routes = [");
    expect(code).toContain(
      `() => import(/* webpackChunkName: "user/layout" */ '@/user/layout')`,
    );
    expect(code).toContain(
      `() => import(/* webpackChunkName: "user.profile.name/page" */ '@/user.profile.name/page')`,
    );
  });

  it("should generate route code without code splitting", async () => {
    const extractor = new RouteExtractor({
      routesDir,
      alias: {
        name: "@",
        basename: "tests/fixtures/nested-routes",
      }
     });
    const routes = await extractor.extract();
    const generator = new RouteCodeGenerator({ splitting: false });
    const code = generator.generate(routes);

    // console.log(code);

    expect(code).toContain(`import Component_0 from '@/__auth/layout'`)
    expect(code).toContain(
      `import Component_1 from '@/__auth/__shop/layout';`,
    );
    expect(code).toContain("export const routes = [");
  });

  it("should handle routes with loaders", () => {
    const routesWithLoader: RouteNode[] = [
      {
        id: "home",
        path: "/",
        _component: "./components/Home",
        loader: "./loaders/homeLoader",
      },
    ];
    const generator = new RouteCodeGenerator();
    const code = generator.generate(routesWithLoader);

    // console.log(code);

    expect(code).toContain(`import loader_0 from './loaders/homeLoader';`);
    expect(code).toContain("loader: loader_0");
  });

  it("should handle routes with loading/error", () => {
    const nestedRoutes: RouteNode[] = [
      {
        id: "home",
        path: "/",
        _component: "./components/Home",
        loading: "./home/loading",
        error: "./home/error",
        children: [
          {
            id: "about",
            path: "about",
            _component: "./components/About",
            loading: "./about/loading",
            error: "./about/error",
          },
        ],
      },
    ];
    const generator = new RouteCodeGenerator();
    const code = generator.generate(nestedRoutes);

    // console.log(code);

    expect(code).toContain("children: [");
    expect(code).toContain(
      "errorElement: <Error_0 />",
    );
    expect(code).toContain("fallback: <Loading_1 />");
  });
});
