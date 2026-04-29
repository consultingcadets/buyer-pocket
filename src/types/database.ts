// Auto-generated shape matching `supabase gen types typescript`.
// Regenerate after schema changes:
//   npx supabase gen types typescript --project-id yeakewyqvpgrkqflsqej > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          mobile: string | null;
          agency_name: string | null;
          state: string | null;
          timezone: string | null;
          eligibility_type: "independent" | "agency_permitted" | "unconfirmed";
          eligibility_acknowledged_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          mobile?: string | null;
          agency_name?: string | null;
          state?: string | null;
          timezone?: string | null;
          eligibility_type?: "independent" | "agency_permitted" | "unconfirmed";
          eligibility_acknowledged_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          mobile?: string | null;
          agency_name?: string | null;
          state?: string | null;
          timezone?: string | null;
          eligibility_type?: "independent" | "agency_permitted" | "unconfirmed";
          eligibility_acknowledged_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      buyers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          preferred_contact_method: string | null;
          best_time_to_contact: string | null;
          contact_consent: string | null;
          preferred_suburbs: string[] | null;
          nearby_suburbs_acceptable: string | null;
          school_zone_required: string | null;
          budget_min: number | null;
          budget_max: number | null;
          finance_status: string | null;
          deposit_ready: string | null;
          property_type: string | null;
          house_type: string | null;
          bedrooms: string | null;
          bathrooms: string | null;
          car_spaces: string | null;
          condition_preference: string | null;
          land_size_min: number | null;
          land_size_max: number | null;
          building_size_min: number | null;
          block_preference: string | null;
          must_haves: string[] | null;
          other_must_haves: string | null;
          deal_breakers: string | null;
          buying_timeline: string | null;
          buyer_temperature: "hot" | "warm" | "cold" | null;
          buyer_type: string | null;
          lead_status: string | null;
          priority: string | null;
          lead_source: string | null;
          notes_summary: string | null;
          last_contacted_at: string | null;
          next_reminder_at: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
          searchable_text?: string | null;
          temperature_sort?: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          preferred_contact_method?: string | null;
          best_time_to_contact?: string | null;
          contact_consent?: string | null;
          preferred_suburbs?: string[] | null;
          nearby_suburbs_acceptable?: string | null;
          school_zone_required?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          finance_status?: string | null;
          deposit_ready?: string | null;
          property_type?: string | null;
          house_type?: string | null;
          bedrooms?: string | null;
          bathrooms?: string | null;
          car_spaces?: string | null;
          condition_preference?: string | null;
          land_size_min?: number | null;
          land_size_max?: number | null;
          building_size_min?: number | null;
          block_preference?: string | null;
          must_haves?: string[] | null;
          other_must_haves?: string | null;
          deal_breakers?: string | null;
          buying_timeline?: string | null;
          buyer_temperature?: "hot" | "warm" | "cold" | null;
          buyer_type?: string | null;
          lead_status?: string | null;
          priority?: string | null;
          lead_source?: string | null;
          notes_summary?: string | null;
          last_contacted_at?: string | null;
          next_reminder_at?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["buyers"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "buyers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          buyer_id: string;
          contact_type: string | null;
          note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          buyer_id: string;
          contact_type?: string | null;
          note: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notes_buyer_id_fkey";
            columns: ["buyer_id"];
            referencedRelation: "buyers";
            referencedColumns: ["id"];
          }
        ];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          buyer_id: string;
          reminder_type: string | null;
          reminder_note: string | null;
          reminder_at: string;
          timezone: string | null;
          priority: string | null;
          status: "pending" | "processing" | "sent" | "completed" | "snoozed" | "cancelled";
          sent_at: string | null;
          completed_at: string | null;
          snoozed_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          buyer_id: string;
          reminder_type?: string | null;
          reminder_note?: string | null;
          reminder_at: string;
          timezone?: string | null;
          priority?: string | null;
          status?: "pending" | "processing" | "sent" | "completed" | "snoozed" | "cancelled";
          sent_at?: string | null;
          completed_at?: string | null;
          snoozed_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reminders_buyer_id_fkey";
            columns: ["buyer_id"];
            referencedRelation: "buyers";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          buyer_id: string | null;
          reminder_id: string | null;
          title: string | null;
          message: string | null;
          channel: string | null;
          status: string | null;
          is_read: boolean;
          sent_at: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          buyer_id?: string | null;
          reminder_id?: string | null;
          title?: string | null;
          message?: string | null;
          channel?: string | null;
          status?: string | null;
          is_read?: boolean;
          sent_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_buyer_id_fkey";
            columns: ["buyer_id"];
            referencedRelation: "buyers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_reminder_id_fkey";
            columns: ["reminder_id"];
            referencedRelation: "reminders";
            referencedColumns: ["id"];
          }
        ];
      };
      push_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          device_type: string | null;
          browser: string | null;
          is_active: boolean;
          last_used_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          device_type?: string | null;
          browser?: string | null;
          is_active?: boolean;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["push_tokens"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_start: string | null;
          trial_end: string | null;
          cancel_at_period_end: boolean;
          cancel_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          cancel_at_period_end?: boolean;
          cancel_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      eligibility_type: "independent" | "agency_permitted" | "unconfirmed";
      buyer_temperature: "hot" | "warm" | "cold";
      reminder_status: "pending" | "processing" | "sent" | "completed" | "snoozed" | "cancelled";
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience row type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Buyer = Database["public"]["Tables"]["buyers"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type PushToken = Database["public"]["Tables"]["push_tokens"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

// Insert / Update aliases
export type BuyerInsert = Database["public"]["Tables"]["buyers"]["Insert"];
export type BuyerUpdate = Database["public"]["Tables"]["buyers"]["Update"];
export type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
export type ReminderInsert = Database["public"]["Tables"]["reminders"]["Insert"];
export type ReminderUpdate = Database["public"]["Tables"]["reminders"]["Update"];
