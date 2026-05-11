export type Property = {
  id: string;
  user_id: string;
  street_address: string;
  suburb: string;
  state: string;
  postcode: string | null;
  price: number;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  land_size: number | null;
  listing_url: string | null;
  notes: string | null;
  status: "active" | "sold" | "off_market";
  created_at: string;
  updated_at: string;
};

export type MatchedBuyer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  buyer_temperature: string | null;
  budget_min: number | null;
  budget_max: number | null;
  last_contacted_at: string | null;
  created_at: string;
  score: number;
  matchedCriteria: string[];
};
