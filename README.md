# Leon.Tech

Leon.Tech is a responsive marketing website and a small, database-backed business platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Included

- Responsive public pages for home, services and service details, solutions and solution details, portfolio and case studies, blog and articles, about, contact, FAQ, and draft legal pages.
- Database-backed service, portfolio, and blog reads when `DATABASE_URL` is configured. With no database configured, the site uses clearly identified local service/portfolio/blog demo content so the public site can be previewed.
- Contact form with server-side Zod validation, honeypot, PostgreSQL persistence, inquiry references, database-backed IP rate limiting, and optional Resend admin/client email notifications.
- Auth.js credentials sign-in, bcrypt password hashes, short-lived JWT sessions, an initial-admin bootstrap command, role checks on server pages/actions, and database-checked active status and role on protected requests.
- Admin overview, inquiry status management with an activity record, and service create/activate/deactivate management.
- Robots, sitemap, page metadata, security headers, accessible mobile navigation, and a health endpoint.
- Sample portfolio items are explicitly marked as concepts; no client names, testimonials, results, certifications, or business statistics are invented.

## Requirements

- Node.js 20.9 or newer (the current environment was tested with Node 24).
- PostgreSQL 14 or newer (Neon or Supabase are suitable).
- npm.

## Local setup

1. Install packages:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`. Generate an auth secret with:

   ```bash
   openssl rand -base64 32
   ```

   For Windows PowerShell, generate one with:

   ```powershell
   [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

   $bytes = New-Object byte[] 32; $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); [Convert]::ToBase64String($bytes); $rng.Dispose()
   ```

3. Generate Prisma Client and create the initial database migration:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   npm run db:seed
   ```

   `DATABASE_URL` must point to a database you control. `db:migrate` is intended for local development; never use a destructive reset against production data.

4. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 16 characters in `.env.local`, then create the first super-admin:

   ```bash
   npm run admin:bootstrap
   ```

   The command refuses to overwrite an existing account. Remove the bootstrap values from any shared environment after setup; do not commit them.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The admin login is at `/admin/login`.

## Database commands

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate -- --name <name>` | Create and apply a local development migration |
| `npm run db:deploy` | Apply committed migrations in a deployment |
| `npm run db:seed` | Idempotently create the starter service records |
| `npm run admin:bootstrap` | Create the first super-admin from environment values |

The seed script adds service catalog entries only. It does not create fake client projects, testimonials, or outcome claims.

## Environment variables

See `.env.example` for the complete list.

### Required for the database-backed platform

- `DATABASE_URL` — PostgreSQL runtime URL. Use the pooled Neon URL for serverless runtime traffic.
- `AUTH_SECRET` — Auth.js secret, kept server-side.
- `AUTH_URL` — canonical deployment origin used by Auth.js.
- `NEXT_PUBLIC_APP_URL` — public origin for metadata and sitemap. Set this to the final HTTPS domain in production.

### Initial administrator, used only by the bootstrap command

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (minimum 16 characters; never hardcode in source or CI logs)

### Optional integrations

- `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL` — both administrator notification and client acknowledgement are sent when all three values are present. Email failures are logged safely and do not undo saved inquiries.
- `WHATSAPP_BUSINESS_NUMBER` — international format, digits only; enables the prefilled WhatsApp link.
- `CONTACT_EMAIL` — optional public contact email.

If email is not configured, the form still stores the inquiry and returns its reference. If the database itself is not configured, form submission is disabled with an explicit setup message and returns HTTP 503.

## Development and quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment (Vercel + PostgreSQL)

1. Create the PostgreSQL project and configure `DATABASE_URL`.
2. Configure `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_APP_URL`, and any optional email/WhatsApp variables in Vercel's server environment. Keep credentials unprefixed by `NEXT_PUBLIC_`.
3. Run migrations as a controlled deployment step with `npm run db:deploy`. Do not run `prisma migrate reset` against production.
4. Bootstrap the first administrator once from a trusted environment with database access and the `ADMIN_*` values set, then remove those values.
5. Build and deploy on Vercel. Verify `/api/health`, public routes, admin sign-in, and a test inquiry end-to-end.

All submitted inquiries and application state are stored in PostgreSQL. The current implementation does not upload media, so it has no local-filesystem upload persistence or object-storage credentials. Add an S3-compatible storage provider before introducing admin image-upload controls.

## Email and WhatsApp setup

Verify a sending domain with Resend, then set the API key, sender, and notification recipient. The application sends plain-text and HTML versions to both configured recipients after the inquiry is committed. A provider failure never causes an already-saved inquiry to be reported as lost.

Set the WhatsApp business number in international digits-only format (for example, `2547...`). The site opens a WhatsApp URL with a URL-encoded project inquiry message; it cannot report delivery or read status.

## Security notes and current scope

- Credentials use bcrypt, Auth.js CSRF protections, database-backed login and inquiry rate-limit buckets, server-side Zod validation, and server-side role checks.
- Administrator permissions are re-read from PostgreSQL for protected operations, so deactivating an account or changing its role invalidates prior authorization.
- This initial implementation has inquiry and service administration, but not user administration, testimonial editing, rich-text/media editing, CSV export, inquiry notes/assignment, or portfolio/blog CRUD screens. Portfolio and blog records can be read publicly from PostgreSQL when published, but the corresponding write interfaces are not yet implemented.
- Legal copy is draft content and must be reviewed for the business's actual practices and applicable law before launch.
- The initial CSP permits inline scripts/styles needed by the current Next.js application. Review and tighten it for the exact production deployment and any added integrations.
- Run `npm audit` and review dependency advisories as part of release management.
- Configure database backups and test restoration using your provider's documented procedures.
