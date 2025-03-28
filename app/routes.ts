import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/tickets/tickets-layout.tsx", [
    route("tickets/:ticketId", "routes/tickets/ticket-page.tsx"),
    route("tickets", "routes/tickets/tickets.tsx"),
  ]),
  route("sign-up", "routes/auth/sign-up.tsx"),
  route("sign-in", "routes/auth/sign-in.tsx"),
  route("sign-out", "routes/auth/sign-out.ts"),
] satisfies RouteConfig;
