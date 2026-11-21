// ---- Ebooks ----
export const saveEbook = admin(async (s, fd) => {
  const title = String(fd.get("title") || "").trim().slice(0, 120);
  const author = String(fd.get("author") || "").trim().slice(0, 80);
  const description = String(fd.get("description") || "").trim().slice(0, 300);
  const cover_url = String(fd.get("cover_url") || "").trim();
  const file_url = String(fd.get("file_url") || "").trim();
  const category = String(fd.get("category") || "General").trim().slice(0, 40);
  const active = fd.get("active") === "1";
  const featured = fd.get("featured") === "1";
  const id = String(fd.get("id") || "");

  if (title.length < 2) return bad("Enter the ebook title.");
  if (!file_url || !/^https?:\/\//i.test(file_url)) return bad("Enter a valid download URL (starting with https://).");

  const row = { title, author, description, cover_url: cover_url || null, file_url, category, active, featured };
  const { error } = id
    ? await s.from("ebooks").update(row).eq("id", id)
    : await s.from("ebooks").insert(row);

  if (error) return dbErr(error);
  revalidatePath("/");
  return ok(id ? "Ebook saved." : "Ebook added.");
});

export const deleteEbook = admin(async (s, fd) => {
  const id = String(fd.get("id") || "");
  if (!/^\d+$/.test(id)) return bad("Ebook not found.");
  const { error } = await s.from("ebooks").delete().eq("id", id);
  if (error) return dbErr(error);
  revalidatePath("/");
  return ok("Ebook removed.");
});