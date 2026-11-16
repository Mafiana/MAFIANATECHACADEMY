import Shell from "../../components/Shell";
import VerifyForm from "../../components/VerifyForm";

export const metadata = {
  title: "Verify a certificate | MAF Tech Academy",
  description: "Check that a MAFIANA Tech Academy certificate is genuine.",
};

export default function VerifyPage() {
  return (
    <Shell>
      <section className="cat-hero" style={{ maxWidth: 640 }}>
        <p className="bl-eyebrow">Certificates</p>
        <h1>Verify a certificate</h1>
        <p className="sub">
          Enter the certificate number from the printed certificate (for example{" "}
          <code>MTA-00012</code>). We will confirm the student name, course and issue date.
        </p>
      </section>
      <VerifyForm />
    </Shell>
  );
}