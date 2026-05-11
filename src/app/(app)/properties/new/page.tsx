import { AddPropertyForm } from "./AddPropertyForm";
import { BottomNav } from "@/components/BottomNav";

export const metadata = { title: "Add Property — BuyerPocket" };

export default function AddPropertyPage() {
  return (
    <>
      <AddPropertyForm />
      <BottomNav />
    </>
  );
}
