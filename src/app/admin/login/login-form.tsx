"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false, redirectTo: "/admin" });
    setPending(false);
    if (result?.error) setError("Email or password was not recognized.");
    else {
      router.push("/admin");
      router.refresh();
    }
  }
  return <form className="login-form" onSubmit={submit}><label className="field"><span>Email address</span><input type="email" name="email" required autoComplete="username" maxLength={254} /></label><label className="field"><span>Password</span><input type="password" name="password" required autoComplete="current-password" maxLength={128} /></label>{error && <p className="form-message error" role="alert">{error}</p>}<button className="button button-lime form-button" disabled={pending}>{pending ? "Signing in…" : "Sign in"} <ArrowRight size={15} /></button></form>;
}
