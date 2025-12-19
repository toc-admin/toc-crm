export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          image_url: string | null
          product_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          image_url?: string | null
          product_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_name?: string | null
          image_url?: string | null
          product_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          slug: string
          emoji: string | null
          description: string | null
          hero_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          emoji?: string | null
          description?: string | null
          hero_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          emoji?: string | null
          description?: string | null
          hero_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          brand_id: string | null
          category_id: string | null
          subcategory: string | null
          short_description: string | null
          long_description: string | null
          sku: string | null
          is_new: boolean
          is_featured: boolean
          datasheet_url: string | null
          created_by: string | null
          updated_by: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          brand_id?: string | null
          category_id?: string | null
          subcategory?: string | null
          short_description?: string | null
          long_description?: string | null
          sku?: string | null
          is_new?: boolean
          is_featured?: boolean
          datasheet_url?: string | null
          created_by?: string | null
          updated_by?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          brand_id?: string | null
          category_id?: string | null
          subcategory?: string | null
          short_description?: string | null
          long_description?: string | null
          sku?: string | null
          is_new?: boolean
          is_featured?: boolean
          datasheet_url?: string | null
          created_by?: string | null
          updated_by?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          thumbnail_url: string | null
          medium_url: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          thumbnail_url?: string | null
          medium_url?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          thumbnail_url?: string | null
          medium_url?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      product_features: {
        Row: {
          id: string
          product_id: string
          feature_name: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          feature_name: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          feature_name?: string
          created_at?: string
        }
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          color_name: string
          hex_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          hex_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          color_name?: string
          hex_code?: string | null
          created_at?: string
        }
      }
      product_specifications: {
        Row: {
          id: string
          product_id: string
          spec_key: string
          spec_value: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          spec_key: string
          spec_value: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          spec_key?: string
          spec_value?: string
          created_at?: string
        }
      }
      product_certifications: {
        Row: {
          id: string
          product_id: string
          certification_name: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          certification_name: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          certification_name?: string
          created_at?: string
        }
      }
      product_rooms: {
        Row: {
          product_id: string
          room_id: string
          created_at: string
        }
        Insert: {
          product_id: string
          room_id: string
          created_at?: string
        }
        Update: {
          product_id?: string
          room_id?: string
          created_at?: string
        }
      }
      quote_requests: {
        Row: {
          id: string
          product_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_company: string | null
          quantity: number | null
          additional_requirements: string | null
          status: 'new' | 'contacted' | 'quoted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_company?: string | null
          quantity?: number | null
          additional_requirements?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          customer_company?: string | null
          quantity?: number | null
          additional_requirements?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types for easier usage
export type Brand = Database['public']['Tables']['brands']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductFeature = Database['public']['Tables']['product_features']['Row']
export type ProductColor = Database['public']['Tables']['product_colors']['Row']
export type ProductSpecification = Database['public']['Tables']['product_specifications']['Row']
export type ProductCertification = Database['public']['Tables']['product_certifications']['Row']
export type ProductRoom = Database['public']['Tables']['product_rooms']['Row']
export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row']

// Extended types with relations
export type ProductWithRelations = Product & {
  brand?: Brand | null
  category?: Category | null
  images?: ProductImage[]
  features?: ProductFeature[]
  colors?: ProductColor[]
  specifications?: ProductSpecification[]
  certifications?: ProductCertification[]
  rooms?: Room[]
}
