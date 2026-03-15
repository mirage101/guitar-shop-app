# Guitar Shop App

Full-stack guitar shopping project:
- Mobile app: Expo + React Native (folder: guitar-shop)
- Admin/backend: Next.js + Prisma (folder: backend)
- Data: Firebase Auth + Firestore

## What It Does
- Browse and search guitars
- View product details
- Add to cart and checkout
- Manage wishlist with deal alerts
- Login/register/forgot password
- View orders, order details, and reorder

APK URL:
https://expo.dev/artifacts/eas/pfg7htkqhqYvBRzXP2ZH6S.apk

##Functional Guide

###User Access and Permissions
####What an unauthenticated user can access:
Store browsing (home/store list of products)
Product details page
Product type listing/filtering
Cart screen and cart item management
Login screen
Register screen
Forgot password flow

####Available actions as guest:
- can search products, open product details, increase, decrease cart quantity, start checkout flow (but login is required to place an order), can create account or log in

####Authenticated User
Authenticated user can place a new order, reorder it, remove it, update cart quantities, toggle wishlist items, toggle deal-alert prefencies, remove items from cart and wishlist

###Authentication & Session Handling
The root layout mounts global providers, including the user provider. Authentication status is checked as the app listens to Firebase Auth state changes using onAuthStateChanged, if a user exists, user data is set in context, if no user exists, context is set to null. Login and registration use Firebase Auth methods. After success, the app gets the Firebase ID token, stores it locally, sets user data in contexts and navigates to the home/store route= On logout app calls Firebase signOut, then it clears user context and removes the stored token and after that redirects to home. Primary session persistence is handled by Firebase Auth internally.
The app also stores an auth token locally with secureStore. Storage helpers are in authStorage.js. On app launch, Firebase restores the previous auth session if it is still valid. The onAuthStateChanged listener in UserContext immediately hydrates userData from that restored session.

###Navigation Structure
How navigation is split between authenticated and unauthenticated users: 
- app always loads one root Stack navigator, defined in _layout.jsx.
- Inside that root Stack, the (tabs) group is the main entry point, plus extra stack screens like checkout, orders, wishlist, order-details, and product-type details.
- Auth-based split is handled mostly in the tab configuration, not by completely separate root navigators:
-In guitar-shop/app/(tabs)/_layout.jsx/_layout.jsx), Profile tab is shown only when user is logged in.
-Login tab is shown only when user is not logged in. This is controlled with userData from context (tabBarItemStyle display toggle).

Main Navigation
Main sections:
- Store (index)
- Cart
- Profile (authenticated only)
- Login (guest only)
Hidden tab routes (not shown in tab bar):
- Register
- Forgot Password
- Product Details
Nested Navigation
Tabs group under guitar-shop/app/(tabs)/_layout.jsx/_layout.jsx) - Additional Stack detail screens outside tabs (checkout, orders, wishlist, order-details, product-type)
What type of screens are included:

Tab-level screens:
Store, Cart, Profile/Login
Auth utility screens:
Register, Forgot Password
Detail/flow screens:
Product Details
Product Type Details
Checkout
Orders list
Order Details
Wishlist

###List -> Details Flow
The main list screen is the Store screen, displays product data from Firestore products, including:
id, name, description, image, sellPrice / mrp, currentStock,
productType (id/name)
How the user interacts with the list:
- Scroll through products in a 2-column FlatList.
- Search by product name/description.
- Filter by product type and availability.
- Sort by price (low to high / high to low).
- Pull-to-refresh to force server fetch.
- Tap product name or “View” button to open details.
- Tap heart icon to add/remove wishlist directly from list card.
- Tap product type chip to open product-type screen.
How navigation is triggered:
From each product card, navigation is triggered with router push to /product/[id], implemented from card interactions (name/view taps). Product type detail uses /product-type/[id] similarly.

What data is received via route parameters:
- Product Details and Product Type screen receives id

How details data is loaded:
id is read via useLocalSearchParams()and screen fetches the matching product by id (findProductById(id)).
Then renders full product view with actions: add/remove cart,
buy now, wishlist toggle

