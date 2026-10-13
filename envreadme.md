# Public origin used for metadata, canonical URLs, sitemap, and redirects.
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PostgreSQL connection URL. For Neon, use the pooled URL for runtime access.
DATABASE_URL="postgresql://postgres:ochibo@localhost:5432/lyontech?schema=public"    

# Required for Auth.js v5. Generate with: openssl rand -base64 32
AUTH_SECRET="aeSV2w6XMgRB9kEKcFoKbRMZBK6BLUulaB6OzQqMUUE="
AUTH_URL=http://localhost:3000

# Initial administrator provisioning. Use once via npm run admin:bootstrap.
ADMIN_NAME="LyonTech Admin"
ADMIN_EMAIL="admin@lyontech.com"
ADMIN_PASSWORD="mynameisleonochieng"

# Optional Resend email delivery. Inquiry persistence works without these values.
RESEND_API_KEY=
EMAIL_FROM=
ADMIN_NOTIFICATION_EMAIL=

# Optional WhatsApp business number in international format, digits only.
WHATSAPP_BUSINESS_NUMBER=

# Optional public contact email.
CONTACT_EMAIL=
