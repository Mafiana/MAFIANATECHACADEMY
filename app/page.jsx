import Academy from "../components/Academy";
import { getShopProducts } from "../lib/shopDb";

export const revalidate = 60; // shop changes made in the admin panel appear within a minute

export default async function Home() {
  const shop = await getShopProducts();
  return <Academy shop={shop} />;
}
