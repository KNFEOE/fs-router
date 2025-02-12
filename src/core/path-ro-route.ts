/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-11 19:42:58
 *
 *  - app/blog/[slug]/page.js                         app/blog/:slug
 *  - app/shop/[...slug]/page.js                     app/blog/*
 *  - app/shop/[[...slug]]/page.js                  app/shop/*
 *  - app/[categoryId]/[itemId]/page.js       app/:categoryId/:itemId
 *  - app/(shop)/account                              app/account
 *  - app/user/[[id]]                                       app/user/:id?
 */

export function pathToRoute(path: string): string {
  // 移除 /page 后缀
  let route = path.replace(/\/page$/, '');

  // 移除 (group) 分组
  route = route.replace(/\([^)]+\)\//g, '');

  // 处理可选的 catch-all 参数 [[...param]]
  route = route.replace(/\[\[\.\.\.([^\]]+)\]\]/g, '*');

  // 处理必需的 catch-all 参数 [...param]
  route = route.replace(/\[\.\.\.([^\]]+)\]/g, '*');

  // 处理可选参数 [[param]]
  route = route.replace(/\[\[([^\]]+)\]\]/g, ':$1?');

  // 处理必需参数 [param]
  route = route.replace(/\[([^\]]+)\]/g, ':$1');

  return route;
}
