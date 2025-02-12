import {
  useNavigate as _useNavigate,
  useLoaderData as _useLoaderData,
  Link as _Link,
} from 'react-router';

export type { RouteType } from './router-type';
export type { TypedRoute } from './types/typed-router';

export {
  pathParser,
  type RouterParam,
  type PathParserResult,
} from './core/path-parser';
export { pathToRoute } from './core/path-ro-route';
export { buildURL, type BuildURLOptions } from './core/build-url';
