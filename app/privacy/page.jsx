import Legal from "../../components/Legal";

export const metadata = {
  title: "Privacy Policy | MAFIANA Tech Academy",
  description: "How MAFIANA Tech Academy collects, uses and protects your personal information.",
};

const sections = [
  ["Information we collect", [
    "When you create an account we collect your full name and email address. When you enroll we also keep your course, class type (physical or online), the fees agreed, payments you make and your class attendance.",
    "If you contact us on WhatsApp we see your phone number and the messages you send. If you use Google sign-in we receive your name and email from Google. We do not collect your Google password.",
  ]],
  ["How we use your information", [
    "We use your information to create and run your student account, enroll you in courses, record payments and attendance, issue your ID card and certificate, answer your questions and send important notices about your classes.",
    "We do not sell your personal information and we do not use it for third-party advertising.",
  ]],
  ["Where your data is stored", [
    "Account and student records are stored with Supabase, our database and login provider. Data is protected by access rules so a student can only see their own records, and only academy staff can add or change fees, payments, attendance and certificates.",
    "Your information may be processed on servers outside Nigeria. We choose providers that apply reasonable security safeguards.",
  ]],
  ["Cookies", [
    "We use only the cookies needed to keep you signed in to the student portal. We do not use advertising cookies.",
  ]],
  ["Sharing your information", [
    "We share information only with service providers that help us run the academy (for example our hosting, database and login providers), when the law requires it, or when you ask us to, such as confirming your certificate to an employer.",
  ]],
  ["How long we keep it", [
    "We keep student records for as long as needed to run your course, to prove that a certificate was issued, and to meet our legal and accounting duties. You can ask us to delete your account when you no longer need it, except for records we must keep by law.",
  ]],
  ["Your rights", [
    "Under the Nigeria Data Protection Act 2023 you may ask to see the information we hold about you, correct it, object to how we use it, or ask us to delete it. Contact us using the details below and we will respond within a reasonable time.",
  ]],
  ["Children", [
    "Our courses are meant for people aged 16 and above. If you are under 18, please ask a parent or guardian to read this policy and to register with you.",
  ]],
  ["Changes to this policy", [
    "We may update this policy from time to time. The date at the top of the page shows when it last changed. If the changes are important we will tell students directly.",
  ]],
];

export default function Privacy() {
  return (
    <Legal
      title="Privacy Policy"
      intro="MAFIANA Tech Academy respects your privacy. This policy explains what personal information we collect, why we collect it and the choices you have."
      sections={sections}
    />
  );
}
