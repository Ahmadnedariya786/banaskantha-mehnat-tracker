import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://azzopiddikntmblvkqxc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6em9waWRkaWtudG1ibHZrcXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTQ1NzYsImV4cCI6MjEwNDQ3MDU3Nn0.JR4BMv3LxL8IaGJ9ZsP82pEusmTCn0Z4UB23Aqg3LrQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('halqas').select('id, name, is_custom, created_at').order('created_at');
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}
run();
