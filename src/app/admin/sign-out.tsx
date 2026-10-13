"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export function SignOutButton() { return <button type="button" className="admin-logout" onClick={() => signOut({ redirectTo: "/" })}><LogOut size={14} /> Sign out</button>; }
