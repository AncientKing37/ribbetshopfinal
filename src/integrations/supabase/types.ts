export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart: {
        Row: {
          added_at: string
          id: string
          item_id: string
          item_image: string
          item_name: string
          price: number
          quantity: number
          user_id: string | null
        }
        Insert: {
          added_at?: string
          id?: string
          item_id: string
          item_image: string
          item_name: string
          price: number
          quantity?: number
          user_id?: string | null
        }
        Update: {
          added_at?: string
          id?: string
          item_id?: string
          item_image?: string
          item_name?: string
          price?: number
          quantity?: number
          user_id?: string | null
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount: number
          created_at: string
          credits: number
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          credits: number
          id?: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credits?: number
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      env_variables: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string;
          user_id: string;
          offer_id: string;
          item_name: string;
          item_image: string;
          price: number;
          quantity: number;
          epic_username: string;
          status: Database["public"]["Enums"]["order_status"] | null;
          error_message: string | null;
          processed_by: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          amount: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          offer_id: string;
          item_name: string;
          item_image: string;
          price: number;
          quantity?: number;
          epic_username: string;
          status?: Database["public"]["Enums"]["order_status"] | null;
          error_message?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          amount: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          offer_id?: string;
          item_name?: string;
          item_image?: string;
          price?: number;
          quantity?: number;
          epic_username?: string;
          status?: Database["public"]["Enums"]["order_status"] | null;
          error_message?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          amount?: number;
        };
        Relationships: [];
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          epic_username: string
          id: string
          image_url: string
          item_eid: string
          item_name: string
          order_id: string | null
          price: number
          purchased_at: string
          status: Database["public"]["Enums"]["order_status"] | null
          user_id: string | null
        }
        Insert: {
          epic_username: string
          id?: string
          image_url: string
          item_eid: string
          item_name: string
          order_id?: string | null
          price: number
          purchased_at?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          user_id?: string | null
        }
        Update: {
          epic_username?: string
          id?: string
          image_url?: string
          item_eid?: string
          item_name?: string
          order_id?: string | null
          price?: number
          purchased_at?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      itemshop_orders: {
        Row: {
          id: string;
          user_id: string;
          epic_username: string;
          item_id: number;
          offer_id: string;
          item_name: string;
          item_type: string;
          final_price: number;
          webhook_url: string;
          webhook_status: string | null;
          webhook_response: string | null;
          status: Database["public"]["Enums"]["order_status"] | null;
          error_message: string | null;
          processed_by: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          epic_username: string;
          item_id?: number;
          offer_id: string;
          item_name?: string;
          item_type?: string;
          final_price?: number;
          webhook_url: string;
          webhook_status?: string | null;
          webhook_response?: string | null;
          status?: Database["public"]["Enums"]["order_status"] | null;
          error_message?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          epic_username?: string;
          item_id?: number;
          offer_id?: string;
          item_name?: string;
          item_type?: string;
          final_price?: number;
          webhook_url?: string;
          webhook_status?: string | null;
          webhook_response?: string | null;
          status?: Database["public"]["Enums"]["order_status"] | null;
          error_message?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "itemshop_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ];
      },
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
    },
  },
} as const
