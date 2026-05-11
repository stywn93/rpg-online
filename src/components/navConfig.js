import {
    CalendarDays, UserRound, Users,
} from "lucide-react";

export const NAV_ITEMS = [
    // ── Grup Utama ──
    {key: "reservation", label: "Kunjungan", icon: CalendarDays, section: "Utama", link: "/reservation"},
    // ── Grup Master Data ──
    {key: "patients", label: "Pasien Anak", icon: UserRound, section: "Master", link: "/patients"},
    {key: "users", label: "Pengguna", icon: Users, link: "/users"},
];

export const BOTTOM_NAV_ITEMS = [
    {key: "reservation", label: "Kunjungan", icon: CalendarDays, link: "/reservation"},
    {key: "patients", label: "Pasien Anak", icon: UserRound, link: "/patients"},
    {key: "users", label: "Pengguna", icon: Users, link: "/users"},
];