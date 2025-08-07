# 数据获取

`@feoe/fs-router` 中提供了开箱即用的数据获取能力，开发者可以通过这些 API，在项目中获取数据。帮助开发者更好地管理数据，提升项目的性能。

:::tip 兼容性
仅支持 React-Router v6+ 的 **DataRouter 数据路由模式**
:::

## 什么是 Data Loader

每个路由组件（`layout.ts`，`page.ts` 或 `$.tsx`）都可以有一个同名的 `.data` 文件。这些文件可以导出一个 `loader` 函数，我们称为 Data Loader，它会在对应的路由组件渲染之前执行，为组件提供数据。如下面示例：

```bash
.
└── routes
    ├── layout.tsx
    └── user
        ├── layout.tsx
        ├── layout.data.ts
        ├── page.tsx
        └── page.data.ts
```

在 `routes/user/page.data.ts` 文件中，可以导出一个 `loader` 函数：

```ts title="routes/user/page.data.ts"
export type ProfileData = {
  /*  some types */
};

export const loader = async (): Promise<ProfileData> => {
  const res = await fetch('https://api/user/profile');
  return await res.json();
};
```

:::warning 兼容性
- 在之前的版本中，Data Loader 是定义在 `.loader` 文件中的。当前版本中，我们推荐定义在 `.data` 文件中，同时我们会保持对 `.loader` 文件的兼容。
- 在 `.loader` 文件中，Data Loader 可以默认导出。但在 `data` 文件中，Data Loader 需要以 `loader` 具名导出。
```ts
  // xxx.loader.ts
export default () => {}

// xxx.data.ts
export const loader = () => {}
```
:::


在路由组件中，你可以通过 `useLoaderData` 函数获取数据：

```ts title="routes/user/page.tsx"
import { useLoaderData } from 'react-router-dom';
import type { ProfileData } from './page.data.ts';

export default function UserPage() {
  const profileData = useLoaderData() as ProfileData;
  return <div>{profileData}</div>;
}
```

:::caution
路由组件和 `.data` 文件共享类型，要使用 `import type` 语法，避免引入预期之外的副作用。
:::

在 CSR 项目中，`loader` 函数会在客户端执行，`loader` 函数内可以使用浏览器的 API（但通常不需要，也不推荐）。

当在浏览器端导航时，基于[约定式路由](/guide/basic/file-based-routing)，react-router 能够支持所有的 `loader` 函数并行执行（请求）。即当访问 `/user/profile` 时，`/user` 和 `/user/profile` 下的 `loader` 函数都会并行执行（请求），这种方式解决了**部分请求、渲染瀑布流的问题，较大的提升了页面性能**。

## `loader` 函数

`loader` 函数有两个入参，分别用于获取路由参数和请求信息。

### params

`params` 是当路由为[动态路由](/guide/basic-features/routes#动态路由)时的动态路由片段，会作为参数传入 `loader` 函数：

```tsx title="routes/user/[id]/page.data.ts"
import { LoaderFunctionArgs } from 'react-router-dom';

// 访问 /user/123 时，函数的参数为 `{ params: { id: '123' } }`
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const res = await fetch(`https://api/user/${id}`);
  return res.json();
};
```

### request

`request` 是一个 [Fetch Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 实例。一个常见的使用场景是通过 `request` 获取查询参数：

```tsx
import { LoaderFunctionArgs } from 'react-router-dom';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');
  return queryUser(userId);
};
```

### 返回值

`loader` 函数的返回值**只能是两种数据结构之一**，可序列化的数据对象或者 [Fetch Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 实例。

```tsx
const loader = async (): Promise<ProfileData> => {
  return {
    message: 'hello world',
  };
};
export default loader;
```

默认情况下，`loader` 返回的响应 `Content-type` 是 `application/json`，`status` 为 200，你可以通过自定义 `Response` 来设置：

```tsx
const loader = async (): Promise<ProfileData> => {
  const data = { message: 'hello world' };
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; utf-8',
    },
  });
};
```

## 错误处理

### 基本用法

在 `loader` 函数中，可以通过 `throw error` 或者 `throw response` 的方式处理错误，当 `loader` 函数中有错误被抛出时，react-router 会停止执行当前 `loader` 中的代码，并将前端 UI 切换到定义的 [`ErrorBoundary`](/guide/basic-features/routes#错误处理) 组件：

```tsx
// routes/user/profile/page.data.ts
export async function loader() {
  const res = await fetch('https://api/user/profile');
  if (!res.ok) {
    throw res;
  }
  return res.json();
}

// routes/user/profile/error.tsx
import { useRouteError } from 'react-router-dom';
const ErrorBoundary = () => {
  const error = useRouteError() as Response;
  return (
    <div>
      <h1>{error.status}</h1>
      <h2>{error.statusText}</h2>
    </div>
  );
};

export default ErrorBoundary;
```

### 修改 HTTP 状态码

在 SSR 项目中你可以通过在 `loader` 函数中 `throw response` 的方式，控制页面的状态码，展示对应的 UI。

如以下示例，页面的状态码将与这个 `response` 保持一致，页面也会展示为 `ErrorBoundary` 的 UI:

```ts
// routes/user/profile/page.data.ts
export async function loader() {
  const user = await fetchUser();
  if(!user){
    throw new Response('The user was not found', { status: 404 });
  }
  return user;
}

