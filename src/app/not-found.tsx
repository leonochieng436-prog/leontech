import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() { return <main className="page-shell not-found"><div className="container"><p className="eyebrow dark-eyebrow">404 · PAGE NOT FOUND</p><h1>Looks like this<br />isn’t the right path.</h1><p>The page may have moved or the address may be incorrect.</p><Link className="button button-lime" href="/"><ArrowLeft size={15} /> Back to home</Link></div></main>; }
