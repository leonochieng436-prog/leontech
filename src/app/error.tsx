"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Unexpected application error", error.digest ?? ""); }, [error]);
  return <main className="page-shell not-found"><div className="container"><p className="eyebrow dark-eyebrow">SOMETHING WENT WRONG</p><h1>We couldn’t load<br />that just now.</h1><p>Please try again. If the problem continues, get in touch and we’ll help.</p><button className="button button-lime" onClick={reset}>Try again</button></div></main>;
}
