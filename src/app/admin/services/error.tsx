"use client";

export default function ServicesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="admin-shell"><div className="admin-container"><section className="services-admin-error" role="alert"><h1>Services could not be loaded</h1><p>Please try again. If the problem continues, check the database connection and migration status.</p><button type="button" className="button button-lime" onClick={reset}>Try again</button></section></div></main>;
}
