# 🎁 Donation App - Complete Reusable Component Architecture

A **production-ready** donation platform built with **Expo Router**, **NativeWind**, **TypeScript**, and **Firebase**. Features a fully reusable component architecture with modern UI/UX, real-time updates, admin dashboard, and push notifications.

## 🛠️ Built With

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=for-the-badge&logo=expo&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B52AE?style=for-the-badge&logo=react&logoColor=white)
![EAS Build](https://img.shields.io/badge/EAS_Build-000020?style=for-the-badge&logo=expo&logoColor=white)

**Core Technologies:**
- **Expo SDK 54** - React Native framework for cross-platform development
- **TypeScript** - Type-safe JavaScript for better code quality
- **Firebase** - Backend-as-a-Service (Authentication, Firestore, Storage)
- **Expo Router** - File-based routing system
- **NativeWind** - Tailwind CSS for React Native
- **Cloudinary** - Image upload and CDN service
- **Expo Notifications** - Push notification system
- **React Navigation** - Navigation library
- **React Native Reanimated** - Animation library
- **AsyncStorage** - Local data persistence
- **EAS Build** - Cloud build service for Expo apps

## ✨ Key Features

### User Features
- 🔐 **Complete Authentication** - Login, Signup with email verification and password reset
- 💳 **Donation System** - Make donations with custom amounts, messages, and anonymous option
- 📊 **Campaign Management** - Browse, search, filter, view details, and track progress in real-time
- 🎯 **Campaign Creation** - Create and edit your own campaigns with images
- 👤 **User Profiles** - View donation history, stats, and manage campaigns
- 🔔 **Push Notifications** - Receive real-time notifications for donations and campaign updates
- 🔄 **Real-time Updates** - Live campaign progress and donation tracking
- 🎨 **Modern UI/UX** - Gradients, animations, floating labels, and smooth transitions
- 📱 **Fully Responsive** - Works seamlessly on iOS, Android, and Web
- ♿ **Accessible** - Screen reader support and accessibility features

### Admin Features
- 📈 **Admin Dashboard** - Comprehensive statistics and analytics
- 👥 **User Management** - View all users, promote to admin, manage roles
- 🎯 **Campaign Management** - View, edit, delete, and end campaigns
- 💰 **Donations Overview** - Monitor all donations across the platform
- 🔐 **Role-Based Access Control** - Secure admin-only features

## 🏗️ Project Structure

```
Donation-App/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with auth routing
│   ├── index.tsx                # Entry point (redirects based on auth/role)
│   │
│   ├── (tabs)/                   # User tab navigation
│   │   ├── _layout.tsx           # Tab layout with 5 tabs
│   │   ├── index.tsx            # Home - Active campaigns list
│   │   ├── explore.tsx          # Explore - Search and filter campaigns
│   │   ├── create-campaign.tsx  # Create new campaign
│   │   ├── my-campaigns.tsx     # User's created campaigns
│   │   ├── my-donations.tsx     # User's donation history (hidden tab)
│   │   └── profile.tsx           # User profile and stats
│   │
│   ├── (admin)/                  # Admin tab navigation
│   │   ├── _layout.tsx           # Admin tab layout
│   │   ├── dashboard.tsx        # Admin dashboard with statistics
│   │   ├── campaigns.tsx        # Manage all campaigns
│   │   ├── users.tsx            # Manage users and roles
│   │   ├── donations.tsx        # View all donations (hidden tab)
│   │   └── profile.tsx          # Admin profile
│   │
│   ├── campaign/                 # Campaign routes
│   │   ├── [id].tsx             # Campaign details (dynamic)
│   │   └── edit/
│   │       └── [id].tsx         # Edit campaign (dynamic)
│   │
│   ├── donate/                   # Donation routes
│   │   └── [campaignId].tsx     # Donation form (dynamic)
│   │
│   ├── login.tsx                 # Login screen
│   ├── signup.tsx                # Signup screen
│   ├── email-verification.tsx    # Email verification screen
│   ├── forgot-password.tsx       # Password reset screen
│   ├── settings.tsx              # App settings
│   └── notifications.tsx        # Notifications list
│
├── src/
│   ├── components/               # Reusable UI Components
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx    # Primary action button with variants
│   │   │   ├── SecondaryButton.tsx  # Secondary/outline button
│   │   │   └── index.ts
│   │   │
│   │   ├── cards/
│   │   │   ├── CampaignCard.tsx     # Campaign display card
│   │   │   ├── DonationCard.tsx     # Donation history card
│   │   │   ├── UpdateCard.tsx       # Campaign update card
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/
│   │   │   ├── CampaignForm.tsx     # Campaign creation/edit form
│   │   │   └── index.ts
│   │   │
│   │   ├── feedback/
│   │   │   ├── Toast.tsx            # Toast notifications
│   │   │   ├── ProgressBar.tsx      # Progress indicator
│   │   │   ├── StatusBadge.tsx      # Status badge component
│   │   │   ├── ConfirmDialog.tsx    # Confirmation dialog
│   │   │   └── index.ts
│   │   │
│   │   ├── inputs/
│   │   │   ├── TextInput.tsx        # Text input with floating label
│   │   │   ├── PasswordInput.tsx    # Password input with toggle
│   │   │   ├── SearchBar.tsx        # Search input component
│   │   │   └── index.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx       # Authentication screen layout
│   │   │   ├── DashboardLayout.tsx  # Dashboard screen layout
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/
│   │   │   ├── FilterTabs.tsx       # Category filter tabs
│   │   │   ├── ProfileDropdown.tsx  # Profile dropdown menu
│   │   │   └── index.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx # Notification bell icon
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx    # Profile header component
│   │   │   ├── QuickActions.tsx     # Quick action buttons
│   │   │   ├── UserCampaignsSection.tsx # User campaigns list
│   │   │   └── index.ts
│   │   │
│   │   ├── skeletons/
│   │   │   ├── CampaignCardSkeleton.tsx # Loading skeleton
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                # Component exports
│   │
│   ├── firebase/                   # Firebase Integration
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── auth.ts                 # Authentication functions
│   │   ├── firestore.ts            # Firestore operations
│   │   ├── storage.ts              # Storage operations
│   │   └── index.ts                # Firebase exports
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useAuth.ts              # Authentication state hook
│   │   ├── useCampaign.ts          # Single campaign management
│   │   ├── useCampaigns.ts         # Campaigns list management
│   │   ├── useDonations.ts         # Donations management
│   │   ├── useNotifications.ts     # Push notifications hook
│   │   ├── useUserNotifications.ts # User notifications management hook
│   │   ├── useToast.ts             # Toast notifications hook
│   │   ├── useEmailVerification.ts # Email verification hook
│   │   └── index.ts                # Hook exports
│   │
│   ├── types/                      # TypeScript Type Definitions
│   │   ├── User.ts                 # User interface
│   │   ├── Campaign.ts             # Campaign interface
│   │   ├── CampaignUpdate.ts       # Campaign update interface
│   │   ├── Donation.ts             # Donation interface
│   │   ├── Notification.ts         # Notification interface
│   │   ├── cloudinary.ts           # Cloudinary types
│   │   └── index.ts                # Type exports
│   │
│   ├── utils/                      # Utility Functions
│   │   ├── validators.ts           # Form validation functions
│   │   ├── formatters.ts           # Data formatting (currency, dates)
│   │   ├── asyncHandlers.ts        # Async error handling
│   │   ├── imageHelpers.ts         # Image processing utilities
│   │   └── index.ts                # Utility exports
│   │
│   └── services/
│       ├── notifications.ts        # Push notification registration service
│       └── notificationService.ts # Notification CRUD operations service
│
├── assets/                         # Static Assets
│   ├── app_logo.png               # App logo
│   ├── logo.png                   # Logo variant
│   ├── auth_background.jpg        # Auth screen background
│   ├── campaign_placeholder.png   # Default campaign image
│   ├── donation_logo.png          # Donation logo
│   └── images/                    # Additional images
│
├── components/                     # Legacy components (Expo template)
├── constants/                      # App constants
│   └── theme.ts                   # Theme configuration
│
├── hooks/                          # Legacy hooks (Expo template)
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── android/                        # Android native code
├── scripts/                        # Build scripts
│   ├── reset-project.js
│   ├── eas-build-pre-install.js   # EAS build pre-install script
│   └── eas-build-pre-install.sh   # EAS build pre-install script (bash)
│
├── app.config.js                   # Expo configuration (dynamic)
├── app.json                        # Expo configuration (legacy)
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.js             # Tailwind/NativeWind config
├── babel.config.js                # Babel config
├── firestore.rules                # Firestore security rules
├── google-services.json            # Firebase Android config
├── serviceAccountKey.json          # Firebase Admin SDK key
├── SETUP.md                        # Setup guide
└── README.md                       # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Copy config to `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Setup Cloudinary (Image Uploads)
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings → Upload
3. Create an **Upload Preset**:
   - Name: `donation-app-uploads` (or your choice)
   - Signing mode: **Unsigned** (for client-side uploads)
   - Folder: `donation-app` (optional, for organization)
4. Copy your **Cloud Name** from the dashboard
5. Add to `.env`:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=donation-app-uploads
```

**Note**: Cloudinary is used for:
- Campaign image uploads (stored in `donation-app/campaigns/{campaignId}/`)
- Profile picture uploads (stored in `donation-app/profiles/{userId}/`)
- Automatic image optimization and CDN delivery

### 4. Run the App
```bash
npm start
# Press 'a' for Android, 'i' for iOS, 'w' for Web
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📱 Application Flow

### Authentication Flow
1. **App Launch** → Check authentication state
2. **Not Authenticated** → Redirect to Login
3. **Sign Up** → Create account → Email verification required
4. **Login** → Verify email → Access granted
5. **Email Verification** → Check verification status → Resend if needed
6. **Password Reset** → Send reset email → Update password

### User Flow
1. **Home Tab** → Browse active campaigns → Random order for discovery
2. **Explore Tab** → Search and filter campaigns by category
3. **Campaign Details** → View full details, progress, recent donations
4. **Donate** → Enter amount, message, anonymous option → Process donation
5. **My Campaigns** → View created campaigns → Edit/Manage campaigns
6. **My Donations** → View donation history with details
7. **Profile** → View stats, manage account, quick actions

### Admin Flow
1. **Admin Dashboard** → View platform statistics
2. **Users Management** → View all users → Promote to admin
3. **Campaigns Management** → View all campaigns → Edit/Delete/End campaigns
4. **Donations Overview** → View all donations across platform
5. **Profile** → Admin profile management

### Campaign Lifecycle
1. **Draft** → Campaign created but not active
2. **In Progress** → Campaign active, accepting donations
3. **Completed** → Goal reached automatically
4. **Ended** → Manually ended by admin

### Donation Flow
1. **Select Campaign** → Navigate to campaign details
2. **Donate Button** → Navigate to donation form
3. **Enter Details** → Amount, message (optional), anonymous option
4. **Process Donation** → Firestore transaction:
   - Create donation record
   - Update campaign donated amount
   - Update user statistics
   - Auto-complete campaign if goal reached
5. **Success** → Show confirmation → Redirect back

## 🛠️ Technical Architecture

### Framework & Routing
- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based routing system
  - Automatic route generation from file structure
  - Dynamic routes with `[param]` syntax
  - Nested layouts with `(group)` folders
  - Type-safe navigation with TypeScript

### State Management
- **React Hooks** - useState, useEffect, useContext
- **Custom Hooks** - Encapsulated business logic
  - `useAuth` - Authentication state management
  - `useCampaign` - Single campaign state
  - `useCampaigns` - Campaigns list with filters
  - `useDonations` - Donations management
  - `useNotifications` - Push notification handling
  - `useToast` - Toast notification state

### Firebase Integration

#### Authentication
- **Firebase Auth** with AsyncStorage persistence
- Email/Password authentication
- Email verification system
- Password reset functionality
- Role-based access (user/admin)

#### Firestore Database
- **Real-time Subscriptions** - `onSnapshot` for live updates
- **Transactions** - Atomic operations for donations
- **Queries** - Filtered and sorted data retrieval
- **Collections**:
  - `users` - User profiles and statistics
  - `campaigns` - Campaign data
  - `donations` - Donation records
  - `notifications` - User notifications

#### Storage
- **Cloudinary** - Image upload and CDN service
  - Campaign image uploads
  - Profile picture uploads
  - Automatic image optimization
  - CDN delivery for fast loading
  - Folder organization (`donation-app/campaigns/`, `donation-app/profiles/`)
- **Firebase Storage** - Alternative storage option (optional)

### Styling
- **NativeWind** - Tailwind CSS for React Native
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach

### Type Safety
- **TypeScript** - Full type coverage
- **Type Definitions** - Interfaces for all data models
- **Type Exports** - Centralized type management

## 🔥 Firebase Collections

### users
```typescript
{
  id: string;                    // Firebase Auth UID
  name: string;                   // User display name
  email: string;                   // User email
  photoURL?: string;              // Profile picture URL
  role: 'user' | 'admin';         // User role
  totalDonated: number;           // Total amount donated
  donationCount: number;          // Total number of donations
  totalCampaigns: number;         // Total campaigns created
  pushToken?: string;             // Expo push notification token
  createdAt: number;              // Timestamp
  updatedAt: number;              // Last update timestamp
}
```

### campaigns
```typescript
{
  id: string;                     // Campaign ID
  title: string;                  // Campaign title
  shortDescription: string;       // Brief description for cards
  fullDescription: string;       // Detailed description
  imageUrl?: string;              // Campaign image URL
  targetAmount: number;           // Goal amount to raise
  donatedAmount: number;          // Current amount donated
  ownerId: string;                // User ID of creator
  ownerName: string;              // Name of creator
  category?: 'education' | 'health' | 'disaster' | 'community' | 'other';
  status: 'draft' | 'in_progress' | 'completed' | 'ended';
  createdAt: number;              // Creation timestamp
  updatedAt: number;              // Last update timestamp
  endDate?: number;               // Optional end date
}
```

### donations
```typescript
{
  id: string;                     // Donation ID
  campaignId: string;             // Campaign ID
  campaignTitle?: string;         // Campaign title (denormalized)
  donorId: string;                // Donor user ID
  donorName: string;              // Donor name (required for display)
  amount: number;                 // Donation amount
  message?: string;               // Optional donation message
  isAnonymous: boolean;           // Anonymous donation flag
  paymentMethod?: 'card' | 'paypal' | 'bank';
  transactionId?: string;         // Payment transaction ID
  status: 'pending' | 'completed' | 'failed';
  donatedAt: number;              // Donation timestamp
  timestamp: number;              // Alias for donatedAt
}
```

### notifications
```typescript
{
  id: string;                     // Notification ID
  userId: string;                 // Target user ID
  type: 'donation' | 'campaign_update' | 'admin_action' | 'milestone';
  title: string;                  // Notification title
  body: string;                   // Notification body
  data: {
    campaignId?: string;         // Related campaign ID
    donationId?: string;         // Related donation ID
    updateId?: string;           // Related update ID
    action?: string;             // Action type
  };
  read: boolean;                  // Read status
  createdAt: number;             // Creation timestamp
}
```

## 🔔 Notification System

The app features a comprehensive notification system that includes both in-app notifications (stored in Firestore) and push notifications (via Expo Notifications). The system provides real-time updates for donations, campaign milestones, and administrative actions.

### Notification Architecture

#### Push Notification Registration
The app registers devices for push notifications using Expo's notification service:

**Service**: `src/services/notifications.ts`
- `registerForPushNotifications(userId: string)` - Registers device and saves Expo push token to Firestore
  - Requests notification permissions
  - Creates Android notification channel (`default`)
  - Gets Expo push token
  - Saves token to user document in Firestore (`users/{userId}/pushToken`)

**Configuration**:
- Android notification channel: `default`
  - Importance: `MAX`
  - Vibration pattern: `[0, 250, 250, 250]`
  - Light color: `#10b981`
- Foreground notification handler: Shows alerts, plays sound, sets badge, shows banner

#### Notification Types

1. **`donation`** - Donation-related notifications
   - New donation received (to campaign owner)
   - Thank you message (to donor)

2. **`campaign_update`** - Campaign status changes
   - Campaign started
   - Campaign updated

3. **`admin_action`** - Administrative actions
   - Campaign ended by admin
   - User promoted to admin

4. **`milestone`** - Campaign milestone achievements
   - Goal reached (100%)
   - Progress milestones (25%, 50%, 75%)

### Notification Service Functions

**Service**: `src/services/notificationService.ts`

#### Create Notification
```typescript
createNotification(
  userId: string,
  type: 'donation' | 'campaign_update' | 'admin_action' | 'milestone',
  title: string,
  body: string,
  data?: {
    campaignId?: string;
    donationId?: string;
    updateId?: string;
    action?: string;
  }
): Promise<string>
```
Creates a notification document in Firestore `notifications` collection.

#### Mark as Read
```typescript
markNotificationAsRead(notificationId: string): Promise<void>
```
Marks a single notification as read.

#### Mark All as Read
```typescript
markAllAsRead(userId: string): Promise<void>
```
Marks all unread notifications for a user as read.

#### Delete Notification
```typescript
deleteNotification(notificationId: string): Promise<void>
```
Deletes a notification from Firestore.

#### Get User Notifications
```typescript
getUserNotifications(userId: string, limitCount?: number): Promise<AppNotification[]>
```
Retrieves user's notifications with pagination (default limit: 50).

#### Get Unread Count
```typescript
getUnreadCount(userId: string): Promise<number>
```
Returns the count of unread notifications for a user.

### Notification Hooks

#### useNotifications
**Location**: `src/hooks/useNotifications.ts`

Handles push notification registration and navigation:
```typescript
const { expoPushToken, notification } = useNotifications();
```

**Features**:
- Automatically registers for push notifications when user logs in
- Listens for notifications received while app is in foreground
- Handles notification taps and navigates to relevant screens
  - If `data.campaignId` exists → navigates to `/campaign/{campaignId}`
  - If `data.donationId` exists → navigates to `/my-donations`

#### useUserNotifications
**Location**: `src/hooks/useUserNotifications.ts`

Manages user's in-app notifications:
```typescript
const {
  notifications,
  unreadCount,
  loading,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = useUserNotifications(userId);
```

**Features**:
- Real-time subscription to user's notifications
- Automatic unread count calculation
- Methods to mark notifications as read (single/all)
- Method to delete notifications

### Notification Components

#### NotificationBell
**Location**: `src/components/notifications/NotificationBell.tsx`

Displays notification bell icon with unread count badge:
- Shows unread count badge (red circle with number)
- Badge shows "9+" if count exceeds 9
- Navigates to `/notifications` on press
- Real-time updates via Firestore listener

### Notification Triggers

Notifications are automatically created in the following scenarios:

#### 1. Campaign Started
**Trigger**: When a campaign status changes from `draft` to `in_progress`
- **Type**: `campaign_update`
- **Recipient**: Campaign owner
- **Title**: "Campaign Started! 🚀"
- **Body**: `Your campaign "{campaign.title}" is now live and accepting donations!`
- **Data**: `{ campaignId: string }`

#### 2. Campaign Ended
**Trigger**: When an admin manually ends a campaign
- **Type**: `admin_action`
- **Recipient**: Campaign owner
- **Title**: "Campaign Ended"
- **Body**: `Your campaign "{campaign.title}" has been ended by an administrator.`
- **Data**: `{ campaignId: string, action: 'ended' }`

#### 3. Goal Reached (100%)
**Trigger**: When campaign `donatedAmount >= targetAmount` and status is `in_progress`
- **Type**: `milestone`
- **Recipient**: Campaign owner
- **Title**: "Goal Reached! 🎯"
- **Body**: `Congratulations! Your campaign "{campaign.title}" has reached its funding goal of ${targetAmount}!`
- **Data**: `{ campaignId: string }`

#### 4. New Donation Received
**Trigger**: When a donation is successfully created
- **Type**: `donation`
- **Recipients**: 
  - Campaign owner
  - Donor
- **To Campaign Owner**:
  - **Title**: "New Donation Received!"
  - **Body**: `{donorName} donated ${amount} to your campaign "{campaign.title}"`
  - **Data**: `{ campaignId: string, donationId: string }`
- **To Donor**:
  - **Title**: "Thank You for Your Donation! 💚"
  - **Body**: `Your donation of ${amount} to "{campaign.title}" has been received. You're making a real difference!`
  - **Data**: `{ campaignId: string, donationId: string }`

#### 5. Milestone Reached (25%, 50%, 75%)
**Trigger**: When a donation causes campaign to cross a milestone threshold
- **Type**: `milestone`
- **Recipient**: Campaign owner
- **Title**: "Milestone Reached! 🎉"
- **Body**: `Your campaign "{campaign.title}" has reached {milestone}% of its goal!`
- **Data**: `{ campaignId: string }`
- **Milestones**: 25%, 50%, 75% of target amount

#### 6. User Promoted to Admin
**Trigger**: When an admin promotes a user to admin role
- **Type**: `admin_action`
- **Recipient**: Promoted user
- **Title**: "Admin Access Granted"
- **Body**: `You have been promoted to administrator. You now have access to admin features.`
- **Data**: `{ action: 'promoted' }`

### Push Notification Payload Structure

When sending push notifications via Expo Push API, use this format:

```json
{
  "to": "ExponentPushToken[USER_PUSH_TOKEN]",
  "sound": "default",
  "title": "Notification Title",
  "body": "Notification message",
  "data": {
    "campaignId": "optional-campaign-id",
    "donationId": "optional-donation-id",
    "type": "donation" | "campaign_update" | "admin_action" | "milestone"
  },
  "channelId": "default"
}
```

**Important Notes**:
- Use `channelId: "default"` for Android notifications
- Include `campaignId` or `donationId` in `data` for navigation
- Get push token from `users/{userId}/pushToken` in Firestore
- Send notifications via Expo Push API: `https://exp.host/--/api/v2/push/send`

### Notification Navigation

The app automatically navigates users when they tap on notifications:

- **Campaign notifications** (`data.campaignId` exists) → `/campaign/{campaignId}`
- **Donation notifications** (`data.donationId` exists) → `/my-donations`
- **Update notifications** (`data.updateId` exists) → `/campaign/{campaignId}` (future feature)

Navigation is handled in:
- `useNotifications` hook - For push notifications
- `app/notifications.tsx` - For in-app notification list

### Notification Screen

**Location**: `app/notifications.tsx`

Features:
- Real-time list of user's notifications
- Unread/read status indicators
- Tap to navigate to related content
- Mark as read on tap
- Sorted by creation date (newest first)
- Empty state when no notifications

## 🔒 Firestore Security Rules

The application uses comprehensive security rules to protect data and ensure proper access control. Copy these rules to your Firestore Database → Rules section:

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
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      // Users can update their own profile OR admins can update any user
      allow update: if isOwner(userId) || isAdmin();
      // Users can delete their own account OR admins can delete any user (except themselves)
      allow delete: if (isOwner(userId) || isAdmin()) && request.auth.uid != userId;
    }
    
    // Campaigns collection
    match /campaigns/{campaignId} {
      allow read: if true; // Anyone can read campaigns
      allow create: if isAuthenticated();
      // Campaign owner or admin can update
      allow update: if isAuthenticated() && 
                      (isOwner(resource.data.ownerId) || isAdmin());
      // Campaign owner or admin can delete
      allow delete: if isAuthenticated() && 
                      (isOwner(resource.data.ownerId) || isAdmin());
    }
    
    // Donations collection
    match /donations/{donationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      // Admins can update/delete donations
      allow update, delete: if isAdmin();
    }
  }
}
```

**Key Security Features**:
- ✅ Authentication required for most operations
- ✅ Users can only modify their own data
- ✅ Admins have elevated permissions
- ✅ Campaigns are publicly readable but only editable by owners/admins
- ✅ Donations are immutable (only admins can modify/delete)

## 📊 Firestore Indexes

The following composite indexes are required for optimal query performance. These indexes are automatically created by Firestore when you run queries, but you can also create them manually in the Firebase Console:

### Required Indexes

#### 1. Donations Collection
**Index ID**: `CICAgJim14AK`
- **Collection**: `donations`
- **Fields Indexed**:
  - `campaignId` (Ascending)
  - `donatedAt` (Descending)
  - `__name__` (Descending)
- **Query Scope**: Collection
- **Status**: Enabled
- **Used For**: Querying donations by campaign with date sorting

#### 2. Campaigns Collection - Status Filter
**Index ID**: `CICAgOjXh4EK`
- **Collection**: `campaigns`
- **Fields Indexed**:
  - `status` (Ascending)
  - `createdAt` (Descending)
  - `__name__` (Descending)
- **Query Scope**: Collection
- **Status**: Enabled
- **Used For**: Filtering campaigns by status (e.g., active campaigns)

#### 3. Campaigns Collection - Owner Filter
**Index ID**: `CICAgJiUpoMK`
- **Collection**: `campaigns`
- **Fields Indexed**:
  - `ownerId` (Ascending)
  - `createdAt` (Descending)
  - `__name__` (Descending)
- **Query Scope**: Collection
- **Status**: Enabled
- **Used For**: Querying user's own campaigns

#### 4. Donations Collection - Donor Filter
**Index ID**: `CICAgJiUsZIK`
- **Collection**: `donations`
- **Fields Indexed**:
  - `donorId` (Ascending)
  - `donatedAt` (Descending)
  - `__name__` (Descending)
- **Query Scope**: Collection
- **Status**: Enabled
- **Used For**: Querying user's donation history

### How to Create Indexes

1. **Automatic Creation**: Firestore will prompt you to create indexes when you run queries that require them. Click the link in the error message to create them automatically.

2. **Manual Creation**:
   - Go to Firebase Console → Firestore Database → Indexes
   - Click "Add index"
   - Select the collection
   - Add fields in the correct order
   - Set sort order (Ascending/Descending)
   - Click "Create"

3. **Using Firebase CLI**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

**Note**: Indexes may take a few minutes to build. Queries will fail until indexes are ready.

## 📦 Component Architecture

### Buttons
- **PrimaryButton** - Main action button with gradient variants (primary/success/danger)
- **SecondaryButton** - Secondary/outline button for less prominent actions

### Cards
- **CampaignCard** - Campaign display with progress bar, image, and quick actions
- **DonationCard** - Donation history item with details

### Forms
- **CampaignForm** - Complete campaign creation/edit form with image upload

### Feedback Components
- **Toast** - Toast notification system with success/error variants
- **ProgressBar** - Progress indicator for campaigns
- **StatusBadge** - Status badge for campaigns (draft/in_progress/completed/ended)
- **ConfirmDialog** - Confirmation dialog for destructive actions

### Inputs
- **TextInput** - Text input with floating label, validation, and error handling
- **PasswordInput** - Password input with show/hide toggle and validation
- **SearchBar** - Search input component with icon

### Layouts
- **AuthLayout** - Authentication screen layout with background image and form card
- **DashboardLayout** - Dashboard screen layout with header, title, and navigation

### Navigation
- **FilterTabs** - Category filter tabs for campaigns
- **ProfileDropdown** - Profile dropdown menu with navigation options

### Notifications
- **NotificationBell** - Notification bell icon with badge count

### Profile
- **ProfileHeader** - Profile header with user info and stats
- **QuickActions** - Quick action buttons for profile
- **UserCampaignsSection** - User's campaigns list section

### Skeletons
- **CampaignCardSkeleton** - Loading skeleton for campaign cards

## 🎨 Design System

### Colors
- **Primary**: #ff7a5e (Peachy Pink)
- **Secondary**: #4894a8 (Teal)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Warning**: #F59E0B (Yellow)

### Usage Example
```tsx
import { TextInput } from '@/src/components/inputs';
import { PrimaryButton } from '@/src/components/buttons';
import { CampaignCard } from '@/src/components/cards';

