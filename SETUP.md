# 🚀 Quick Setup Guide

## Step-by-Step Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `donation-app` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in method
4. Enable **Email/Password**
5. Click **"Save"**

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a location closest to your users
5. Click **"Enable"**

### 4. Enable Storage

1. Go to **Storage**
2. Click **"Get started"**
3. Start in **test mode**
4. Click **"Done"**

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`)
4. Register app name: `Donation App`
5. Copy the configuration object

### 6. Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=donation-app-xxxxx.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=donation-app-xxxxx
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=donation-app-xxxxx.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### 7. Set Up Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update, delete: if isOwner(userId);
    }
    
    // Campaigns collection
    match /campaigns/{campaignId} {
      allow read: if true; // Anyone can read campaigns
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (isOwner(resource.data.createdBy) || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if isAuthenticated() && 
                      (isOwner(resource.data.createdBy) || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Donations collection
    match /donations/{donationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Donations cannot be modified
    }
  }
}
```

3. Click **"Publish"**

### 8. Set Up Storage Security Rules

1. Go to **Storage** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Campaign images
    match /campaigns/{campaignId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### 9. Create Initial Admin User (Optional)

After creating your first user account through the app:

1. Go to **Firestore Database**
2. Find the `users` collection
3. Click on your user document
4. Add a field:
   - Field: `role`
   - Type: `string`
   - Value: `admin`
5. Click **"Update"**

### 10. Run the App

```bash
npm start
```

Choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## 🎉 You're All Set!

Your donation app is now ready to use with:
- ✅ User authentication
- ✅ Campaign management
- ✅ Donation processing
- ✅ Profile management
- ✅ Image uploads

## 📝 Next Steps

1. **Test the app**:
   - Create an account
   - Browse campaigns
   - Make a donation
   - Check your profile

2. **Create your first campaign** (as admin):
   - Set yourself as admin in Firestore
   - Create a new campaign
   - Upload campaign image
   - Set goal amount

3. **Customize**:
   - Update colors in `tailwind.config.js`
   - Modify components in `src/components/`
   - Add new features

## 🆘 Troubleshooting

### "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify Firebase configuration in `.env`

### "Permission denied" errors
- Check Firestore Security Rules
- Ensure user is authenticated
- Verify user has correct permissions

### Images not uploading
- Check Storage Security Rules
- Verify Storage is enabled in Firebase Console
- Check file size (max 5MB recommended)

### App not starting
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

Need help? Check the main README.md or open an issue!
