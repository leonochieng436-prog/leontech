const localSiteUrl = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const configured = configuredUrl ? new URL(configuredUrl) : null;
  const isLocalUrl = configured && ["localhost", "127.0.0.1", "::1"].includes(configured.hostname);

  if (configuredUrl && !isLocalUrl) return new URL(configuredUrl);

  const deploymentHost = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (deploymentHost) return new URL(`https://${deploymentHost}`);

  return new URL(configuredUrl || localSiteUrl);
}
