import { supabase } from '../lib/supabaseClient';
import type { SavedReport } from '../store/appStore';

console.log('ENV', { 
  url: import.meta.env.VITE_SUPABASE_URL, 
  hasKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY), 
  keyLen: (import.meta.env.VITE_SUPABASE_ANON_KEY || '').length 
});

function mapDbToReport(row: any): SavedReport {
  return {
    id: row.id,
    halqa: row.halqa,
    date: row.report_date,
    stats: {
      total: row.total_students,
      std_10: row.std10,
      std_11: row.std11,
      std_12: row.std12,
      college: row.college,
      engineering: row.engineer,
      medical: row.medical,
      muslim_teachers: row.muslim_teachers,
    },
    activities: row.activities,
    mashwara: row.mashwara_text,
    notes: row.special_notes,
  };
}

function mapReportToDb(r: SavedReport): any {
  return {
    ...(r.id && r.id.length > 20 ? { id: r.id } : {}),
    halqa: r.halqa,
    report_date: r.date,
    total_students: r.stats?.total || 0,
    std10: r.stats?.std_10 || 0,
    std11: r.stats?.std_11 || 0,
    std12: r.stats?.std_12 || 0,
    college: r.stats?.college || 0,
    engineer: r.stats?.engineering || 0,
    medical: r.stats?.medical || 0,
    muslim_teachers: r.stats?.muslim_teachers || 0,
    activities: r.activities || [],
    mashwara_text: r.mashwara || '',
    special_notes: r.notes || '',
  };
}

export const supabaseService = {
  async listReports() {
    const { data, error } = await supabase.from('reports').select('*').order('report_date', { ascending: false });
    if (error) {
      console.error('listReports ERROR:', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      throw error;
    }
    return data.map(mapDbToReport);
  },
  async saveReport(r: SavedReport) {
    const dbRow = mapReportToDb(r);
    const { data, error } = await supabase.from('reports').upsert(dbRow).select().single();
    if (error) {
      console.error('saveReport ERROR:', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      throw error;
    }
    return mapDbToReport(data);
  },
  async updateReport(id: string, r: SavedReport) {
    const dbRow = mapReportToDb(r);
    const { data, error } = await supabase.from('reports').update(dbRow).eq('id', id).select().single();
    if (error) throw error;
    return mapDbToReport(data);
  },
  async deleteReport(id: string) {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      console.error('deleteReport ERROR:', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      throw error;
    }
  },
  async listHalqas() {
    const { data, error } = await supabase.from('halqas').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  async addHalqa(name: string) {
    const { data, error } = await supabase.from('halqas').insert({ name, is_custom: true }).select().single();
    if (error) throw error;
    return data;
  },
  async deleteHalqa(id: string) {
    const { error } = await supabase.from('halqas').delete().eq('id', id);
    if (error) throw error;
  },
  async getSetting(key: string) {
    const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).maybeSingle();
    if (error) throw error;
    return data?.value || null;
  },
  async setSetting(key: string, value: any) {
    const { error } = await supabase.from('app_settings').upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
};
