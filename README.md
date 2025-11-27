# HandWash Buddy (HandWashMonitor)

**One-liner:** Smartwatch + mobile dashboard that verifies WHO-standard handwashing using accelerometer & gyroscope gestures.

## Demo
> Insert a short GIF or video here showing: (1) Start detection on watch → (2) Perform the 5 gestures → (3) Progress ring fills → (4) Dashboard updates.

## Why this matters
People forget or rush handwashing in hygiene-critical places (hospitals, restaurants). HandWash Buddy gently guides and verifies WHO-standard steps using a smartwatch, giving real-time feedback and logging sessions.

## What we built (MVP)
- Watch app: reads accelerometer + gyroscope, smooths data, detects 5 WHO gestures (threshold-based).
- Mobile/web dashboard: shows recent sessions and simple stats.
- Firebase integration to log completed washes.
- Mock mode (fallback) to demo offline.

## Quick features
- Visual next-step prompt on watch
- Haptic feedback when a gesture is correct
- Circular progress ring for the 5 steps
- Dashboard with recent washes & daily counts
- `mock_mode` toggle for offline demos

## Tech stack
- Watch: (WearOS / Tizen / React Native wearable) — specify exact framework used
- Dashboard: React / Next.js (or Flutter if used)
- Backend: Firebase Firestore (or Realtime DB)
- Hosting: Firebase Hosting / Vercel

## Run locally (developer)
1. Clone:
```bash
git clone https://github.com/yaarrjanhavi/handwash-buddy.git
cd handwash-buddy

