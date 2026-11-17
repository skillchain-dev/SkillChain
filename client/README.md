# SkillChain — Client

React + Vite + Tailwind frontend for SkillChain. This package owns the frontend foundation: site
navigation, authentication, role-based dashboard layouts, the reusable UI component library, and the
shared API/auth services every feature module builds on.

## Stack

- React 18 + React Router 7
- Tailwind CSS 3 (utility-first styling, brand tokens in `tailwind.config.js`)
- Axios (via `src/services/httpClient.js`)
- Vite (dev server + build)

No state-management library, UI kit, or chart library is included — components under `src/components/ui`
and `src/components/common` are the shared building blocks; use those instead of adding a new dependency.

## Getting started

```bash
cp .env.example .env      # set VITE_API_URL if the API isn't on localhost:5000
npm install
npm run dev                # http://localhost:5173
```

The dev server expects the backend (`../server`) running and reachable at `VITE_API_URL` (default
`http://localhost:5000/api`).

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  app/            entry point, providers, env config
  components/ui/      generic building blocks (Button, Input, Modal, Badge, Tabs, ...)
  components/common/  data-aware shared components (DataTable, PageHeader, StatCard, ...)
  constants/      roles, navigation config, status labels — single source of truth
  features/       one folder per domain (auth, jobs, applications, certificates, ...);
                   each owns its own api.js and any feature-specific components
  hooks/          reusable hooks (debounce, media query, pagination, file upload)
  layouts/        DashboardLayout, PublicLayout, AuthLayout + their sub-components
  pages/          route-level screens, grouped by role/area (public, auth, student, recruiter, admin)
  routes/         route table, ProtectedRoute / RoleRoute guards, route path constants
  services/       httpClient (Axios instance + auth header), localStorage helpers, query cache
  styles/         Tailwind entry + the small amount of hand-written CSS some pages still use
  utils/          formatting and validation helpers
```

## Authentication & routing

- `features/auth` holds the auth context (`authStore.jsx` + `useAuth.js`), the login/register forms,
  and `api.js` for the three backend auth endpoints (`/auth/login`, `/auth/register`, `/auth/me`).
- The JWT is stored via `services/storage.js` under the `skillchain_token` key and attached to every
  request by `services/httpClient.js`. A 401 response clears the session automatically.
- `routes/ProtectedRoute.jsx` requires a signed-in user; `routes/RoleRoute.jsx` additionally restricts
  a route to one or more roles (`student`, `recruiter`, `admin`) and redirects everyone else to their
  own dashboard.
- Students self-register as **Student** or **Recruiter** only — Admin/Faculty accounts are provisioned
  separately (see `RegisterForm.jsx`), matching the backend's registration validator.

## Adding a new page

1. Add the page component under `pages/<role>/`. If it belongs inside the dashboard shell, wrap it with
   `<DashboardLayout role="...">...</DashboardLayout>` (see any existing student/recruiter page for the
   pattern).
2. Register the route in `routes/index.jsx`, wrapped in `<RoleRoute allow={[...]}>` if it needs auth.
3. Add a link to `constants/navigation.js` under the right role if it should appear in the sidebar.

## Team integration notes

This package is shared by all five members. To avoid collisions:

- Add feature-specific components/API calls inside your own `features/<your-feature>/` folder.
- Reuse `components/ui/*` and `components/common/*` rather than writing new buttons/inputs/tables.
- Reuse `services/httpClient.js` (default export for Axios-style calls, or the named `api()` helper for
  a fetch-style call) instead of creating a second Axios instance.
- A few pages under `features/` are still empty placeholders — they're intentionally scaffolded and
  wired into routing/navigation so you can drop your implementation straight in.
