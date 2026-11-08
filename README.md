# Avindu & Yavishka — 3D Wedding Journey

An interactive, browser-based 3D walkthrough inspired by the supplied Ruwanara Royal Majestry venue photographs.

## Run locally

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for deployment

```bash
npm run build
npm run preview
```

Deploy the project to Vercel using the Vite/TanStack Start preset. Add the same environment variables used by your existing project if you want to retain the original RSVP and couple portal backend. The 3D walkthrough itself uses the supplied venue images from `public/wedding3d`.

## Controls

- Desktop: mouse wheel or arrow keys to move through the venue; use the stop navigation to jump between wedding details.
- Mobile: swipe on the 3D scene or use the stop navigation.
- The details cards provide the wedding date, Poruwa time, venue directions, countdown, and RSVP link.

## Wedding information currently configured

- Couple: Avindu & Yavishka
- Date: Wednesday, 20 January 2027
- Time: 9:00 AM – 3:30 PM
- Poruwa ceremony: 9:42 AM
- Venue: Ruwanara Royal Majestry, Narammala

Review these details in `src/lib/wedding.ts` and `src/components/wedding/WeddingWalkthrough.tsx` before publishing.
