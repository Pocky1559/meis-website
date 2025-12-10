import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://lkcsqeqzpteevlpazhqo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrY3NxZXF6cHRlZXZscGF6aHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjMyNTksImV4cCI6MjA4MDkzOTI1OX0.NqmuGydeXEV-VB5c9cVdNkymtg07Llt61VQ3pzFdARM";

export const supabase = createClient(supabaseUrl, supabaseKey);