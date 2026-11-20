"use client";
import { useEffect } from "react";
import { createClient } from "../../lib/supabase/client";

/**
 * Drop this once inside PortalShell (or any portal layout).
 * It keeps the current user's presence row alive every 25 seconds.
 */
export default function PresenceHeartbeat({ name, role, page = "Portal" }) {
  useEffect(() => {
    const sb = createClient();
    let timer;

    async function beat() {
      try {
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return;
        await sb.from("presence").upsert({
          user_id: user.id,
          full_name: name || user.email?.split("@")[0] || "Student",
          role: role || "Student",
          page,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // table may not exist yet – silently ignore
      }
    }

    beat();
    timer = setInterval(beat, 25000);
    return () => clearInterval(timer);
  }, [name, role, page]);

  return null;
}
