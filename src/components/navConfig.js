// navConfig.js
// Konfigurasi item navigasi
// Dependensi: npm install lucide-react

import {
    LayoutGrid,
    CalendarDays,
    CalendarPlus,
    UserRound,
    UserRoundCog,
    BarChart2,
    Settings,
    Sheet
} from "lucide-react";

/**
 * Setiap item navigasi:
 * - key     : identifier unik (dipakai sebagai active state)
 * - label   : teks yang ditampilkan
 * - icon    : komponen Lucide icon
 * - badge   : (opsional) angka notifikasi
 * - section : grup label sidebar; null = ikut grup item sebelumnya
 * - link    : anchor to link
 */
export const NAV_ITEMS = [
    // ── Grup Utama ──
    // {key: "dashboard", label: "Dasboard", icon: LayoutGrid, section: "Utama", link: "/"},
    {key: "reservations", label: "Reservasi", icon: CalendarDays, badge: 4, section: "Utama", link: "/reservation"},
    {key: "schedules", label: "Jadwal", icon: CalendarPlus, section: null, link: "/schedules"},
    {key: "sampleTable", label: "Sample Table", icon: Sheet, section: null, link: "/table"},

    // ── Grup Master Data ──
    {key: "patients", label: "Pasien", icon: UserRound, section: "Master", link: "/patients"},
    {key: "users", label: "Pengguna", icon: UserRoundCog, link: "/users"},

    // ── Grup Laporan ──
    {key: "analytics", label: "Analitik", icon: BarChart2, section: "Laporan"},
    {key: "settings", label: "Pengaturan", icon: Settings, section: null},

];

/**
 * Item bottom nav mobile — maksimal 5 untuk kenyamanan tap area.
 * Gunakan key yang sama dengan NAV_ITEMS agar active state sinkron.
 */
export const BOTTOM_NAV_ITEMS = [
    {key: "dashboard", label: "Dasboard", badge:4, icon: LayoutGrid, link: "/"},
    {key: "users", label: "Data", icon: UserRoundCog, link: "/users"},
    {key: "settings", label: "Pengaturan", icon: Settings},
];
