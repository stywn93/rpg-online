import {
    CalendarDays, UserRound, Users, HandHeart, ListChecks
} from "lucide-react";
import { STAFF_ROLES } from "../lib/utils/roles.js";

export const NAV_SECTIONS = [
    {
        label: "Utama",
        items: [
            {key: "reservation", label: "Kunjungan", icon: CalendarDays, link: "/reservation"},
            {key: "service-queue", label: "Antrian Layanan", icon: ListChecks, link: "/visit-services", roles: STAFF_ROLES},
        ],
    },
    {
        label: "Master",
        items: [
            {key: "patients", label: "Pasien Anak", icon: UserRound, link: "/patients"},
            {key: "users", label: "Pengguna", icon: Users, link: "/users", roles: STAFF_ROLES},
            {key: "services", label: "Layanan", icon: HandHeart, link: "/services", roles: STAFF_ROLES},
        ],
    },
];

function canAccess(item, role) {
    if (!item.roles || item.roles.length === 0) {
        return true;
    }

    return item.roles.includes(String(role ?? "").toLowerCase());
}

export function getNavSectionsForRole(role) {
    return NAV_SECTIONS
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => canAccess(item, role)),
        }))
        .filter((section) => section.items.length > 0);
}

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export function getBottomNavItemsForRole(role) {
    return NAV_ITEMS.filter((item) => canAccess(item, role));
}
