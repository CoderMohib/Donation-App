# 🎁 Donation App - Complete Reusable Component Architecture

A **production-ready** donation platform built with **Expo Router**, **NativeWind**, **TypeScript**, and **Firebase**. Features a fully reusable component architecture with modern UI/UX.

## ✨ Key Features

- 🔐 **Complete Authentication** - Login, Signup with Firebase Auth
- 💳 **Donation System** - Make donations with custom amounts & messages
- 📊 **Campaign Management** - Browse, view details, track progress
- 👤 **User Profiles** - View donation history and stats
- 🎨 **Modern UI/UX** - Gradients, animations, floating labels
- 📱 **Fully Responsive** - Works on all screen sizes
- ♿ **Accessible** - Screen reader support
- 🔄 **Real-time Updates** - Live campaign progress

## 🏗️ Project Structure

```
Donation-App/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home/Campaigns list
│   │   ├── my-donations.tsx # User's donation history
│   │   └── _layout.tsx      # Tab layout config
│   ├── campaign/
│   │   └── [id].tsx         # Campaign details (dynamic route)
│   ├── donate/
│   │   └── [campaignId].tsx # Donation flow (dynamic route)
│   ├── login.tsx            # Login screen
│   ├── signup.tsx           # Signup screen
│   ├── profile.tsx          # User profile
│   └── _layout.tsx          # Root layout
│
├── src/
│   ├── components/          # ✅ Reusable UI Components
│   │   ├── inputs/
│   │   │   ├── TextInput.tsx
│   │   │   └── PasswordInput.tsx
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   └── SecondaryButton.tsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   └── cards/
│   │       ├── CampaignCard.tsx
│   │       └── DonationCard.tsx
│   │
│   ├── firebase/            # ✅ Firebase Integration
│   │   ├── firebase.ts      # Initialization
│   │   ├── auth.ts          # Authentication
│   │   ├── firestore.ts     # Database operations
│   │   └── storage.ts       # File uploads
│   │
│   ├── types/               # ✅ TypeScript Types
│   │   ├── User.ts
│   │   ├── Campaign.ts
│   │   └── Donation.ts
│   │
│   └── utils/               # ✅ Helper Functions
│       ├── validators.ts
│       ├── formatters.ts
│       └── asyncHandlers.ts
│
├── assets/                  # Generated images
│   ├── auth_background.png
│   └── campaign_placeholder.png
│
└── Documentation/
    ├── README.md           # This file
    ├── SETUP.md            # Firebase setup guide
    ├── COMPONENTS.md       # Component documentation
    └── QUICKSTART.md       # 5-minute quick start
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
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Run the App
```bash
npm start
# Press 'a' for Android, 'i' for iOS, 'w' for Web
```

## 📦 Reusable Components

### Input Components
- **TextInput** - Floating label, validation, error handling
- **PasswordInput** - Show/hide toggle, secure entry

### Button Components
- **PrimaryButton** - Gradient backgrounds (primary/success/danger)
- **SecondaryButton** - Outline/ghost variants

### Layout Components
- **AuthLayout** - 40% image + 60% form card
- **DashboardLayout** - Header, title, navigation

### Card Components
- **CampaignCard** - Campaign display with progress
- **DonationCard** - Donation history item

## 🎨 Design System

### Colors
- **Primary**: Purple (#7C3AED) → Pink (#EC4899)
- **Success**: Green (#4CAF50) → Teal (#14B8A6)
- **Danger**: Red (#EF4444) → Orange (#F97316)

### Usage Example
```tsx
import { TextInput } from '@/src/components/inputs';
import { PrimaryButton } from '@/src/components/buttons';

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
```

## 🔥 Firebase Collections

### users
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: number;
}
```

### campaigns
```typescript
{
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'active' | 'completed';
  createdBy: string;
}
```

### donations
```typescript
{
  id: string;
  campaignId: string;
  donorId: string;
  amount: number;
  isAnonymous: boolean;
  donatedAt: number;
}
```

## 📱 App Flow

1. **Login/Signup** → Authentication
2. **Home** → Browse campaigns
3. **Campaign Details** → View progress & donations
4. **Donate** → Make a donation
5. **My Donations** → View history
6. **Profile** → User stats

## 🛠️ Tech Stack

- **Framework**: Expo SDK 54
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for RN)
- **Language**: TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: @expo/vector-icons

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed Firebase setup
- **[COMPONENTS.md](./COMPONENTS.md)** - Component API docs
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute guide

## 🎯 Features Checklist

- [x] User authentication (login/signup)
- [x] Campaign browsing with filters
- [x] Campaign details with progress tracking
- [x] Donation flow with custom amounts
- [x] Anonymous donations
- [x] Donation messages
- [x] User profile with stats
- [x] Donation history
- [x] Real-time updates
- [x] Form validation
- [x] Error handling
- [x] Loading states
- [x] Responsive design

## 🔒 Security

- Firebase Authentication
- Firestore Security Rules
- Environment variables
- Input validation

## 📄 License

MIT License

---

**Built with 💜 using Expo + NativeWind + TypeScript + Firebase**

For detailed setup instructions, see [SETUP.md](./SETUP.md)
