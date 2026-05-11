import { fetchProperties } from "./actions";
import { PropertiesList } from "./PropertiesList";

export const metadata = { title: "Properties — BuyerPocket" };

export default async function PropertiesPage() {
  const { properties } = await fetchProperties();
  return <PropertiesList initialProperties={properties} />;
}