###Data Source & Backend
- Core services are Firebase Authentication + Cloud Firestore.
The repository also includes a Next.js + Prisma backend/admin app for management and migration scripts.

How data is accessed in the app
- Store and product details load products via helper functions in firebaseProducts.js. Checkout creates new order documents in Firestore. Orders and Order Details fetch only the current user’s orders (filtered by customerId). Deleting/reordering orders updates Firestore directly.

###Data Operations (CRUD)

Read (GET):
Products are fetched from Firestore and shown in Store, Product Details, and Product Type screens.
Orders are fetched from Firestore (by customerId) and shown in My Orders and Order Details.
Auth state is read from Firebase (onAuthStateChanged) to control access and tabs.
Create (POST):
New user account via Firebase Auth registration.
New order is created in Checkout (orders collection).
Reorder creates a new order from a previous one.
Update / Delete (Mutation):

Update: cart quantity changes, wishlist/deal-alert toggles, user/auth context updates.
Delete: remove order, remove cart item, clear cart, remove wishlist item.

UI update after changes:
Local state updates instantly for cart/wishlist actions.
Firestore changes trigger refetch/refresh (orders screens).
Success/error feedback is shown with alerts/modals.

###Forms & Validation

Forms used:

Login
Register
Forgot Password
Checkout

Validation rules:

Email: required + valid format (login/register)
Password: required + min 8 chars (login/register)
Name: required + min 2 chars (register)
Address: required + min length (checkout)
City: required + letters-only pattern (checkout)

Behavior:

Submit is blocked when invalid.
Field errors show inline (where applicable).
Firebase errors are shown via alerts.
Errors clear as the user edits inputs.

###10. Native Device Features
Used native features:
Location
Biometrics
Haptics
Local Notifications
Secure Storage

Where used + what it does:

Location / Maps
Used in: Checkout
Does: gets current location and fills address/city fields.
Biometrics
Used in: Login
Does: lets user log in with fingerprint/face unlock.
Haptics
Used in: Checkout
Does: gives small vibration feedback when location action is tapped.
Local Notifications
Used in: Wishlist deal alerts
Does: sends alert when watched item price drops.
Secure Storage
Used in: Auth/session handling
Does: stores token safely on device for keeping user signed in.
###Typical User Flow
- User opens Store, browses/searches products, and opens a product details page.
- User adds items to cart or wishlist, then logs in/registers if needed.
- User goes to Checkout, enters delivery info, and places the order.
- User opens Profile -> My Orders to view order history/details and reorder if needed.

###Error & Edge Case Handling (short)
Authentication errors:
Invalid login, bad email, weak password, and user-not-found are caught and shown with clear alerts.

Network/data errors:
Firestore/API failures (load, create, delete) are caught with try/catch, then the app shows alert/retry messages instead of crashing.

Empty or missing data states:
App shows fallback UI like “No products found”, “Cart is empty”, “No orders yet”, and “Product not found”, with safe actions (go back/retry/login).
## Quick Start

### Prerequisites
- Node.js 18+
- npm
- Expo Go (or Android emulator)
- Firebase project

### Environment
Create guitar-shop/.env:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Optional backend env (backend/.env):

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json.json
```

### Install

```bash
cd guitar-shop
npm install

cd ../backend
npm install
```

### Run
Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd guitar-shop
npm run start
```

## APK Build

```bash
cd guitar-shop
npx eas login
npx eas build -p android --profile preview
```

Use the build URL from EAS to download and install the APK.



## Main User Flow
1. Open Store and browse products.
2. Open product details and add items to cart/wishlist.
3. Login/Register if needed.
4. Checkout and place order.
5. Track orders in Profile -> My Orders.

## Core Features
- Auth: login, register, forgot password, logout
- Store: filters, search, product type navigation
- Cart: quantity management + total
- Checkout: address/city validation + location autofill
- Wishlist: save items + deal notification toggle
- Orders: list, details, reorder, delete

## Troubleshooting
- Check Firebase env values if auth/data fails.
- Confirm Firestore rules and collections (products, orders).
- If mobile cannot reach backend, update BASE_URL in guitar-shop/app.json.
- Restart Metro after dependency changes.
