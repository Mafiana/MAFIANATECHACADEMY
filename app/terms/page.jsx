import Legal from "../../components/Legal";

export const metadata = {
  title: "Terms and Conditions | MAF Tech Academy",
  description: "The rules for enrolling, paying and studying at MAF Tech Academy.",
};

const sections = [
  ["Using this website and your Access PIN", [
    "By using this website or signing in to your student account you agree to these terms. The academy issues you an Access PIN when you enroll. Keep it private and do not share it. You are responsible for everything done with your PIN. If you think someone else knows it, tell us and we will issue a new one.",
    "Your PIN works for the period shown on your plan. The academy may renew, replace or pause a PIN, for example when fees are overdue or the PIN has been shared. When a PIN ends or is paused you cannot sign in until it is renewed or restored.",
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
      intro="Please read these terms before you enrol or use our website. They explain the rules for registration, payment and study at MAF Tech Academy."
      sections={sections}
    />
  );
}
