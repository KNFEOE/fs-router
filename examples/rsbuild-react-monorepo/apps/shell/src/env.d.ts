/// <reference types="@rsbuild/core/types" />

import type { RouteObject } from "react-router-dom";

declare module "virtual:generated-routes" {
  export const routes: RouteObject[];

  export type RouteParams = {
    "/user/[id]": { id: string };
    "/post/[slug]": { slug: string };
  };

  export type Path = keyof RouteParams;
}
