import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqfwmdttxhurstfledfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZndtZHR0eGh1cnN0ZmxlZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNzg0OTAsImV4cCI6MjA5MTY1NDQ5MH0.YLbi9xk-BuRzamgrTPbICHaIiTHBVhcSX8i6BYYZFn8';

export const supabase = createClient(supabaseUrl, supabaseKey);
