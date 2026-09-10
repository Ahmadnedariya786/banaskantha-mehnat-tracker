import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if(line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/['"']/g, '');
  if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/['"']/g, '');
});
async function run() {
  const req = async (rpc, body) => {
    const res = await fetch(url + '/rest/v1/rpc/' + rpc, {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.text();
  };
  
  // Create a temp admin code
  console.log('Set admin:', await req('fn_set_admin_code', { p_old: null, p_new: 'admin123' }));
  
  // Try to generate a code
  console.log('Generate:', await req('fn_generate_code', { p_admin: 'admin123', p_label: 'test code' }));
  
  // Try to list codes
  console.log('List codes:', await req('fn_list_codes', { p_admin: 'admin123' }));
}
run();
