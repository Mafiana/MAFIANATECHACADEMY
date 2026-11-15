// A WhatsApp link with a ready-made message. Set NEXT_PUBLIC_WHATSAPP (country code, no +).
export const waHref = (text) => `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX"}?text=${encodeURIComponent(text)}`;
