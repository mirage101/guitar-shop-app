# Guitar Shop app

A full-stack guitar shopping platform with:

- Mobile client built with Expo + React Native (folder: `guitar-shop`)
- Admin/backend panel built with Next.js + Prisma (folder: `backend`)
- Firestore used for mobile product/order data

## Project Purpose

The app helps users discover guitars, manage wishlist/cart, and place orders from mobile, while admins manage products and data workflows in the backend.

## Repository Structure

- `guitar-shop/` - Mobile app (Expo Router)
- `backend/` - Admin app + import/migration scripts (Next.js, Prisma)

## Prerequisites

Install these first:

- Node.js 18+
- npm 9+
- Expo Go app on your device (for mobile testing)

Optional for local backend and data sync:

- Firebase project with Firestore enabled
- Firebase service account JSON file for backend migration scripts

## Environment Setup

### 1) Mobile app environment (`guitar-shop`)

Create `guitar-shop/.env` with your Firebase client config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

In `guitar-shop/app.json`, set `expo.extra.BASE_URL` to your backend URL (example: `http://192.168.x.x:3001`).

### 2) Backend environment (`backend`)

Create or update `backend/.env`:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your_secret_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json.json
```

Place your Firebase service account JSON at the path set in `FIREBASE_SERVICE_ACCOUNT_FILE`.

## Install Packages

Run from repository root:

```bash
cd guitar-shop
npm install

cd ../backend
npm install
```

## Run The Project

You usually run two terminals in parallel.

### Terminal 1: Backend/Admin (Next.js)

```bash
cd backend
npm run dev
```

Backend runs on port `3001`.

### Terminal 2: Mobile app (Expo)

```bash
cd guitar-shop
npm run start
```

Then press:

- `a` for Android emulator
- `i` for iOS simulator (macOS)
- `w` for web
- or scan QR with Expo Go

## Useful Commands

### Mobile (`guitar-shop`)

```bash
npm run start
npm run android
npm run ios
npm run web
```

### Backend (`backend`)

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run set-admin
npm run import-products-json
npm run import-products-json:upsert
npm run migrate-products-firestore
```

## Build Android APK

Use Expo EAS Build to generate an installable Android APK.

### 1) Install and login

```bash
npm install -g eas-cli
eas login
```

### 2) Configure EAS in mobile app

```bash
cd guitar-shop
eas build:configure
```

The project already includes:

- `guitar-shop/eas.json` with `preview` profile for APK
- Android package id in `guitar-shop/app.json`

### 3) Build APK

```bash
cd guitar-shop
eas build -p android --profile preview
```

After build completes, Expo provides a URL/QR to download the APK.

### 4) Install on Android phone

1. Open the build URL on the phone.
2. Download the APK.
3. Allow install from unknown sources (if prompted).
4. Install and launch.

### Production Play Store build (AAB)

```bash
cd guitar-shop
eas build -p android --profile production
```

Use this output for Google Play submission.

## Functional Guide

### Main Features

1. Product discovery
- Home screen with searchable product list
- Type/category chips for browsing
- Pull-to-refresh for fresh product data
- Product details with pricing, stock, rating, and description

2. Cart and checkout
- Add/remove products in cart
- Quantity controls and total calculation
- Checkout form with address and city validation
- Optional location autofill for address (mobile)
- Place order with cash-on-delivery flow

3. Wishlist
- Heart icon toggle from product cards and product details
- Dedicated wishlist screen
- Deal alert toggle and notification logic

4. Authentication and account
- Login/register flows
- Forgot password flow
- Profile tab visibility based on auth state
- Optional biometric login support on device

5. Orders
- Orders list with status badges
- Order details with items, totals, and metadata
- Reorder action from order details

6. UX and mobile behavior
- Loading and error states on key data screens
- Safe-area and keyboard-aware forms
- Reanimated interactions for key tap/remove actions

### Typical User Flow

1. User opens app and browses products on Home
2. User filters/searches by type or keyword
3. User opens product detail and adds item to cart or wishlist
4. User reviews cart and proceeds to checkout
5. User enters delivery details and places order
6. User tracks order in Orders and can reorder later

### Admin/Data Flow

1. Admin runs backend panel
2. Product seed data can be imported from JSON
3. Products can be migrated/synced to Firestore for mobile consumption

## Troubleshooting

- If mobile cannot fetch images/products, verify Firebase env vars and Firestore access rules.
- If backend scripts fail with service account errors, verify `FIREBASE_SERVICE_ACCOUNT_FILE` path and JSON content.
- If mobile cannot reach backend, update `expo.extra.BASE_URL` in `guitar-shop/app.json` to your machine IP and backend port.
- If native dependency changes were made, restart Metro and rebuild the app.

## Notes

- Keep service account files out of git.
- Ensure the backend is reachable from your phone and emulator on the same network when testing mobile + backend together.
