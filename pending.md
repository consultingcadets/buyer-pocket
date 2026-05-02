# Pending Manual Steps — BuyerPocket Native App

## 1. Firebase — Android FCM Push (REQUIRED)

Without this, push notifications won't work on Android.

1. Go to [Firebase Console](https://console.firebase.google.com) → Select BuyerPocket project
2. Project Settings → Your apps → Android app (`com.buyerpocket.app`)
3. If Android app doesn't exist yet: click "Add app" → Android → enter `com.buyerpocket.app`
4. Download `google-services.json`
5. Place it at: `android/app/google-services.json`
6. Run `npx cap sync`

## 2. Firebase — iOS APNs Push (REQUIRED)

Without this, push notifications won't work on iOS.

1. Go to [Apple Developer Portal](https://developer.apple.com) → Certificates, IDs & Profiles
2. Keys → Create new key → enable "Apple Push Notifications service (APNs)"
3. Download the `.p8` key file
4. Go to Firebase Console → Project Settings → Cloud Messaging → Apple app section
5. Upload the `.p8` key, enter the Key ID and Team ID

## 3. Apple Developer — Associated Domains / Universal Links (REQUIRED for Google OAuth on iOS)

Without this, Google OAuth won't return to the app after sign-in.

1. Run `npx cap open ios` to open Xcode
2. Select the "App" target → "Signing & Capabilities" tab
3. Click `+` Capability → search and add "Associated Domains"
4. Add entry: `applinks:buyerpocket.com.au`
5. Also add "Push Notifications" capability (required for APNs)
6. Set your Team and Bundle ID (`com.buyerpocket.app`) in Signing section

> The `App.entitlements` file is already created with the right values — Xcode will use it automatically.

## 4. Supabase — Redirect URL (REQUIRED for Google OAuth)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your project → Authentication → URL Configuration
2. Add to "Redirect URLs": `https://buyerpocket.com.au/auth/callback`
3. Also confirm Google OAuth is enabled: Authentication → Providers → Google → enable + add Client ID/Secret

## 5. Apple Developer — App-specific setup

1. [developer.apple.com](https://developer.apple.com) → Identifiers → register App ID `com.buyerpocket.app`
2. Enable capabilities: Push Notifications, Associated Domains
3. Create a provisioning profile for distribution (App Store)

## 6. apple-app-site-association — Fill in Team ID (REQUIRED for Universal Links)

1. Find your 10-character Apple Team ID at [developer.apple.com](https://developer.apple.com) → Membership
2. Edit `public/.well-known/apple-app-site-association`
3. Replace `TEAM_ID` with your actual Team ID, e.g.: `"appID": "ABCDE12345.com.buyerpocket.app"`
4. Commit and push → Vercel will serve it at `https://buyerpocket.com.au/.well-known/apple-app-site-association`

## 7. assetlinks.json — Fill in Android Keystore SHA-256 (REQUIRED for App Links)

1. Generate a release keystore (if not done):
   ```bash
   keytool -genkey -v -keystore buyerpocket-release.keystore -alias buyerpocket -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Get the SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore buyerpocket-release.keystore -alias buyerpocket
   ```
3. Edit `public/.well-known/assetlinks.json`
4. Replace `KEYSTORE_SHA256_FINGERPRINT` with the actual fingerprint (format: `AA:BB:CC:...`)
5. Commit and push

## 8. Build and Submit — iOS (App Store)

1. `npx cap sync`
2. `npx cap open ios`
3. In Xcode: select "Any iOS Device" as target
4. Product → Archive
5. Distribute App → App Store Connect → upload
6. Go to [App Store Connect](https://appstoreconnect.apple.com) → complete app listing, screenshots, review info
7. Submit for review

## 9. Build and Submit — Android (Play Store)

1. Place `google-services.json` in `android/app/` (Step 1)
2. `npx cap sync`
3. `npx cap open android`
4. In Android Studio: Build → Generate Signed Bundle/APK → Android App Bundle (.aab)
5. Sign with release keystore (from Step 7)
6. Go to [Google Play Console](https://play.google.com/console) → Create app → upload .aab
7. Complete store listing, screenshots, content rating
8. Submit for review

## 10. App Icons (Recommended before submission)

Current icons are Capacitor defaults. Replace with BuyerPocket branding:

1. Prepare a 1024×1024 PNG icon (no transparency, no rounded corners — stores handle that)
2. Use [Capacitor Assets](https://github.com/ionic-team/capacitor-assets) tool to generate all sizes:
   ```bash
   npm install @capacitor/assets --save-dev
   # Place icon at resources/icon.png (1024×1024)
   npx capacitor-assets generate
   ```
3. `npx cap sync`

## 11. Splash Screen (Recommended before submission)

1. Place a 2732×2732 PNG splash image at `resources/splash.png`
2. Run `npx capacitor-assets generate`
3. `npx cap sync`

---

## Quick Reference — Run after any web deploy

```bash
npx cap sync
```

This copies the latest `capacitor.config.json` and plugin updates to both native projects. **Not needed for web content changes** — those deploy live via Vercel since the app loads `buyerpocket.com.au` remotely.
