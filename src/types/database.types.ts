/**
 * Velvet Fashion — Supabase Database Types
 * Generated & mapped to the PostgreSQL migrations schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'superadmin' | 'admin' | 'staff' | 'manager';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'superadmin' | 'admin' | 'staff' | 'manager';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'superadmin' | 'admin' | 'staff' | 'manager';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name_en: string;
          name_bn: string;
          fee_bdt: number;
          free_above_bdt: number;
          eta_en: string;
          eta_bn: string;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name_en: string;
          name_bn: string;
          fee_bdt: number;
          free_above_bdt: number;
          eta_en: string;
          eta_bn: string;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_bn?: string;
          fee_bdt?: number;
          free_above_bdt?: number;
          eta_en?: string;
          eta_bn?: string;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name_en: string;
          name_bn: string;
          category: string;
          audience: 'women' | 'men' | 'kids' | 'unisex';
          description_en: string | null;
          description_bn: string | null;
          fabric: string;
          origin: string;
          badge: string | null;
          image_url: string;
          additional_images: string[];
          care_instructions_en: string | null;
          care_instructions_bn: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name_en: string;
          name_bn: string;
          category: string;
          audience: 'women' | 'men' | 'kids' | 'unisex';
          description_en?: string | null;
          description_bn?: string | null;
          fabric: string;
          origin?: string;
          badge?: string | null;
          image_url: string;
          additional_images?: string[];
          care_instructions_en?: string | null;
          care_instructions_bn?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_bn?: string;
          category?: string;
          audience?: 'women' | 'men' | 'kids' | 'unisex';
          description_en?: string | null;
          description_bn?: string | null;
          fabric?: string;
          origin?: string;
          badge?: string | null;
          image_url?: string;
          additional_images?: string[];
          care_instructions_en?: string | null;
          care_instructions_bn?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          size: string;
          color: string;
          color_code: string | null;
          price_bdt: number;
          cost_price_bdt: number;
          stock: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          product_id: string;
          sku?: string | null;
          size: string;
          color: string;
          color_code?: string | null;
          price_bdt: number;
          cost_price_bdt?: number;
          stock?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string | null;
          size?: string;
          color?: string;
          color_code?: string | null;
          price_bdt?: number;
          cost_price_bdt?: number;
          stock?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          lookup_token: string;
          idempotency_key: string | null;
          customer_name: string;
          customer_phone: string;
          customer_alt_phone: string | null;
          customer_email: string | null;
          zone_id: string;
          address: string;
          time_slot: string;
          payment_method: 'cod' | 'bkash' | 'nagad';
          payment_trx_id: string | null;
          payment_status: 'pending' | 'verified' | 'failed' | 'refunded';
          subtotal_bdt: number;
          delivery_fee_bdt: number;
          discount_bdt: number;
          total_bdt: number;
          status: 'new' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
          order_notes: string | null;
          client_ip: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          lookup_token?: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          zone_id: string;
          address: string;
          time_slot?: string;
          payment_method: 'cod' | 'bkash' | 'nagad';
          payment_trx_id?: string | null;
          payment_status?: 'pending' | 'verified' | 'failed' | 'refunded';
          subtotal_bdt: number;
          delivery_fee_bdt?: number;
          discount_bdt?: number;
          total_bdt: number;
          status?: 'new' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
          order_notes?: string | null;
          client_ip?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          lookup_token?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          zone_id?: string;
          address?: string;
          time_slot?: string;
          payment_method?: 'cod' | 'bkash' | 'nagad';
          payment_trx_id?: string | null;
          payment_status?: 'pending' | 'verified' | 'failed' | 'refunded';
          subtotal_bdt?: number;
          delivery_fee_bdt?: number;
          discount_bdt?: number;
          total_bdt?: number;
          status?: 'new' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
          order_notes?: string | null;
          client_ip?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          product_name: string;
          size: string;
          color: string;
          quantity: number;
          unit_price_bdt: number;
          total_price_bdt: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id: string;
          product_name: string;
          size: string;
          color: string;
          quantity: number;
          unit_price_bdt: number;
          total_price_bdt: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          variant_id?: string;
          product_name?: string;
          size?: string;
          color?: string;
          quantity?: number;
          unit_price_bdt?: number;
          total_price_bdt?: number;
          created_at?: string;
        };
      };
      inventory_lots: {
        Row: {
          id: string;
          lot_number: string;
          variant_id: string;
          quantity_received: number;
          quantity_remaining: number;
          unit_cost_bdt: number;
          supplier_name: string;
          received_date: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lot_number: string;
          variant_id: string;
          quantity_received: number;
          quantity_remaining: number;
          unit_cost_bdt: number;
          supplier_name: string;
          received_date?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lot_number?: string;
          variant_id?: string;
          quantity_received?: number;
          quantity_remaining?: number;
          unit_cost_bdt?: number;
          supplier_name?: string;
          received_date?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          old_values: Json | null;
          new_values: Json | null;
          client_ip: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          old_values?: Json | null;
          new_values?: Json | null;
          client_ip?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          old_values?: Json | null;
          new_values?: Json | null;
          client_ip?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      create_order_secure: {
        Args: {
          p_customer_name: string;
          p_customer_phone: string;
          p_customer_email: string | null;
          p_zone_id: string;
          p_address: string;
          p_time_slot: string;
          p_payment_method: string;
          p_payment_trx_id: string | null;
          p_order_notes: string | null;
          p_items: Json;
          p_client_ip?: string | null;
          p_user_agent?: string | null;
        };
        Returns: {
          success: boolean;
          order_id: string;
          order_number: string;
          lookup_token: string;
          subtotal_bdt: number;
          delivery_fee_bdt: number;
          total_bdt: number;
          status: string;
        };
      };
      get_order_status_secure: {
        Args: {
          p_lookup_token: string;
          p_phone_last4?: string | null;
        };
        Returns: Json;
      };
      update_order_status_admin: {
        Args: {
          p_order_id: string;
          p_new_status: string;
          p_notes?: string | null;
        };
        Returns: Json;
      };
    };
  };
}

