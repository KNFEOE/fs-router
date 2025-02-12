/**
 * @overview 解析 FileRouter 路径为 ReactRouter, Next 风格
 * @author AEPKILL
 * @created 2025-02-11 14:52:32
 * @example
 *
 *  !WARN: 不支持 Intercepting Routers 和 Parallel Routers，因为目前没用到，用到了再支持
 * 
 *  - 拓展了一种语法 [[id]] 这种表示可选
 *
 *  - app/blog/[slug]/page.js                         { slug: string }
 *  - app/shop/[...slug]/page.js                     { slug: string[] }
 *  - app/shop/[[...slug]]/page.js                  { slug?: string[] }
 *  - app/[categoryId]/[itemId]/page.js       { categoryId: string, itemId: string }
 *  - app/(shop)/account
 */

export type RouterParam = {
  name: string;
  optional?: boolean;
  catchAll?: boolean;
};

export type PathParserResult = {
  route: string;
  params: RouterParam[];
};

export function pathParser(path: string): PathParserResult {
  // 移除开头和结尾的斜杠
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  const pathSegments = normalizedPath.split('/');
  const params: RouterParam[] = [];
  
  // 过滤掉 (group) 分组并处理每个路径段
  const processedSegments = pathSegments
    .filter(segment => !segment.startsWith('(') && !segment.endsWith(')'))
    .map(segment => {
      // 处理可选参数 [[param]]
      const optionalMatch = segment.match(/^\[\[([.\w]+)\]\]$/);
      if (optionalMatch) {
        const name = optionalMatch[1];
        // 处理可选的 catch-all 参数
        if (name.startsWith('...')) {
          params.push({
            name: name.slice(3),
            optional: true,
            catchAll: true
          });
          return '*?';
        }
        params.push({
          name,
          optional: true
        });
        return `:${name}?`;
      }

      // 处理必需参数 [param]
      const requiredMatch = segment.match(/^\[([.\w]+)\]$/);
      if (requiredMatch) {
        const name = requiredMatch[1];
        // 处理必需的 catch-all 参数
        if (name.startsWith('...')) {
          params.push({
            name: name.slice(3),
            catchAll: true
          });
          return '*';
        }
        params.push({
          name
        });
        return `:${name}`;
      }

      return segment;
    });

  // 如果最后一个段是 'page'，则移除它
  if (processedSegments[processedSegments.length - 1] === 'page') {
    processedSegments.pop();
  }

  return {
    route: processedSegments.join('/'),
    params
  };
}
