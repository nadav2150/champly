import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/dashboard-layout.tsx", [
    index("routes/home.tsx"),
    route("stores", "routes/stores.tsx"),
    route("products", "routes/products.tsx"),
    route("tags", "routes/tags.tsx"),
  ]),
] satisfies RouteConfig;
