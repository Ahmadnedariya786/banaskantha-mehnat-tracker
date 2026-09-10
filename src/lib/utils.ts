import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function localTodayIso(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

export interface SystemLog {
  timestamp: string;
  action: string;
}

export function logActivity(action: string) {
  try {
    const logs = JSON.parse(localStorage.getItem('system_logs') || '[]') as SystemLog[];
    logs.unshift({ timestamp: new Date().toISOString(), action });
    if (logs.length > 50) logs.pop();
    localStorage.setItem('system_logs', JSON.stringify(logs));
  } catch (e) {}
}

export function getLogs(): SystemLog[] {
  try {
    return JSON.parse(localStorage.getItem('system_logs') || '[]');
  } catch (e) {
    return [];
  }
}

export function clearLogs() {
  localStorage.removeItem('system_logs');
}
