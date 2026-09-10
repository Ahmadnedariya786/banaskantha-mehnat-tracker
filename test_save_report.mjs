import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if(line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/['"]/g, '');
  if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/['"]/g, '');
});

async function req(rpc, body) {
  const res = await fetch(url + '/rest/v1/rpc/' + rpc, {
    method: 'POST',
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function run() {
  // Use a known active team code - prompt admin first
  // Step 1: login to get a valid code
  const loginRes = await req('fn_login_code', { p_code: 'admin123' });
  console.log('Login check:', loginRes);

  const TEAM_CODE = 'MANE'; // replace if different

  const NEW_PAYLOAD = {
    halqa: 'ધાનેરા',
    report_date: '2026-09-10',
    total_students: 5, std10: 2, std11: 1, std12: 1, college: 1,
    engineer: 0, medical: 0, muslim_teachers: 0,
    activities: [], mashwara_text: '', special_notes: ''
  };

  console.log('\n--- TEST 1: NEW (ધાનેરા, 2026-09-10) ---');
  const r1 = await req('fn_save_report', { p_code: TEAM_CODE, p_payload: NEW_PAYLOAD });
  console.log('Status:', r1.status, '\nBody:', r1.body);

  console.log('\n--- TEST 2: EXISTING same (ધાનેરા, 2026-09-10) again ---');
  const r2 = await req('fn_save_report', { p_code: TEAM_CODE, p_payload: NEW_PAYLOAD });
  console.log('Status:', r2.status, '\nBody:', r2.body);
}
run();
