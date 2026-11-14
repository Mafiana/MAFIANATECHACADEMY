"use client";
import ActionForm from "./ActionForm";
import StudentSelect from "./StudentSelect";
import { recordPayment } from "../../app/admin/actions";

export default function PaymentForm({ students }) {
  return (
    <ActionForm action={recordPayment} label="Save payment" className="card form">
      <h3>Record a payment</h3>
      <StudentSelect students={students} />
      <label>Amount (₦)</label>
      <input name="amount" type="number" min="1" step="1" required inputMode="numeric" />
      <label>Note</label>
      <input name="note" list="pay-notes" placeholder="Registration, Seat fee, Balance..." maxLength={120} />
      <datalist id="pay-notes"><option value="Registration" /><option value="Seat fee" /><option value="Installment" /><option value="Balance" /><option value="Full payment" /></datalist>
      <div style={{ height: 14 }} />
    </ActionForm>
  );
}
