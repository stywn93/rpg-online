# User Access Control Implementation Plan

## Overview
Implement role-based access control with two roles: **admin** and **user (regular)**.
Admin has full access; user can only see their own reservation history and their children's anamnesa history.

---

## Phase 1 — Foundation (permissions + navigation)

| # | File | Change |
|---|------|--------|
| 1 | **New: `src/auth/permissions.js`** | Centralized permission helpers: `isAdmin()`, `isUser()`, `canAccessNavItem()`, `canAccessRoute()` |
| 2 | `src/components/navConfig.js` | Add `roles: ["admin", "user"]` to each nav item |
| 3 | `src/components/Sidebar.jsx` | Filter nav items by `user.role` using the new permission utility |
| 4 | `src/components/BottomNav.jsx` | Same role-based filtering |
| 5 | `src/components/Topbar.jsx` | Hide "Buat Pengguna Baru" action for non-admin users |

## Phase 2 — Route protection

| # | File | Change |
|---|------|--------|
| 6 | **New: `src/components/ProtectedRoute.jsx`** | Component that checks `user.role` against allowed roles, redirects to `/reservation` if unauthorized |
| 7 | `src/main.jsx` | Wrap admin-only routes (`/users/*`, `/services/*`) with `ProtectedRoute` requiring `admin` role |

## Phase 3 — Data scoping (page-level)

| # | File | Change |
|---|------|--------|
| 8 | `src/patients/Patients.jsx` | If user is `"user"`, call `listPatientsByParent(userId)` instead of `listPatients()` |
| 9 | `src/patients/PatientDetails.jsx` | For regular users, verify the patient belongs to them; redirect away if not |
| 10 | `src/reservations/ReservationList.jsx` | For regular users, pass `parent_id` filter to `queueList()` API |
| 11 | `src/lib/api/Queue.js` | Add optional `parentId` parameter to `queueList()` |

---

## Expected user experience

### Admin
- Full access to all features (no change from current behavior)

### Regular User
- **Nav**: only sees "Kunjungan" and "Pasien Anak"
- **Kunjungan**: only their own children's visit history
- **Pasien Anak**: only their own children
- **Buat Rencana Kunjungan**: only for their own children
- **No access** to: Pengguna page, Layanan page, or any admin features
