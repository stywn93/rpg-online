import {
    CalendarDays, UserRound, Users, HandHeart
} from "lucide-react";

export const NAV_SECTIONS = [
    {
        label: "Utama",
        items: [
            {key: "reservation", label: "Kunjungan", icon: CalendarDays, link: "/reservation"},
        ],
    },
    {
        label: "Master",
        items: [
            {key: "patients", label: "Pasien Anak", icon: UserRound, link: "/patients"},
            {key: "users", label: "Pengguna", icon: Users, link: "/users"},
            {key: "services", label: "Layanan", icon: HandHeart, link: "/services"},
        ],
    },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export const BOTTOM_NAV_ITEMS = [
    {key: "reservation", label: "Kunjungan", icon: CalendarDays, link: "/reservation"},
    {key: "patients", label: "Pasien Anak", icon: UserRound, link: "/patients"},
    {key: "users", label: "Pengguna", icon: Users, link: "/users"},
    {key: "services", label: "Layanan", icon: HandHeart, link: "/services"},
];
