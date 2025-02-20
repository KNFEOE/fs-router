
import loadable from '@loadable/component';
import RootLayout from '@/routes/layout';
import { loader as loader_0 } from '@/routes/layout.data';
import { loader as loader_1 } from '@/routes/page.data';
import { loader as loader_2 } from '@/routes/users/page.data';
import { loader as loader_3 } from '@/routes/users/[userId]/page.data';
import Loading_0 from '@/routes/users/loading';
import Loading_1 from '@/routes/users/[userId]/loading';
import Error_0 from '@/routes/users/error';
import Error_1 from '@/routes/users/[userId]/error';
const Component_0 = loadable(() => import(/* webpackChunkName: "page" */ '@/routes/page'));
const Component_1 = loadable(() => import(/* webpackChunkName: "about/layout" */ '@/routes/about/layout'));
const Component_2 = loadable(() => import(/* webpackChunkName: "about/page" */ '@/routes/about/page'));
const Component_3 = loadable(() => import(/* webpackChunkName: "users/layout" */ '@/routes/users/layout'), { fallback: <Loading_0 /> });
const Component_4 = loadable(() => import(/* webpackChunkName: "users/page" */ '@/routes/users/page'));
const Component_5 = loadable(() => import(/* webpackChunkName: "users/(userId)/layout" */ '@/routes/users/[userId]/layout'), { fallback: <Loading_1 /> });
const Component_6 = loadable(() => import(/* webpackChunkName: "users/(userId)/page" */ '@/routes/users/[userId]/page'));

export const routes = [
  {
      path: '/',
      loader: loader_0,
      element: <RootLayout />,
      children: [{
      index: true,
      loader: loader_1,
      element: <Component_0 />
    },{
      path: 'about',
      element: <Component_1 />,
      children: [{
      index: true,
      element: <Component_2 />
    }]
    },{
      path: 'users',
      errorElement: <Error_0 />,
      element: <Component_3 />,
      children: [{
      index: true,
      loader: loader_2,
      element: <Component_4 />
    },{
      path: ':userId',
      errorElement: <Error_1 />,
      element: <Component_5 />,
      children: [{
      index: true,
      loader: loader_3,
      element: <Component_6 />
    }]
    }]
    }]
    }
];