// routes/error.tsx
import { useRouteError } from 'react-router-dom';
const ErrorBoundary = () => {
  const error = useRouteError() as { data: string };
  return <div className="error">{error.data}</div>;
};

export default ErrorBoundary;
```

## 获取上层组件的数据

很多场景下，子组件需要获取到上层组件 `loader` 中的数据，你可以通过 `useRouteLoaderData` 方便地获取到上层组件的数据：

```tsx
// routes/user/profile/page.tsx
import { useRouteLoaderData } from 'react-router-dom';

export function UserLayout() {
  // 获取 routes/user/layout.data.ts 中 `loader` 返回的数据
  const data = useRouteLoaderData('user/layout');
  return (
    <div>
      <h1>{data.name}</h1>
      <h2>{data.age}</h2>
    </div>
  );
}
```

`userRouteLoaderData` 接受一个参数 `routeId`。在使用约定式路由时，react-router 会为你自动生成 `routeId`，`routeId` 的值是对应组件相对于 `src/routes` 的路径，如上面的例子中，子组件想要获取 `routes/user/layout.tsx` 中 loader 返回的数据，`routeId` 的值就是 `user/layout`。

在多入口场景下，`routeId` 的值需要加上对应入口的名称，入口名称非指定情况下一般是入口的目录名，如以下目录结构：

```bash
.
└── src
    ├── entry1
    │     └── routes
    │           └── layout.tsx
    └── entry2
          └── routes
                └── layout.tsx
```

如果想获取 `entry1/routes/layout.tsx` 中 `loader` 返回的数据，`routeId` 的值就是 `entry1_layout`。


## Loading UI

创建 `user/layout.data.ts`，并添加以下代码：

```ts title="routes/user/layout.data.ts"
import { defer } from 'react-router-dom';

export const loader = () =>
  defer({
    userInfo: new Promise(resolve => {
      setTimeout(() => {
        resolve({
          age: 1,
          name: 'user layout',
        });
      }, 1000);
    }),
  });
```

在 `user/loading.tsx` 中添加以下代码：

```tsx title="routes/user/loading.tsx"
import { useRouteLoaderData } from 'react-router-dom';

export default function UserLoading() {
  return (
    <LoadingSkeleton>Loading user profile</LoadingSkeleton>
  );
}
```


在 `user/error.tsx` 中添加以下代码：

```tsx title="routes/user/loading.tsx"
import { useRouteLoaderData } from 'react-router-dom';

export default function UserErrorBoundary() {
  const error = useRouteError()

  return <Error message={error.message}>;
}
```


### 渲染结果

`user/layout.tsx` 最终的渲染结果：

```tsx title="routes/user/layout.tsx"
import { Await, defer, useLoaderData, Outlet } from 'react-router-dom';

export default function UserLayout() {
  const { userInfo } = useLoaderData() as { userInfo: Promise<UserInfo> };

  return (
    <UserErrorBoundary>
      <Suspense fallback={<UserLoading />}>
        <Await
          resolve={userInfo}
          children={userInfo => (
            <div>
              <span>{userInfo.name}</span>
              <span>{userInfo.age}</span>
              <Outlet />
            </div>
          )}
        ></Await>
      </Suspense>
    </UserErrorBoundary>
  );
}
```

:::tip
`<Await>` 组件的具体用法请查看 [Await](https://reactrouter.com/en/main/components/await)，`defer` 的具体用法请查看 [defer](https://reactrouter.com/en/main/guide/deferred)。
:::

## 错误用法

1. `loader` 中只能返回可序列化的数据，不能返回不可序列化的数据（如函数）。

:::warning
虽然 CSR 下没有这个限制，但强烈推荐遵循该限制。不要引入额外的副作用，loader 应该只做 loader 该做的事情。

:::

```ts
// This won't work!
export default () => {
  return {
    user: {},
    method: () => {},
  };
};
```

2. react-router 会帮你调用 `loader` 函数，你不应该自己调用 `loader` 函数：

```ts
// This won't work!
export const loader = async () => {
  const res = fetch('https://api/user/profile');
  return res.json();
};

import { loader } from './page.data.ts';

export default function RouteComp() {
  const data = loader();
}
```

3. 不能从路由组件中引入 `loader` 文件，也不能从 `loader` 文件引入路由组件中的变量，如果需要共享类型的话，应该使用 `import type`

```ts
// Not allowed
// routes/layout.tsx
import { useLoaderData } from 'react-router-dom';
import { ProfileData } from './page.data.ts'; // should use "import type" instead

export const fetch = wrapFetch(fetch);

export default function UserPage() {
  const profileData = useLoaderData() as ProfileData;
  return <div>{profileData}</div>;
}

// routes/layout.data.ts
import { fetch } from './layout.tsx'; // should not be imported from the routing component
export type ProfileData = {
  /*  some types */
};

export const loader = async (): Promise<ProfileData> => {
  const res = await fetch('https://api/user/profile');
  return await res.json();
};
```
