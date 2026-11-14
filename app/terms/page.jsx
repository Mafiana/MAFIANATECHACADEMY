import Legal from "../../components/Legal";

export const metadata = {
  title: "Terms and Conditions | MAFIANA Tech Academy",
  description: "The rules for enrolling, paying and studying at MAFIANA Tech Academy.",
};

const sections = [
  ["Using this website", [
    "By using this website or creating a student account you agree to these terms. If you do not agree, please do not use the site. You must give correct information when you register and keep your password private. You are responsible for activity on your account.",
  ]],
  ["Enrollment and registration fee", [
    "Your seat is confirmed after you pay the registration fee of ₦5,000 and at least the first part of the course fee. The registration fee covers your academy ID card, learning materials and certificate.",
    "Course fees and class types (physical or online) are shown on the website and may change. The fee agreed at the time you enroll is the fee you pay for that course.",
  ]],
  ["Payments and installments", [
    "Most courses allow you to pay in installments. The balance must be paid by the date agreed with the admission office, usually before week 3. Digital Literacy + Internet Skills is paid in one payment. The academy may pause access to classes, the portal or your certificate while a balance is overdue.",
    "Offers such as early bird and bring-a-friend discounts apply only as described on the website at the time and cannot be combined unless we say so.",
  ]],
  ["Refunds and transfers", [
    "The registration fee is not refundable. If you cancel before your first class, tell us in writing and we will refund the course fee paid, less the registration fee. After classes begin, fees are not refundable, but we may allow you to move to a later class if you tell us in advance and a seat is available.",
  ]],
  ["Attendance and conduct", [
    "Students are expected to attend classes, respect instructors and other students, and use the computer lab and equipment with care. You are responsible for damage you cause. We may remove a student who behaves in a harmful or disruptive way, and no refund is due in that case.",
  ]],
  ["Certificates", [
    "A certificate is issued when you have completed the course, passed the final test and paid all fees. We may verify a certificate with employers or other organisations if they ask.",
  ]],
  ["Learning materials and ownership", [
    "Notes, videos, assignments and other materials are provided for your personal learning. Please do not copy, sell or share them without our written permission. You own the projects you create during your course.",
  ]],
  ["Student shop and corporate training", [
    "Items from the student shop are subject to availability and the price quoted at the time of order. Corporate training is agreed separately in writing with the company concerned.",
  ]],
  ["Limits of our responsibility", [
    "We work hard to teach well and keep the website running, but we cannot promise a particular job, income or exam result. The website and portal are provided as they are, and we are not responsible for interruptions caused by things outside our control such as power or internet failure. To the extent the law allows, our responsibility to you is limited to the fees you paid for the course concerned.",
  ]],
  ["Privacy", [
    "How we handle your personal information is explained in our Privacy Policy.",
  ]],
  ["Changes and governing law", [
    "We may update these terms from time to time, and the date at the top shows the latest version. These terms are governed by the laws of the Federal Republic of Nigeria.",
  ]],
];

export default function Terms() {
  return (
    <Legal
      title="Terms and Conditions"
      intro="Please read these terms before you enrol or use our website. They explain the rules for registration, payment and study at MAFIANA Tech Academy."
      sections={sections}
    />
  );
}
