import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      imported_files: {
        Row: {
          id: string;
          name: string;
          type: string;
          size: string;
          uri: string;
          date_imported: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          size: string;
          uri: string;
          date_imported: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          size?: string;
          uri?: string;
          date_imported?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
};