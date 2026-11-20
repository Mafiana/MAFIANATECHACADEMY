"use client";

import { useState } from "react";

export default function CourseAppClient() {
  const [ready, setReady] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: 700 }}>
      {!ready && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading course"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
            fontWeight: 700,
          }}
        >
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
          <p style={{ margin: 0 }}>Loading course…</p>
        </div>
      )}

      <iframe
        src="/portal/course-app/index.html"
        title="Interactive Computer Science Course"
        onLoad={() => setReady(true)}
        style={{
          width: "100%",
          height: "calc(100vh - 160px)",
          minHeight: 700,
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "#fff",
          opacity: ready ? 1 : 0,
          transition: "opacity .25s ease",
        }}
      />
    </div>
  );
}