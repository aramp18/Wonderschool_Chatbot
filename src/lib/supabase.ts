import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neocuaunvufhxhbghbre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lb2N1YXVudnVmaHhoYmdoYnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Mjk4NzUsImV4cCI6MjA2MTEwNTg3NX0.HgXAUmPskq_sX7ptKO9dksoEeXj2IgUxQIEYoUT-qLA'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Query = {
  id: number
  timestamp: string
  category: string
  query: string
  input_method: 'text' | 'voice'
  response: string | null
  confidence_sc: number | null
  status: 'new' | 'processed' | 'needs_review' | 'completed'
  provider_id: string | null
} 