// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fdrczztsjsldrtcblyjy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcmN6enRzanNsZHJ0Y2JseWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTA5MDQsImV4cCI6MjA2MjA4NjkwNH0.kQrJUnMAsvK5eoP2AxNZ6uus_BCy2SeI0QCyHbziGG8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);