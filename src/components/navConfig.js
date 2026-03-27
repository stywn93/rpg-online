// navConfig.js
// Konfigurasi item navigasi
// Dependensi: npm install lucide-react

import {
  LayoutGrid,
  CalendarDays,
  Users,
  Home,
  BarChart2,
  Settings,
} from "lucide-react";

/**
 * Setiap item navigasi:
 * - key     : identifier unik (dipakai sebagai active state)
 * - label   : teks yang ditampilkan
 * - icon    : komponen Lucide icon
 * - badge   : (opsional) angka notifikasi
 * - section : grup label sidebar; null = ikut grup item sebelumnya
 */
export const NAV_ITEMS = [
  // ── Grup Utama ──
  { key: "dashboard",    label: "Dasbor",    icon: LayoutGrid,   section: "Utama" },
  { key: "reservations", label: "Reservasi", icon: CalendarDays, badge: 4, section: null },
  { key: "guests",       label: "Tamu",      icon: Users,        section: null },
  { key: "rooms",        label: "Ruangan",   icon: Home,         section: null },

  // ── Grup Laporan ──
  { key: "analytics", label: "Analitik",   icon: BarChart2, section: "Laporan" },
  { key: "settings",  label: "Pengaturan", icon: Settings,  section: null },
];

/**
 * Item bottom nav mobile — maksimal 5 untuk kenyamanan tap area.
 * Gunakan key yang sama dengan NAV_ITEMS agar active state sinkron.
 */
export const BOTTOM_NAV_ITEMS = [
  { key: "dashboard",    label: "Dasbor",     icon: LayoutGrid   },
  { key: "reservations", label: "Reservasi",  icon: CalendarDays, badge: 4 },
  { key: "guests",       label: "Tamu",       icon: Users        },
  { key: "analytics",    label: "Laporan",    icon: BarChart2    },
  { key: "settings",     label: "Pengaturan", icon: Settings     },
];
