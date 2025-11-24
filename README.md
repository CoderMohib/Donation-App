# 🎁 Donation App - Complete Reusable Component Architecture

A **production-ready** donation platform built with **Expo Router**, **NativeWind**, **TypeScript**, and **Firebase**. Features a fully reusable component architecture with modern UI/UX, real-time updates, admin dashboard, and push notifications.

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
│   │   ├── useToast.ts             # Toast notifications hook
│   │   ├── useEmailVerification.ts # Email verification hook
│   │   └── index.ts                # Hook exports
│   │
│   ├── types/                      # TypeScript Type Definitions
│   │   ├── User.ts                 # User interface
│   │   ├── Campaign.ts             # Campaign interface
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
│       └── notifications.ts        # Notification service
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
│   └── reset-project.js
│
├── app.json                        # Expo configuration
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

### 3. Run the App
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
- **Firebase Storage** - Image uploads
- Campaign images
- Profile pictures
- Image optimization

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
    action?: string;             // Action type
  };
  read: boolean;                  // Read status
  createdAt: number;             // Creation timestamp
}
```

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
- Image upload utilities
- Image optimization functions

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
- Image upload functions
- Profile picture upload
- Campaign image upload

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
- [x] Push notification system
- [x] Notification registration
- [x] Notification navigation
- [x] Notification list screen

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

## 🛠️ Tech Stack

- **Framework**: Expo SDK 54
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Notifications**: Expo Notifications
- **Icons**: @expo/vector-icons
- **Animations**: React Native Reanimated
- **State Management**: React Hooks

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed Firebase setup guide
- **[README.md](./README.md)** - This file (complete documentation)

## 📄 License

MIT License

---

**Built with 💜 using Expo + NativeWind + TypeScript + Firebase**

For detailed setup instructions, see [SETUP.md](./SETUP.md)
