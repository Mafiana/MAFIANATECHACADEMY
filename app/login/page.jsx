import PinLogin from "./pin-login";
import AdminLogin from "./login-form";
import { waHref } from "../../lib/wa";

export const metadata = { title: "Login | MAF Tech Academy" };

// Students and instructors sign in with an Access PIN. The admin signs in with email and password at /admin.
export default function Login({ searchParams }) {
  if (searchParams?.next === "/admin") return <AdminLogin />;
  return <PinLogin notice={searchParams?.notice} whatsapp={waHref("Hello MAF Tech Academy, I need an Access PIN (or to renew mine).")} />;
}
