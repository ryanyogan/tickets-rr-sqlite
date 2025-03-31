import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/tickets/tickets-layout.tsx", [
    route("tickets/:ticketId", "routes/tickets/ticket-page.tsx"),
    route("tickets/:ticketId/edit", "routes/tickets/ticket-edit.tsx"),
    route("tickets", "routes/tickets/tickets.tsx"),
  ]),
  layout("routes/account/account-layout.tsx", [
    ...prefix("account", [
      route("profile", "routes/account/profile.tsx"),
      route("password", "routes/account/password.tsx"),
    ]),
  ]),
  route("sign-up", "routes/auth/sign-up.tsx"),
  route("sign-in", "routes/auth/sign-in.tsx"),
  route("sign-out", "routes/auth/sign-out.ts"),
  route("tickets/:ticketId/status", "routes/tickets/ticket-status.ts"),
  route("tickets/:ticketId/delete", "routes/tickets/ticket-delete.ts"),
  ...prefix("actions", [route("theme", "routes/actions/theme.ts")]),
] satisfies RouteConfig;
