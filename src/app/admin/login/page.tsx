import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");
  return <main className="page-shell login-page"><div className="container login-wrap"><div className="login-panel"><p className="eyebrow dark-eyebrow">ADMINISTRATION</p><h1>Welcome back.</h1><p className="login-description">Sign in with your authorized Leon.Tech account.</p><LoginForm /></div></div></main>;
}
