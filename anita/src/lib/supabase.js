import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://jiksraumbmuwmefrsjxt.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppa3NyYXVtYm11d21lZnJzanh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDUxNzgsImV4cCI6MjA5NDY4MTE3OH0.iKlRMhHfL-FdcW2wvseiISFf7Pxzg57RS9w6scZgLZI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
