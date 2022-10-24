import { createClient } from "@supabase/supabase-js";

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eGVoaG1lem9nZXh0cXNmYW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNjc0ODksImV4cCI6MTk4MTg0MzQ4OX0.jC-LDqv0apAmr8rG0ySmWtJp1m98F1KZ42pajd8g_Ds";
const url = "https://oyxehhmezogextqsfamr.supabase.co";

export const supabase = createClient(url, key)