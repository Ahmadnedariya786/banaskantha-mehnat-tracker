import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseService } from '../services/supabaseService'

export interface SavedReport {
  id: string;
  halqa: string;
  date: string;
  stats: any;
  activities: any;
  mashwara: string;
  notes: string;
}

interface AppState {
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (val: boolean) => void
  draftReport: any | null
  setDraftReport: (draft: any) => void
  clearDraft: () => void
  
  // App data (Supabase)
  isLoading: boolean
  reports: SavedReport[]
  halqas: any[]
  
  loadData: () => Promise<void>
  addReport: (report: SavedReport) => Promise<void>
  updateReport: (id: string, report: SavedReport) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  addCustomHalqa: (halqaName: string) => Promise<void>
  removeCustomHalqa: (id: string) => Promise<void>
  
  // To keep backward compatibility for anything still expecting string array
  customHalqas: string[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      
      draftReport: null,
      setDraftReport: (draft) => set({ draftReport: draft }),
      clearDraft: () => set({ draftReport: null }),
      
      isLoading: true,
      reports: [],
      halqas: [],
      customHalqas: [],
      
      loadData: async () => {
        set({ isLoading: true })
        try {
          const [reports, halqas] = await Promise.all([
            supabaseService.listReports(),
            supabaseService.listHalqas()
          ])
          set({ 
            reports, 
            halqas,
            customHalqas: halqas.filter(h => h.is_custom).map(h => h.name),
            isLoading: false 
          })
        } catch (err) {
          console.error(err)
          set({ isLoading: false })
        }
      },
      
      addReport: async (report) => {
        try {
          const saved = await supabaseService.saveReport(report)
          set((state) => ({ reports: [saved, ...state.reports] }))
        } catch (err) {
          console.error(err)
          throw err
        }
      },
      
      updateReport: async (id, report) => {
        try {
          const updated = await supabaseService.updateReport(id, report)
          set((state) => ({ 
            reports: state.reports.map(r => r.id === id ? updated : r) 
          }))
        } catch (err) {
          console.error(err)
          throw err
        }
      },
      
      deleteReport: async (id) => {
        try {
          await supabaseService.deleteReport(id)
          set((state) => ({ reports: state.reports.filter(r => r.id !== id) }))
        } catch (err) {
          console.error(err)
          throw err
        }
      },
      
      addCustomHalqa: async (name) => {
        try {
          const newHalqa = await supabaseService.addHalqa(name)
          set((state) => ({ 
            halqas: [...state.halqas, newHalqa],
            customHalqas: [...state.customHalqas, name]
          }))
        } catch (err) {
          console.error(err)
          throw err
        }
      },
      
      removeCustomHalqa: async (id) => {
        try {
          await supabaseService.deleteHalqa(id)
          set((state) => ({
            halqas: state.halqas.filter(h => h.id !== id)
          }))
        } catch (err) {
          console.error(err)
          throw err
        }
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        draftReport: state.draftReport
      })
    }
  )
)
