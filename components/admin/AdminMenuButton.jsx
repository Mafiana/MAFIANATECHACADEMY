"use client";

export default function AdminMenuButton() {
  return (
    <button
      type="button"
      className="admin-menu-btn"
      aria-label="Open admin menu"
      onClick={() => document.getElementById("admin-side")?.classList.add("open")}
    >
      ☰ Menu
    </button>
  );
}