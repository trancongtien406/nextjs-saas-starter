import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Create account — Orbit" };

export default function SignUp() {
  return <AuthForm mode="sign-up" />;
}
