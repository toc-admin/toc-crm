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
          name_hr: string | null
          description_hr: string | null
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
          name_hr?: string | null
          description_hr?: string | null
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
          name_hr?: string | null
          description_hr?: string | null
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
          name_hr: string | null
          description_hr: string | null
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
          name_hr?: string | null
          description_hr?: string | null
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
          name_hr?: string | null
          description_hr?: string | null
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
          short_description_hr: string | null
          long_description_hr: string | null
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
          short_description_hr?: string | null
          long_description_hr?: string | null
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
          short_description_hr?: string | null
          long_description_hr?: string | null
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
          feature_name_hr: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          feature_name: string
          feature_name_hr?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          feature_name?: string
          feature_name_hr?: string | null
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
      quotes: {
        Row: {
          id: string
          quote_number: string
          customer_name: string
          customer_email: string | null
          customer_phone: string | null
          customer_company: string | null
          customer_address: string | null
          subtotal: number
          discount_type: 'amount' | 'percentage' | null
          discount_value: number
          discount_amount: number
          vat_rate: number
          vat_amount: number
          total: number
          valid_until: string | null
          payment_terms: string | null
          notes: string | null
          pdf_url: string | null
          status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
          created_by: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          customer_name: string
          customer_email?: string | null
          customer_phone?: string | null
          customer_company?: string | null
          customer_address?: string | null
          subtotal: number
          discount_type?: 'amount' | 'percentage' | null
          discount_value?: number
          discount_amount?: number
          vat_rate?: number
          vat_amount: number
          total: number
          valid_until?: string | null
          payment_terms?: string | null
          notes?: string | null
          pdf_url?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
          created_by?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string | null
          customer_company?: string | null
          customer_address?: string | null
          subtotal?: number
          discount_type?: 'amount' | 'percentage' | null
          discount_value?: number
          discount_amount?: number
          vat_rate?: number
          vat_amount?: number
          total?: number
          valid_until?: string | null
          payment_terms?: string | null
          notes?: string | null
          pdf_url?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
          created_by?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          position_number: number
          name: string
          description: string | null
          quantity: number
          unit_price: number
          line_total: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          position_number: number
          name: string
          description?: string | null
          quantity?: number
          unit_price: number
          line_total: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          position_number?: number
          name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          line_total?: number
          image_url?: string | null
          created_at?: string
        }
      }
      article_categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          title_hr: string | null
          excerpt_hr: string | null
          content_hr: string | null
          cover_image_url: string | null
          cover_image_thumbnail_url: string | null
          category_id: string | null
          author_id: string | null
          status: 'draft' | 'published' | 'archived'
          meta_title: string | null
          meta_description: string | null
          meta_title_hr: string | null
          meta_description_hr: string | null
          published_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          title_hr?: string | null
          excerpt_hr?: string | null
          content_hr?: string | null
          cover_image_url?: string | null
          cover_image_thumbnail_url?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          meta_title_hr?: string | null
          meta_description_hr?: string | null
          published_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          title_hr?: string | null
          excerpt_hr?: string | null
          content_hr?: string | null
          cover_image_url?: string | null
          cover_image_thumbnail_url?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          meta_title_hr?: string | null
          meta_description_hr?: string | null
          published_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
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
export type Quote = Database['public']['Tables']['quotes']['Row']
export type QuoteItem = Database['public']['Tables']['quote_items']['Row']

// Extended types with relations
export type QuoteWithItems = Quote & {
  items?: QuoteItem[]
}
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

// Article types
export type ArticleCategory = Database['public']['Tables']['article_categories']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type ArticleTag = Database['public']['Tables']['article_tags']['Row']

export type ArticleWithRelations = Article & {
  category?: ArticleCategory | null
  tags?: Tag[]
}
