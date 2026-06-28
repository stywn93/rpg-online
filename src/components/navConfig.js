import {
    CalendarDays, UserRound, Users, HandHeart
} from "lucide-react";

export const NAV_ITEMS = [
    // ── Grup Utama ──
    {key: "reservation", label: "Kunjungan", icon: CalendarDays, section: "Utama", link: "/reservation", roles: ["admin", "user"]},
    // ── Grup Master Data ──
    {key: "patients", label: "Pasien Anak", icon: UserRound, section: "Master", link: "/patients", roles: ["admin", "user"]},
    {key: "users", label: "Pengguna", icon: Users, link: "/users", roles: ["admin"]},
    {key: "services", label: "Layanan", icon: HandHeart, link: "/services", roles: ["admin"]},
];

export const BOTTOM_NAV_ITEMS = [
    {key: "reservation", label: "Kunjungan", icon: CalendarDays, link: "/reservation", roles: ["admin", "user"]},
    {key: "patients", label: "Pasien Anak", icon: UserRound, link: "/patients", roles: ["admin", "user"]},
    {key: "users", label: "Pengguna", icon: Users, link: "/users", roles: ["admin"]},
    {key: "services", label: "Layanan", icon: HandHeart, link: "/services", roles: ["admin"]},
];