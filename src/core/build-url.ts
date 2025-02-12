/**
 * @overview
 * @author AEPKILL
 * @created 2025-02-12 11:03:07
 */


export interface BuildURLOptions {
  route: string;
  params?: Record<string, string | number | boolean>;
  query?: Record<string, string | number | boolean>;
}

export function buildURL(options: BuildURLOptions): string {
  const { route, params = {}, query = {} } = options;
  
  let url = route;
  
  // 处理通配符 * 参数
  if (url.includes('*')) {
    const wildcardValue = params['*'];
    if (wildcardValue !== undefined) {
      url = url.replace('*', String(wildcardValue));
    }
  }

  // 从 URL 中提取所有参数名称
  const paramMatches = url.match(/:[a-zA-Z0-9_]+\??/g) || [];
  const paramNames = paramMatches.map(match => ({
    name: match.slice(1).replace('?', ''),
    optional: match.endsWith('?')
  }));

  // 根据提取的参数进行替换
  for (const { name, optional } of paramNames) {
    const value = params[name];
    
    if (value !== undefined) {
      url = url.replace(new RegExp(`:${name}\\??`, 'g'), String(value));
    } else if (optional) {
      // 如果是可选参数且值为 undefined，则移除整个可选段
      url = url.replace(new RegExp(`(/[^/]*)?:${name}\\?`, 'g'), '');
    }
  }

  // 处理查询参数
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    queryParams.append(key, String(value));
  }
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}