<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  errorMessage={errors.email}
/>

<PrimaryButton
  title="Submit"
  onPress={handleSubmit}
  loading={loading}
  variant="primary"
/>

<CampaignCard
  campaign={campaign}
  onPress={() => router.push(`/campaign/${campaign.id}`)}
  onDonatePress={() => router.push(`/donate/${campaign.id}`)}
/>
```

## 🗺️ Routing Structure

### Authentication Routes
- `/login` - Login screen
- `/signup` - Signup screen
- `/email-verification` - Email verification screen
- `/forgot-password` - Password reset screen

### User Tab Routes (/(tabs))
- `/` or `/(tabs)` - Home (active campaigns)
- `/(tabs)/explore` - Explore campaigns with search
- `/(tabs)/create-campaign` - Create new campaign
- `/(tabs)/my-campaigns` - User's campaigns
- `/(tabs)/my-donations` - User's donations (hidden from tab bar)
- `/(tabs)/profile` - User profile

### Admin Tab Routes (/(admin))
- `/(admin)/dashboard` - Admin dashboard
- `/(admin)/campaigns` - Manage campaigns
- `/(admin)/users` - Manage users
- `/(admin)/donations` - View all donations (hidden from tab bar)
- `/(admin)/profile` - Admin profile

### Dynamic Routes
- `/campaign/[id]` - Campaign details
- `/campaign/edit/[id]` - Edit campaign
- `/donate/[campaignId]` - Donation form

### Other Routes
- `/settings` - App settings
- `/notifications` - Notifications list

## 🔧 Custom Hooks

### useAuth
Manages authentication state and user data
```typescript
const { user, isLoading, isAuthenticated } = useAuth();
```

### useCampaign
Manages single campaign state with real-time updates
```typescript
const { campaign, loading, error } = useCampaign(campaignId);
```

### useCampaigns
Manages campaigns list with filters and real-time updates
```typescript
const { campaigns, loading, error } = useCampaigns({
  status: 'in_progress',
  category: 'education'
});
```

### useDonations
Manages donations with filtering options
```typescript
const { donations, loading, error } = useDonations({
  campaignId: 'xxx',
  userId: 'yyy'
});
```

### useNotifications
Handles push notifications registration and navigation
```typescript
const { expoPushToken, notification } = useNotifications();
```
**Features**:
- Automatically registers device for push notifications
- Saves Expo push token to Firestore
- Listens for foreground notifications
- Handles notification tap navigation

### useUserNotifications
Manages user's in-app notifications with real-time updates
```typescript
const {
  notifications,
  unreadCount,
  loading,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = useUserNotifications(userId);
```
**Features**:
- Real-time subscription to notifications
- Automatic unread count calculation
- Mark notifications as read (single/all)
- Delete notifications

### useToast
Manages toast notification state
```typescript
const { toast, showSuccess, showError, hideToast } = useToast();
```

### useEmailVerification
Manages email verification flow
```typescript
const { isVerified, checkVerification, resendEmail } = useEmailVerification();
```

## 🛠️ Utility Functions

### Validators
- `validateEmail(email: string)` - Email validation
- `validatePassword(password: string)` - Password strength validation
- `validateAmount(amount: string)` - Donation amount validation

### Formatters
- `formatCurrency(amount: number)` - Currency formatting
- `formatDate(timestamp: number)` - Date formatting
- `formatFirebaseError(error: any)` - Firebase error formatting
- `calculateProgress(current: number, target: number)` - Progress calculation
- `calculateDaysRemaining(endDate: number)` - Days remaining calculation

### Async Handlers
- `asyncHandler<T>(promise: Promise<T>)` - Async error handling wrapper

### Image Helpers
- `getCloudinaryUrl(publicId, cloudName, options?)` - Generate Cloudinary URL with transformations
  - Supports width, height, crop, quality, and format options
  - Example: `getCloudinaryUrl('image-id', 'cloud-name', { width: 400, quality: 'auto' })`
- `getReadableFileSize(bytes: number)` - Convert bytes to human-readable format

## 👨‍💼 Admin Features

### Admin Dashboard
- **Statistics Overview**:
  - Total Users count
  - Total Campaigns count
  - Total Donations count
  - Total Amount Raised
- **Recent Donations** - Latest 5 donations
- **Quick Actions** - Quick navigation to management screens

### User Management
- View all registered users
- View user statistics (donations, campaigns)
- Promote users to admin role
- User role management

### Campaign Management
- View all campaigns (all statuses)
- Edit any campaign
- Delete campaigns
- End campaigns manually
- Filter by status and category

### Donations Overview
- View all donations across platform
- Filter by campaign, user, date
- View donation details and messages
- Monitor donation trends

### Role-Based Access Control
- Automatic routing based on user role
- Admin-only routes protected
- Firestore security rules enforce permissions
- UI elements conditionally rendered based on role

## 📚 Firebase Services

### Authentication (src/firebase/auth.ts)
- `signUp(email, password, name)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `logOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `getCurrentUser()` - Get current user data
- `updateUserProfile(userId, updates)` - Update user profile
- `checkEmailVerified()` - Check email verification status
- `resendVerificationEmail()` - Resend verification email
- `createUser(email, password, name, role)` - Admin: Create user
- `updateUser(userId, updates)` - Admin: Update user
- `deleteUser(userId)` - Admin: Delete user
- `promoteToAdmin(userId)` - Admin: Promote user to admin

### Firestore (src/firebase/firestore.ts)

#### Campaigns
- `createCampaign(campaignData)` - Create new campaign
- `getCampaign(campaignId)` - Get single campaign
- `getCampaigns(filters?)` - Get campaigns with filters
- `updateCampaign(campaignId, updates)` - Update campaign
- `deleteCampaign(campaignId)` - Delete campaign
- `startCampaign(campaignId)` - Start campaign (draft → in_progress)
- `endCampaign(campaignId)` - End campaign (admin only)
- `checkCampaignCompletion(campaignId)` - Auto-complete if goal reached
- `searchCampaigns(searchTerm)` - Search campaigns
- `subscribeToCampaign(campaignId, callback)` - Real-time campaign updates
- `subscribeToCampaigns(callback, filters?)` - Real-time campaigns list

#### Donations
- `createDonation(donationData)` - Create donation (transaction-based)
- `getCampaignDonations(campaignId, limit?)` - Get campaign donations
- `getUserDonations(userId, limit?)` - Get user donations
- `getAllDonations(limit?)` - Get all donations (admin)
- `subscribeToDonations(campaignId, callback, limit?)` - Real-time donations

#### User Statistics
- `updateUserDonationStats(userId, amount)` - Update donation stats
- `updateUserCampaignStats(userId, incrementBy)` - Update campaign stats

### Storage (src/firebase/storage.ts)

#### Cloudinary Image Upload
The app uses **Cloudinary** for image uploads and CDN delivery. All image uploads are handled client-side using unsigned upload presets.

**Functions**:
- `uploadImage(uri: string, folder: string)` - Generic image upload function
  - Uploads image to Cloudinary
  - Returns secure URL for the uploaded image
  - Handles errors and network issues
  
- `uploadProfilePicture(userId: string, imageUri: string)` - Upload user profile picture
  - Stores in: `donation-app/profiles/{userId}/`
  - Returns secure URL for profile image
  
- `uploadCampaignImage(campaignId: string, imageUri: string)` - Upload campaign image
  - Stores in: `donation-app/campaigns/{campaignId}/`
  - Returns secure URL for campaign image

**Configuration**:
- Requires `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env`
- Requires `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env`
- Upload preset must be set to **Unsigned** mode

**Image Helpers** (src/utils/imageHelpers.ts):
- `getCloudinaryUrl(publicId, cloudName, options?)` - Generate Cloudinary URL with transformations
  - Supports width, height, crop, quality, and format options
  - Useful for responsive images and optimization

**Usage Example**:
```typescript
import { uploadCampaignImage } from '@/src/firebase/storage';

// Upload campaign image
const imageUrl = await uploadCampaignImage(campaignId, imageUri);
// Returns: https://res.cloudinary.com/{cloudName}/image/upload/v{version}/donation-app/campaigns/{campaignId}/{filename}
```

## 🎯 Features Checklist

### Authentication
- [x] User registration with email/password
- [x] Email verification system
- [x] Password reset functionality
- [x] Secure authentication state management
- [x] Role-based access control

### Campaigns
- [x] Campaign browsing with filters
- [x] Campaign search functionality
- [x] Campaign details with progress tracking
- [x] Campaign creation and editing
- [x] Campaign image upload
- [x] Campaign categories
- [x] Campaign status lifecycle
- [x] Real-time campaign updates

### Donations
- [x] Donation flow with custom amounts
- [x] Anonymous donations
- [x] Donation messages
- [x] Transaction-based donation processing
- [x] Automatic campaign completion
- [x] Donation history tracking
- [x] Real-time donation updates

### User Features
- [x] User profile with statistics
- [x] Donation history
- [x] My campaigns management
- [x] Profile picture upload
- [x] User statistics tracking

### Admin Features
- [x] Admin dashboard with statistics
- [x] User management
- [x] Campaign management
- [x] Donations overview
- [x] Role promotion

### Notifications
- [x] Push notification system (Expo Notifications)
- [x] Device registration and token management
- [x] Android notification channel configuration
- [x] In-app notification system (Firestore)
- [x] Notification types (donation, campaign_update, admin_action, milestone)
- [x] Real-time notification updates
- [x] Notification navigation (deep linking)
- [x] Notification list screen
- [x] Unread count badge
- [x] Mark as read functionality
- [x] Delete notifications
- [x] Automatic notification triggers
  - Campaign started/ended
  - New donations
  - Goal reached
  - Milestone achievements (25%, 50%, 75%, 100%)
  - Admin actions

### UI/UX
- [x] Modern gradient designs
- [x] Smooth animations
- [x] Loading states and skeletons
- [x] Error handling and toasts
- [x] Form validation
- [x] Responsive design
- [x] Dark mode support
- [x] Accessibility features

## 🔒 Security

- **Firebase Authentication** - Secure user authentication
- **Firestore Security Rules** - Database access control
- **Storage Security Rules** - File upload restrictions
- **Environment Variables** - Secure configuration management
- **Input Validation** - Client-side and server-side validation
- **Role-Based Access** - Admin-only features protected
- **Transaction Safety** - Atomic operations for donations

## 🛠️ Tech Stack Details

### Frontend Framework
- **Expo SDK 54** - React Native framework for cross-platform mobile development
- **React Native 0.81.5** - Mobile app framework
- **React 19.1.0** - UI library

### Routing & Navigation
- **Expo Router 6.0.15** - File-based routing system with type-safe navigation
- **React Navigation 7.x** - Navigation library for tab and stack navigation
  - `@react-navigation/native` - Core navigation library
  - `@react-navigation/bottom-tabs` - Bottom tab navigator
  - `@react-navigation/elements` - Navigation UI elements

### Language & Type Safety
- **TypeScript 5.9.2** - Type-safe JavaScript with full type coverage
- **ESLint 9.25.0** - Code linting and quality checks
- **ESLint Config Expo** - Expo-specific ESLint configuration

### Styling
- **NativeWind 4.2.1** - Tailwind CSS for React Native
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Expo Linear Gradient** - Gradient components
- **React Native Reanimated 4.1.1** - High-performance animations
- **React Native Gesture Handler** - Native gesture handling

### Backend Services
- **Firebase 12.6.0** - Backend-as-a-Service
  - **Firebase Auth** - User authentication with email/password
  - **Cloud Firestore** - NoSQL database with real-time updates
  - **Firebase Storage** - File storage (optional, Cloudinary preferred)
- **Firebase Admin SDK 13.6.0** - Server-side Firebase operations
- **Cloudinary** - Image upload and CDN service

### Notifications
- **Expo Notifications 0.32.13** - Push notification system
  - Android notification channels
  - iOS notification handling
  - Foreground notification display

### Storage & Persistence
- **AsyncStorage 2.2.0** - Local data persistence
  - Used for Firebase Auth persistence
  - User preferences storage

### UI Components & Icons
- **@expo/vector-icons 15.0.3** - Icon library (Ionicons, MaterialIcons, etc.)
- **Expo Image 3.0.10** - Optimized image component
- **Expo Image Picker 17.0.8** - Image selection from device
- **Expo Haptics 15.0.7** - Haptic feedback

### Build & Deployment
- **EAS Build** - Expo Application Services for cloud builds
- **EAS CLI** - Command-line tools for EAS services
- **Expo Constants 18.0.10** - App configuration access
- **Expo Device 8.0.9** - Device information

### Development Tools
- **Expo Dev Client** - Custom development build
- **Metro Bundler** - JavaScript bundler
- **Babel** - JavaScript compiler
- **Prettier Plugin Tailwind** - Code formatting

### Additional Libraries
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Native screen management
- **React Native Web** - Web platform support
- **Expo Linking** - Deep linking support
- **Expo Web Browser** - In-app browser
- **Expo Status Bar** - Status bar customization
- **Expo Splash Screen** - Splash screen management
- **Expo Font** - Custom font loading
- **Expo System UI** - System UI customization

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed Firebase setup guide
- **[README.md](./README.md)** - This file (complete documentation)

## 📄 License

MIT License

---

**Built with 💜 using Expo + NativeWind + TypeScript + Firebase**

For detailed setup instructions, see [SETUP.md](./SETUP.md)
