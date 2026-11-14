// Supabase returns at most 1000 rows per request. This reads every page so nothing is silently cut off.
// `build` must return a fresh query that is ordered (for stable paging), e.g. () => s.from("x").select("*").order("id")
export async function fetchAll(build, page = 1000) {
  const rows = [];
  for (let from = 0; ; from += page) {
    const { data, error } = await build().range(from, from + page - 1);
    if (error) return { data: rows, error };
    rows.push(...(data || []));
    if (!data || data.length < page) break;
  }
  return { data: rows, error: null };
}
