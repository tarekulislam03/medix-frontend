# Build Guide for Medix POS

This guide explains how to build the Desktop and Mobile versions of the application.

## Prerequisites

- Node.js installed.
- **Desktop**: No extra requirements for Windows build on Windows.
- **Android**: Android Studio installed and `ANDROID_SDK_ROOT` set.

## Desktop (Electron)

### Development
To run the electron app in development mode:
```bash
npm run electron:dev
```

### Build (Production)
To build the windows executable (.exe):
```bash
npm run electron:build
```
The output file will be in `dist_electron/`.

## Mobile (Android)

### Initial Setup (One time)
1. Install dependencies:
    ```bash
    npm install
    npm install @capacitor/core @capacitor/cli @capacitor/android
    ```
2. Parse Config:
    ```bash
    npx cap sync
    ```

### Development & Build
1. Build the web app:
    ```bash
    npm run build
    ```
2. Sync with Capacitor:
    ```bash
    npx cap sync
    ```
3. Open in Android Studio:
    ```bash
    npx cap open android
    ```
4. From Android Studio, you can run the app on an emulator or connected device, or "Build Bundle(s) / APK(s)" from the Build menu.

## Troubleshooting

- **White screen on load**: Check `base: './'` in `vite.config.ts`.
- **Network requests failing**: Ensure your backend URL is accessible from the device (e.g., use your IP address instead of `localhost` in `.env` if testing on a real phone).
