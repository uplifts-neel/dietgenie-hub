
# Dronacharya The Gym - Diet Plan App Documentation

## Overview
This mobile application is designed for Dronacharya The Gym to help trainers create, manage, and share diet plans for their gym members. The app includes member registration, diet planning, fee management, and tracking functionality.

## Technology Stack
- **Frontend**: React, Tailwind CSS, Shadcn UI components
- **State Management**: React Context API
- **Routing**: React Router
- **Mobile Framework**: Capacitor
- **Data Persistence**: LocalStorage (current), Supabase (potential future integration)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Notifications**: Sonner toast library

## Core Features

### 1. Member Management
- **Registration**: Add new members with personal details
- **Search**: Find members by name or admission number
- **Profile Management**: View and update member information

### 2. Diet Plan Creation
- **Meal Planning**: Create customized meal plans for different times of day
  - Morning
  - Afternoon
  - Before Gym
  - After Gym
  - Evening
  - Night
- **Food Category Selection**: Browse food options by categories
  - Proteins
  - Carbs
  - Fats
  - Vegetables
  - Fruits
  - Supplements
- **Portion Control**: Select quantity/serving size for each meal item
- **Nutrition Tracking**: Automatic calculation of protein, carbs, and fats

### 3. Fee Management
- **Payment Tracking**: Record and manage member payments
- **Due Date Monitoring**: Track overdue payments
- **Payment History**: View payment records for each member
- **Fee Types**: Support for various payment periods
  - Monthly
  - Quarterly
  - Half-Yearly
  - Annual

### 4. History & Records
- **Diet Plan History**: View past diet plans for all members
- **Plan Pinning**: Pin important plans for quick access
- **Filtering & Search**: Find plans by member name or admission number
- **Plan Details**: View complete details of any saved plan

### 5. Sharing & Export
- **WhatsApp Sharing**: Send diet plans via WhatsApp
- **Download**: Save plans as images or PDFs
- **Print**: Print physical copies of diet plans

### 6. Gym Profile & Settings
- **Gym Information**: Manage gym profile details
- **Stats Display**: Show key gym statistics
- **Achievement Tracking**: Record and display gym achievements
- **Contact Information**: Update and display contact details

## App Navigation Structure

### Main Routes
1. **Home** (`/home`)
   - Dashboard with quick stats and actions
   - Recent diet plans and notifications
   - Quick access to main features

2. **Registration** (`/registration`)
   - Add new members
   - Search existing members
   - Update member information

3. **Diet Plan** (`/diet-plan`)
   - Create new diet plans
   - Select members
   - Choose meals for different times
   - Calculate nutritional values

4. **History** (`/history`)
   - View all saved diet plans
   - Filter and search plans
   - Edit or delete existing plans
   - Access detailed view of plans

5. **Fees** (`/fees`)
   - Record new payments
   - View payment history
   - Check overdue fees
   - Manage payment statuses

6. **Settings** (`/settings`)
   - Update gym profile
   - Manage user preferences
   - Configure app behavior

## Data Models

### Member
```typescript
{
  id: string;
  admissionNumber: string;
  name: string;
  weight?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  feeType?: string;
  admissionType?: string;
  registrationDate?: string;
}
```

### Diet Plan
```typescript
{
  id: string;
  memberId: string;
  memberName: string;
  admissionNumber: string;
  weight?: string;
  date: string;
  meals: Record<TimeSlot, MealItem[]>;
  nutrition?: NutritionSummary;
  isPinned?: boolean;
}
```

### Meal Item
```typescript
{
  name: string;
  category: string;
  quantity: string;
  mealId?: string;
}
```

### Fee
```typescript
{
  id: string;
  memberId: string;
  memberName: string;
  admissionNumber: string;
  amount: number;
  paymentDate: string;
  startDate: string;
  endDate: string;
  feeType: string;
  status: "Paid" | "Due" | "Overdue";
  createdAt: string;
}
```

### Profile
```typescript
{
  name: string;
  photo: string;
  achievements: string[];
  contactInfo?: {
    phone: string;
    instagram: string;
  };
  stats?: {
    activeMembers: number;
    trainers: number;
    operationalHoursTitle: string;
    operationalHours: string;
  };
}
```

## Context API Structure

### AppContext
The central state management system providing access to:
- Members list and operations
- Diet plans and operations
- Fee records and operations
- Gym profile data
- Utility functions for calculations

### Key Context Functions
- `addMember`: Register new gym members
- `addDietPlan`: Create new diet plans
- `updateDietPlan`: Modify existing plans
- `togglePinPlan`: Pin/unpin important plans
- `updateProfile`: Change gym profile information
- `calculateNutrition`: Calculate nutritional values from meals
- `deleteDietPlan`: Remove diet plans
- `addFee`: Record new fee payments
- `updateFeeStatus`: Change payment status
- `getDueFees`: Get list of overdue payments
- `getFeesByMemberId`: Get payment history for a member

## UI Components

### Layout Components
- `Layout`: Main app layout with navigation
- `SplashScreen`: Initial loading screen with logo

### Home Components
- `ProfileSection`: Display gym profile summary
- `NotificationSection`: Show alerts for fees and recent plans
- `QuickActions`: Buttons for primary actions
- `StatsSection`: Display gym statistics
- `ConnectSection`: Contact information panel

### Diet Plan Components
- `DietPlanMemberInfo`: Member selection for diet plans
- `DietPlanMealSelector`: Meal selection interface
- `SaveChangesButton`: Save/update diet plans
- `MealCategorySelector`: Browse foods by category
- `QuantitySelector`: Select portion sizes
- `NutritionSummary`: Display calculated nutrition values

### History Components
- `HistoryItemCard`: Display diet plan summary cards
- `PlanDetailsDialog`: Detailed view of selected plans

## Icons Used (Lucide React)
- `Home`: Main dashboard navigation
- `UserPlus`: Member registration
- `Utensils`: Diet plan creation
- `CreditCard`: Fee management
- `History`: Historical records
- `Settings`: App settings
- `Plus`: Add new items
- `Clock`: History/Time-related features
- `Edit2`: Edit functionality
- `AlertTriangle`: Notifications/Warnings
- `FileText`: Documents/Reports
- `Phone`: Contact information
- `Instagram`: Social media links
- `Users`: Member count/stats
- `Share2`: Sharing functionality
- `Download`: Download options
- `Send`: WhatsApp sharing
- `Award`: Achievements
- `User`: Profile/User representation
- `Search`: Search functionality

## Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Native-like animations and transitions
- Optimized navigation for mobile use
- Capacitor integration for native mobile capabilities

## Future Enhancement Possibilities
- **Cloud Synchronization**: Supabase integration for data storage
- **User Authentication**: Multi-trainer account support
- **Advanced Analytics**: Enhanced reporting on member progress
- **Nutrition Database**: Expanded food database with more detailed nutrition info
- **Member App**: Companion app for members to view their plans
- **Push Notifications**: Alert trainers about due fees and member milestones
- **Image Uploads**: Allow photos of members and custom meal images
- **Offline Support**: Enhanced offline functionality

## AI Prompt for Development
"Create a comprehensive mobile app for gym trainers to manage member diet plans. The app should feature member registration with unique admission numbers, a diet plan creator with meal timing options and food categories, nutrition calculation, fee management system for tracking payments, and a history section for saved plans. Include sharing capabilities via WhatsApp and download options. The UI should be dark-themed with gradient accents in coral-red and turquoise, featuring glass-card elements for a modern look. Optimize for mobile use with Capacitor, ensuring all interactions are touch-friendly and animations enhance usability."

