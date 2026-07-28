# QR Scanner Mobile Fix Plan

## Problem
- Desktop (localhost): QR scanner works with `setTimeout(init, 300)`
- Mobile (Android Chrome): Shows "Kamera tidak tersedia" → generic error toast

## Root Cause Analysis
The `requestAnimationFrame` approach failed because it fires **before** the browser paints — camera starts before modal is visible.

The `setTimeout(300)` works on desktop because the modal/container are fully painted by 300ms.

On mobile, one of these likely causes the failure:
1. The container div (`#qr-scanner-container`) doesn't exist in DOM until modal opens, and slower mobile rendering may delay layout computation
2. Some `html5-qrcode` internal behavior on mobile Chrome

## Proposed Fix

### 1. Pre-mount the container in DOM
**File:** `src/components/QrScanner.jsx`

Change: Instead of `if (!isOpen) return null`, always render the modal but hide it.

```jsx
// Before:
if (!isOpen) return null

// After:
<div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-200 ${!isOpen ? 'invisible opacity-0' : 'visible opacity-100'}`}>
```

This ensures `#qr-scanner-container` always exists in DOM with stable layout.

### 2. Use ref instead of string ID
```jsx
// Before:
const scanner = new Html5Qrcode("qr-scanner-container")

// After:
const scanner = new Html5Qrcode(containerRef.current)
```

Remove `id="qr-scanner-container"` from the div since we use ref.

### 3. Keep setTimeout but reduce to 50ms
```jsx
// Before:
const timer = setTimeout(init, 300)

// After:
const timer = setTimeout(init, 50)
```
50ms is enough for React to apply CSS class changes and the browser to start painting. Still well within Chrome's 5-second user activation window.

### 4. Add detailed error logging
Add `error.name` and `error.message` to the console.error for debugging:
```jsx
console.error("QR Scanner error:", error.name, error.message, error)
```

### 5. Add dimension guard
Check container has layout before initializing:
```jsx
const container = containerRef.current
if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
    setStatus("error")
    toast.error("Gagal memulai kamera. Coba lagi.")
    return
}
```

## Files to Modify
- `src/components/QrScanner.jsx` — all changes in this file

## Verification
1. Test on desktop Chrome — should still work
2. Test on Android Chrome — camera should initialize
3. If still fails, check browser console for the detailed error log
