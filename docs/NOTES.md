## Shared code between frontend and backend

```
/
├── apps/
│   ├── frontend/
│   └── backend/
├── config/
│   └── index.ts
├── lib/
│   ├── utils/
│   └── form-validation/
└── types/
    └── index.ts
```

- `config/`  =>  For all the project wide config values
- `lib/`
    - `utils/`  =>  Project wide shared utility functions
    - `form-validation/`  =>  Form validation logic. Syntax check, length validation etc.
- `types/`  =>  Shared types and enums
<br>

## Frontend architecture
A general idea of the frontend architecture, specific details will be mentioned the respective directory's `NOTES.md`

```
frontend/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── tailwind-components.css
│   └── styles.module.css/
├── hooks/
│   └── use-theme.tsx
├── contexts/
│   └── auth-context.tsx
├──types/
│   └── index.ts
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   ├── settings/
│   │   └── dashboard/
│   ├── globals.css
│   ├── providers.tsx
│   └── main.tsx
└── .env
```
- `components/`
    - `layout/`  =>  For layout components like Navbar, Footer, Panel layouts, Card layouts etc.
    - `ui/`  =>  For ui components like button, input, link etc.
    - `tailwind-components.css`  =>  Contains all the custom tailwind classes
    - `styles.module.css`  =>  Shared css file for all the components
- `hooks/`  =>  For custom made hooks
- `contexts/`  =>  All the contexts like auth, project-context etc.
- `types/`  =>  Types exclusive to the frontend
- `src/`
    - `pages/`  =>  Different application pages with file structure corresponding to their URL mapping (Following [Next.js Routing Conventions](https://nextjs.org/docs/app/building-your-application/routing))

<br>

## Backend architecture

```
backend/
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts
├── src/
│   ├── controllers/
│   ├── services/
│   ├── utils/
│   ├── middleware/
│   ├── routes/
│   ├── auth/
│   └── server.ts
└── .env
```

- `prisma/`  =>  Contains all the database schema
- `types/`  =>  Types exclusive to the backend
- `src/`
    - `controllers/`  =>  Handles incoming HTTP requests and delegates work to other background services if needed.
    - `middleware/`  =>  Middlewares for things like authentication, rate limiting, possibly caching search results and collecting data like page views, downloads count etc
    - `routes/`  =>  Registration of endpoints to their respective handlers
    - `auth/`  =>  Authentication logic such as signIn, signUp, sessionValidation and sessionCreation
    - `services/`  =>  All the logic for integration with external services such as Email sender, search service (Meilisearch), CDN etc.
    - `utils/`  =>  For all the common shared functions exclusive to the backend (shared utils will reside inside `@shared/lib/utils`)

<br>

- [BACKEND DOCS](backend/NOTES.md)
