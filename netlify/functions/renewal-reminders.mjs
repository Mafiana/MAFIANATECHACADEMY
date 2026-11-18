// Only needed if the site is hosted on Netlify: runs the renewal reminders every day at 08:00 Lagos time (07:00 UTC).
// Set CRON_SECRET in Netlify's environment variables (the same value the site uses).
export default async () => {
  const site = process.env.URL || process.env.SITE_URL;
  if (!site || !process.env.CRON_SECRET) return new Response("Missing URL or CRON_SECRET", { status: 500 });
  const res = await fetch(site.replace(/\/$/, "") + "/api/cron/renewal-reminders", { headers: { Authorization: "Bearer " + process.env.CRON_SECRET } });
  return new Response(await res.text(), { status: res.status });
};

export const config = { schedule: "0 7 * * *" };
