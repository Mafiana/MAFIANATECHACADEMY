// Turns a phone number as people type it into the international form WhatsApp needs (+2348012345678).
// Returns null when it does not look like a real number.
export function toWhatsAppNumber(raw, countryCode = process.env.DEFAULT_COUNTRY_CODE || "234") {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;
  const plus = s.startsWith("+");
  let d = s.replace(/\D/g, "");
  if (!d) return null;
  if (!plus && d.startsWith("00")) d = d.slice(2);               // 00234... -> 234...
  else if (!plus && d.startsWith("0")) d = countryCode + d.slice(1); // 0801... -> 234801...
  else if (!plus && !d.startsWith(countryCode) && d.length <= 10) d = countryCode + d; // 801... -> 234801...
  if (d.startsWith(countryCode + "0")) d = countryCode + d.slice(countryCode.length + 1); // +234 0801... -> 234801...
  if (d.length < 8 || d.length > 15) return null;
  return "+" + d;
}
