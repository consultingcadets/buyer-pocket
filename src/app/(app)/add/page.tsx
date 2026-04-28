import type { Metadata } from "next";
import { AddBuyerForm } from "./AddBuyerForm";

export const metadata: Metadata = {
  title: "Add Buyer — BuyerPocket",
};

export default function AddBuyerPage() {
  return <AddBuyerForm />;
}
