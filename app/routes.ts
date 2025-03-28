import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tickets/:ticketId", "routes/tickets/ticket-page.tsx"),
  route("sign-up", "routes/auth/sign-up.tsx"),
  route("sign-in", "routes/auth/sign-in.tsx"),
] satisfies RouteConfig;
