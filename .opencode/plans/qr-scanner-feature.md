# QR Scanner for Reservation Check-in

## Summary
Add QR scanning capability to the Reservation List page so staff can scan a patient's reservation QR code and auto-check-in without manual data entry.

## Changes

### 1. Install dependency
- `html5-qrcode` — lightweight QR scanning library

### 2. New file: `src/components/QrScanner.jsx`
- Modal overlay component that:
  - Opens camera via `html5-qrcode` (rear-facing `environment` camera)
  - Shows scanning state (starting, scanning, error)
  - On successful scan → calls `onScan(decodedValue)` and auto-closes
  - On error → shows Indonesian error toast (permission denied, no camera, etc.)
  - Stops camera stream on close/unmount
  - Close button (X icon) and backdrop click to close

### 3. Modify: `src/reservations/ConfirmedReservation.jsx`
- Change `QueueQrCode` value from `reservation.queueNumber` to `reservation.queueId`
  - Line 80: `<QueueQrCode value={reservation.queueId ?? ""} />`
  - Update title prop to reflect reservation ID instead of queue number
- This makes the QR code encode the reservation UUID, which the scanner can use to look up and check in the patient

### 4. Modify: `src/reservations/ReservationList.jsx`
- Import `QrScanner`, `Scan` icon from lucide-react
- Add state: `isScannerOpen` (boolean)
- Add **"Scan QR"** button next to the "Reset filter" button in the filter toolbar
- On scan success:
  1. Extract reservation ID (scanned value is the ID itself)
  2. Call `updateQueueStatus(id, "checked_in")` 
  3. Show success toast: `"Pasien berhasil check-in"`
  4. If the ID is not found in the current queue list → still attempt API call; show appropriate toast
- `QrScanner` component renders conditionally based on `isScannerOpen`

### 5. No other files modified
- No changes to API files, routing, auth, etc.

## Edge Cases Handled
- Camera permission denied → error toast
- No camera available → error toast
- Scanned ID doesn't match any queue in current list → toast warning + still try check-in
- Scanner component unmounted while camera active → cleanup in useEffect return
- Multiple rapid scans → scanner stops after first success

## Verification
- `npm run dev` — builds and serves without errors
- Manual test: create reservation → show QR → scan on reservation list page → auto check-in
