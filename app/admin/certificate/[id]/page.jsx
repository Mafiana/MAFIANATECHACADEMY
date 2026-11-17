import CertificatePage from "../../../../components/CertificatePage";

export const metadata = { title: "Certificate | MAF Tech Academy" };

export default function Page({ params }) {
  return <CertificatePage id={params.id} back="/admin#certificates" backLabel="Back to admin" />;
}
