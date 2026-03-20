import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  route('login', 'routes/login.tsx'),
  route('register', 'routes/register.tsx'),
  route('auth/callback', 'routes/auth.callback.tsx'),
  route('logout', 'routes/logout.tsx'),

  route(':lang?', 'routes/dashboard-layout.tsx', [
    index('routes/home.tsx'),
    route('stores', 'routes/stores.tsx'),
    route('products', 'routes/products.tsx'),
    route('tags', 'routes/tags.tsx'),
  ]),
] satisfies RouteConfig;
