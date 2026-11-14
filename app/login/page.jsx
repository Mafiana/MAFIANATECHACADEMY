import LoginForm from "./login-form";

export const metadata = { title: "Login | MAFIANA Tech Academy" };

export default function Login({ searchParams }) {
  const admin = searchParams?.next === "/admin";
  return <LoginForm admin={admin} />;
}
