"use client";

/**
 * Printable / downloadable Student ID card.
 * Matches the MAF TECH ACADEMY design: photo left, fields right, QR bottom-right, teal footer.
 */
export default function IdCard({
  name = "Student",
  studentId = "",
  gender = "",
  program = "",
  issued = "",
  validUntil = "",
  photoUrl = "",
  verifyUrl = "",
}) {
  const qrSrc = verifyUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(verifyUrl)}`
    : "";

  return (
    <div className="idcard" role="img" aria-label={`Student ID card for ${name}`}>
      <div className="idcard-top">
        <div className="idcard-brand">
          <svg className="idcard-logo" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
            <defs>
              <linearGradient id="idg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0B5CAB" />
                <stop offset="100%" stopColor="#00A3E0" />
              </linearGradient>
            </defs>
            <path
              d="M24 4 L40 12 V24 C40 34 32 42 24 44 C16 42 8 34 8 24 V12 Z"
              fill="url(#idg)"
            />
            <path
              d="M16 28 V16 L24 24 L32 16 V28"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d="M18 12 H30" stroke="#F2B705" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="18" r="1.4" fill="#7FD3FF" />
            <circle cx="36" cy="20" r="1.4" fill="#7FD3FF" />
            <circle cx="14" cy="30" r="1.2" fill="#7FD3FF" />
            <circle cx="34" cy="32" r="1.2" fill="#7FD3FF" />
          </svg>
          <div>
            <div className="idcard-title">MAF TECH ACADEMY</div>
            <div className="idcard-ribbon">STUDENT ID CARD</div>
          </div>
        </div>
      </div>

      <div className="idcard-body">
        <div className="idcard-photo">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} />
          ) : (
            <div className="idcard-photo-ph" aria-hidden="true">
              {(name || "S").trim().charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="idcard-fields">
          <div className="idcard-row">
            <span>STUDENT NAME:</span>
            <b>{name}</b>
          </div>
          <div className="idcard-row">
            <span>STUDENT ID:</span>
            <b>{studentId || "—"}</b>
          </div>
          <div className="idcard-row">
            <span>GENDER:</span>
            <b>{gender || "—"}</b>
          </div>
          <div className="idcard-row">
            <span>PROGRAM:</span>
            <b>{program || "—"}</b>
          </div>
          <div className="idcard-row">
            <span>ISSUED:</span>
            <b>{issued || "—"}</b>
          </div>
          <div className="idcard-row">
            <span>VALID UNTIL:</span>
            <b>{validUntil || "—"}</b>
          </div>
        </div>
      </div>

      <div className="idcard-bottom">
        <div className="idcard-sig">
          <span className="idcard-sig-name">{name}</span>
          <span className="idcard-sig-line" />
        </div>
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="idcard-qr" src={qrSrc} alt="Verification QR code" width={72} height={72} />
        ) : (
          <div className="idcard-qr idcard-qr-ph" />
        )}
      </div>

      <p className="idcard-note">
        This card is a property of MAF TECH ACADEMY · if found scan the barcode
      </p>
      <div className="idcard-foot">Learn · Practice · Grow</div>
    </div>
  );
}

/** Build display Student ID: SY{YY}-ST-{number} (never uses MAF prefix). */
export function formatStudentId(code, when) {
  const digits = String(code || "").replace(/\D/g, "");
  const num = (digits || "0000").slice(-4).padStart(4, "0");
  let yy = "";
  if (when) {
    const d = new Date(when);
    if (!Number.isNaN(d.getTime())) yy = String(d.getFullYear()).slice(-2);
  }
  if (!yy) yy = String(new Date().getFullYear()).slice(-2);
  return `SY${yy}-ST-${num}`;
}

/** Format MM / YYYY from a date-like value. */
export function formatCardDate(value) {
  if (!value) return "";
  const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
  if (Number.isNaN(d.getTime())) return String(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm} / ${yyyy}`;
}
