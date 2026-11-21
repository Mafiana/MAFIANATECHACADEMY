import Academy from "../components/Academy";
import { getShopProducts } from "../lib/shopDb";
import { getEbooks } from "../lib/ebookDb";

export const revalidate = 60;

export default async function Home() {
  const [shop, ebooks] = await Promise.all([getShopProducts(), getEbooks()]);
  return <Academy shop={shop} ebooks={ebooks} />;
}
