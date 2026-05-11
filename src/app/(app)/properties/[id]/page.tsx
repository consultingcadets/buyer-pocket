import { notFound } from "next/navigation";
import { fetchProperty, matchBuyersForProperty } from "../actions";
import { PropertyDetail } from "./PropertyDetail";
import { BottomNav } from "@/components/BottomNav";

export const metadata = { title: "Property — BuyerPocket" };

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ property }, { buyers }] = await Promise.all([
    fetchProperty(id),
    matchBuyersForProperty(id),
  ]);
  if (!property) notFound();
  return (
    <>
      <PropertyDetail property={property} matchedBuyers={buyers ?? []} />
      <BottomNav />
    </>
  );
}
