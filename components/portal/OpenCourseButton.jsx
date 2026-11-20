"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenCourseButton({ href = "/portal/quizzes/course", label = "Open course" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const open = () => {
    if (loading) return;
    setLoading(true);
    router.push(href);
  };

  return (
    <>
      <button type="button" className="btn sm" onClick={open} disabled={loading} aria-busy={loading}>
        {loading ? (
          <>
            <span className="spin" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    transform: `rotate(${i * 30}deg) translate(146%)`,
                    animationDelay: `calc(var(--duration, 1.2s) / 12 * ${i - 12})`,
                  }}
                />
              ))}
            </span>
            Opening…
          </>
        ) : (
          label
        )}
      </button>

      {loading && (
        <div className="auth-loading" role="status" aria-live="polite" aria-label="Opening course">
          <span className="spin big" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i
                key={i}
                style={{
                  transform: `rotate(${i * 30}deg) translate(146%)`,
                  animationDelay: `calc(var(--duration, 1.2s) / 12 * ${i - 12})`,
                }}
              />
            ))}
          </span>
          <p>Opening course…</p>
        </div>
      )}
    </>
  );
}