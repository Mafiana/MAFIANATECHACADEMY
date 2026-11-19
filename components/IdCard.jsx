"use client";

/**
 * Printable / downloadable Student ID card.
 * Designed to match the official MAF TECH ACADEMY sample.
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
      {/* Top brand area */}
      <div className="idcard-top">
        <div className="idcard-brand">
          {/* Improved logo matching the sample (shield + graduation cap) */}
          <svg className="idcard-logo" viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
            <defs>
              <linearGradient id="idg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0B5CAB" />
                <stop offset="100%" stopColor="#00A3E0" />
              </linearGradient>
            </defs>
            {/* Shield */}
            <path
              d="M32 4 L52 14 V30 C52 44 40 54 32 58 C24 54 12 44 12 30 V14 Z"
              fill="url(#idg)"
            />
            {/* Graduation cap */}
            <path d="M20 22 L32 16 L44 22 L32 28 Z" fill="#fff" />
            <rect x="29" y="22" width="6" height="10" fill="#fff" />
            <path d="M44 22 L48 24 V30" stroke="#F2B705" strokeWidth="2" fill="none" />
            {/* Circuit dots */}
            <circle cx="18" cy="34" r="1.6" fill="#7FD3FF" />
            <circle cx="46" cy="36" r="1.6" fill="#7FD3FF" />
            <circle cx="22" cy="42" r="1.3" fill="#7FD3FF" />
            <circle cx="42" cy="44" r="1.3" fill="#7FD3FF" />
          </svg>

          <div>
            <div className="idcard-title">MAF TECH ACADEMY</div>
            <div className="idcard-ribbon">STUDENT ID CARD</div>
          </div>
        </div>
      </div>

      {/* Body: photo + fields */}
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

      {/* Signature + QR */}
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
