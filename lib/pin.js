import { createHmac, randomBytes } from "node:crypto";

// An Access PIN looks like MAF-7K3Q-9X2B. Students type it exactly like that (dashes and spaces are optional).
// It has 8 random characters from a 31-letter alphabet (no 0, O, 1, I or L, so it is easy to read out): about 850 billion possibilities.
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generatePin() {
  return "MAF" + Array.from(randomBytes(8), (b) => CHARS[b % CHARS.length]).join("");
}
export const prettyPin = (c) => `${c.slice(0, 3)}-${c.slice(3, 7)}-${c.slice(7)}`;
export const canonicalPin = (input) => String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
export const validPinShape = (c) => /^MAF[A-HJ-NP-Z2-9]{8}$/.test(c);

// Supabase signs people in with an email and password. A student never sees an email: behind the scenes the PIN is the
// password and a hidden address made from the PIN is the email. The address is a keyed hash, so someone who copied the
// database could not work the PINs out from it. ACCESS_PIN_SECRET is the key. Keep it private, and never change it
// after students have PINs (every PIN would stop working).
export function pinEmail(canonical) {
  const secret = process.env.ACCESS_PIN_SECRET;
  if (!secret || secret.length < 16) throw new Error("ACCESS_PIN_SECRET is missing or shorter than 16 characters");
  const h = createHmac("sha256", secret).update(canonical).digest("hex").slice(0, 32);
  return `p${h}@${process.env.PIN_EMAIL_DOMAIN || "pin.mafiana.app"}`;
}
