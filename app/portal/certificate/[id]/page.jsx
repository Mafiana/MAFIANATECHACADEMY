import CertificatePage from "../../../../components/CertificatePage";

export const metadata = { title: "My certificate | MAFIANA Tech Academy" };

export default function Page({ params }) {
  return <CertificatePage id={params.id} back="/portal/courses" backLabel="Back to my courses" />;
}
