
import loadable from '@loadable/component';
import RootLayout from '@/routes/layout';
import { loader as loader_0 } from '@/routes/layout.data';
import { loader as loader_1 } from '@/routes/page.data';
import { loader as loader_2 } from '@/routes/admin_injector/$.data';
import { loader as loader_3 } from '@/routes/users/page.data';
import Loading_0 from '@/routes/users/loading';
import Loading_1 from '@/routes/users/[userId]/loading';
import Error_0 from '@/routes/error';
import Error_1 from '@/routes/admin_gateway/error';
import Error_2 from '@/routes/admin_injector/error';
const Component_0 = loadable(() => import(/* webpackChunkName: "page" */ '@/routes/page'), { suspense: true } as {});
const Component_1 = loadable(() => import(/* webpackChunkName: "$" */ '@/routes/$'), { suspense: true } as {});
const Component_2 = loadable(() => import(/* webpackChunkName: "admin_gateway/layout" */ '@/routes/admin_gateway/layout'), { suspense: true } as {});
const Component_3 = loadable(() => import(/* webpackChunkName: "admin_gateway/$" */ '@/routes/admin_gateway/$'), { suspense: true } as {});
const Component_4 = loadable(() => import(/* webpackChunkName: "admin_injector/layout" */ '@/routes/admin_injector/layout'), { suspense: true } as {});
const Component_5 = loadable(() => import(/* webpackChunkName: "admin_injector/$" */ '@/routes/admin_injector/$'), { suspense: true } as {});
const Component_6 = loadable(() => import(/* webpackChunkName: "users/layout" */ '@/routes/users/layout'), { fallback: <Loading_0 /> });
const Component_7 = loadable(() => import(/* webpackChunkName: "users/page" */ '@/routes/users/page'), { suspense: true } as {});
const Component_8 = loadable(() => import(/* webpackChunkName: "users/(userId)/layout" */ '@/routes/users/[userId]/layout'), { fallback: <Loading_1 /> });
const Component_9 = loadable(() => import(/* webpackChunkName: "users/(userId)/page" */ '@/routes/users/[userId]/page'), { suspense: true } as {});

export const routes = [
  {
      path: '/',
      errorElement: <Error_0 />,
      loader: loader_0,
      element: <RootLayout />,
      children: [{
      index: true,
      loader: loader_1,
      element: <Component_0 />
    },{
      path: '*',
      element: <Component_1 />
    },{
      path: 'admin_gateway',
      errorElement: <Error_1 />,
      element: <Component_2 />,
      children: [{
      path: '*',
      element: <Component_3 />
    }]
    },{
      path: 'admin_injector',
      errorElement: <Error_2 />,
      element: <Component_4 />,
      children: [{
      path: '*',
      loader: loader_2,
      element: <Component_5 />
    }]
    },{
      path: 'users',
      element: <Component_6 />,
      children: [{
      index: true,
      loader: loader_3,
      element: <Component_7 />
    },{
      path: ':userId',
      element: <Component_8 />,
      children: [{
      index: true,
      element: <Component_9 />
    }]
    }]
    }]
    }
];