# Leon.Tech

Leon.Tech is a responsive marketing website and a small, database-backed business platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Included

- Responsive public pages for home, services and service details, solutions and solution details, portfolio and case studies, blog and articles, about, contact, FAQ, and draft legal pages.
- Database-backed service, portfolio, and blog reads when `DATABASE_URL` is configured. With no database configured, the site uses clearly identified local service/portfolio/blog demo content so the public site can be previewed.
- Contact form with server-side Zod validation, honeypot, PostgreSQL persistence, inquiry references, database-backed IP rate limiting, and optional Resend admin/client email notifications.
- Auth.js credentials sign-in, bcrypt password hashes, short-lived JWT sessions, an initial-admin bootstrap command, role checks on server pages/actions, and database-checked active status and role on protected requests.
- Admin overview, inquiry status management with an activity record, and service catalogue create/edit/publish/unpublish/archive/reorder management.
- Robots, sitemap, page metadata, security headers, accessible mobile navigation, and a health endpoint.
- Sample portfolio items are explicitly marked as concepts; no client names, testimonials, results, certifications, or business statistics are invented.
- SEO metadata and canonicals target relevant Kenyan search intent. Organization, website, service, and breadcrumb JSON-LD use verified site and contact information; preview concepts and draft legal pages are kept out of indexable results.

## SEO page targeting

| Page | Main search intent |
| --- | --- |
| Home | Web development company Kenya; software development company Kenya |
| Website development service | Website design and development Kenya; website developers Nairobi |
| E-commerce service | E-commerce website development Kenya; M-Pesa website integration |
| Custom software service | Custom software and web application development Kenya |
| Business systems services | POS, inventory, ERP/CRM, school and hotel management systems Kenya |
| Pricing | Website development cost Kenya; website packages and software project pricing |
| Industry solutions | Retail, hospitality, education, professional services, healthcare administration, logistics, and startup software |
| Contact | Web and software development enquiries in Kenya |

These phrases are candidate themes rather than measured search-volume claims. Page-specific metadata and service keyword mapping are maintained in `src/lib/seo.ts`. Do not create near-duplicate city pages or add keyword meta tags.

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

3. Generate Prisma Client, apply database migrations, and seed the editable starter service catalogue:

   ```bash
   npm run db:generate
   npm run db:deploy
   npm run db:seed
   ```

   `DATABASE_URL` must point to a database you control. To create a new migration during local development, use `npm run db:migrate -- --name <name>`; never use a destructive reset against production data.

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
| `npm run db:seed` | Idempotently create the starter editable service records |
| `npm run admin:bootstrap` | Create the first super-admin from environment values |

The seed script adds service catalogue entries only and does not overwrite existing records on repeat runs. It does not create fake client projects, testimonials, or outcome claims.

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

The services module adds structured problems solved, features, deliverables, technologies, benefits, use cases, FAQs, images, delivery estimates, SEO metadata, publication state, prices, pricing-plan links, and related published portfolio projects. Seeded variable-scope services use custom-quote pricing unless an administrator enters an amount or links an active pricing plan. Public service filters/search and service-specific inquiry links use the published database catalogue.

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
6. Verify the production HTTPS domain in Google Search Console using its recommended DNS or HTML method, then submit `https://<production-domain>/sitemap.xml`. Confirm the sitemap is processed and inspect important service URLs; request indexing only after their published content is complete. No Search Console ownership token is currently configured in this repository.

All submitted inquiries and application state are stored in PostgreSQL. The current implementation does not upload media, so it has no local-filesystem upload persistence or object-storage credentials. Add an S3-compatible storage provider before introducing admin image-upload controls.

## Email and WhatsApp setup

Verify a sending domain with Resend, then set the API key, sender, and notification recipient. The application sends plain-text and HTML versions to both configured recipients after the inquiry is committed. A provider failure never causes an already-saved inquiry to be reported as lost.

Set the WhatsApp business number in international digits-only format (for example, `2547...`). The site opens a WhatsApp URL with a URL-encoded project inquiry message; it cannot report delivery or read status.

## Security notes and current scope

- Credentials use bcrypt, Auth.js CSRF protections, database-backed login and inquiry rate-limit buckets, server-side Zod validation, and server-side role checks.
- Administrator permissions are re-read from PostgreSQL for protected operations, so deactivating an account or changing its role invalidates prior authorization.
- Service catalogue edits are restricted to administrator and super-administrator roles. Editors can still access the existing content-writing capabilities elsewhere but cannot manage services.
- This initial implementation has inquiry and service administration, but not user administration, testimonial editing, rich-text/media editing, CSV export, inquiry notes/assignment, or portfolio/blog CRUD screens. Portfolio and blog records can be read publicly from PostgreSQL when published, but the corresponding write interfaces are not yet implemented.
- Legal copy is draft content and must be reviewed for the business's actual practices and applicable law before launch.
- The initial CSP permits inline scripts/styles needed by the current Next.js application. Review and tighten it for the exact production deployment and any added integrations.
- Run `npm audit` and review dependency advisories as part of release management.
- Configure database backups and test restoration using your provider's documented procedures.
