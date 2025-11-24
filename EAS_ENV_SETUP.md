# EAS Environment Variables Setup Guide

## Required Environment Variables

Your Donation App needs these environment variables for EAS Build:

### Firebase Configuration (6 variables)

1. `EXPO_PUBLIC_FIREBASE_API_KEY`
2. `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
3. `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
4. `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
5. `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
6. `EXPO_PUBLIC_FIREBASE_APP_ID`

### Cloudinary Configuration (2 variables)

7. `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`
8. `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## Method 1: Add via EAS CLI (Command Line)

Copy your actual values from your local `.env` file and run these commands:

```bash
# Firebase variables
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_APP_ID --value "YOUR_VALUE_HERE" --type string

# Cloudinary variables
eas secret:create --scope project --name EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME --value "YOUR_VALUE_HERE" --type string

eas secret:create --scope project --name EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET --value "YOUR_VALUE_HERE" --type string
```

**Replace `YOUR_VALUE_HERE` with your actual values from `.env` file!**

---

## Method 2: Add via Web Dashboard (Easier)

1. Go to https://expo.dev
2. Login with your Expo account
3. Click on your **Donation-App** project
4. Go to **Project settings** (gear icon)
5. Click **Secrets** in the left sidebar
6. For each variable:
   - Click **Create a secret**
   - Enter the **Name** (e.g., `EXPO_PUBLIC_FIREBASE_API_KEY`)
   - Enter the **Value** (copy from your `.env` file)
   - Select **Visibility**: Choose "Plain text" for `EXPO_PUBLIC_*` variables
   - Click **Create**

---

## How to Get Your Values

Open your `.env` file in the project and copy the values:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

---

## After Adding Variables

1. **Verify** they're added:

   ```bash
   eas secret:list
   ```

2. **Run the build again**:
   ```bash
   eas build --platform android --profile production
   ```

---

## Important Notes

- ✅ Use **Plain text** visibility for `EXPO_PUBLIC_*` variables (they're meant to be public)
- ✅ These variables will be embedded in your APK
- ✅ You only need to set them once - they'll be used for all future builds
- ⚠️ Don't share sensitive Firebase keys publicly (but `EXPO_PUBLIC_*` are okay for client apps)

---

## Troubleshooting

### "Secret already exists"

If you get this error, delete the existing secret first:

```bash
eas secret:delete --name EXPO_PUBLIC_FIREBASE_API_KEY
```

Then create it again.

### "Cannot find .env file"

This is normal! EAS Build doesn't use your local `.env` file. That's why you need to add secrets.

### Build still fails?

Make sure:

1. All 8 variables are added
2. Variable names match exactly (including `EXPO_PUBLIC_` prefix)
3. Values don't have extra quotes or spaces
