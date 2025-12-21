# JunkHub Frontend

Modern, responsive web application for JunkHub - A marketplace platform for buying and selling junk items.

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (default: `http://localhost:5000`)

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will start on `http://localhost:5173`

## Features

### User Roles

#### 👤 User (Customer)

- Browse shops and products
- Add items to cart
- Place orders
- Track order status
- Chat with shop owners
- Write product reviews
- Manage profile

#### 🏪 Owner (Business)

- **Registration requires admin approval**
- Create and manage shops
- Add and manage products (requires admin approval)
- View and manage orders
- Chat with customers
- Upload profile pictures
- View business analytics

#### 👨‍💼 Admin

- Approve/reject owner accounts
- Approve/reject products
- Manage users and owners
- View platform statistics
- Manage all products
- Platform-wide controls

## Application Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Select.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── lib/             # API and utility functions
│   │   ├── api.js       # HTTP client wrapper
│   │   ├── auth.js      # Authentication functions
│   │   └── admin.js     # Admin API functions
│   ├── routes/          # Page components
│   │   ├── Admin/       # Admin dashboard pages
│   │   ├── Authenticated/ # User pages
│   │   ├── Landing/     # Landing page
│   │   ├── Login/       # Login pages
│   │   ├── Owner/       # Owner dashboard pages
│   │   └── SignUp.jsx   # Registration page
│   ├── App.jsx          # Route configuration
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
└── package.json
```

## Routes

### Public Routes

- `/` - Landing page
- `/login/user` - User login
- `/login/owner` - Owner login
- `/signup/user` - User registration
- `/signup/owner` - Owner registration
- `/admin/login` - Admin login

### User Routes (Authenticated)

- `/dashboard` - User dashboard
- `/profile` - User profile
- `/shop` - Browse shops
- `/shop/:id` - Shop details
- `/products` - Browse products
- `/products/:id` - Product details
- `/cart` - Shopping cart

### Owner Routes (Authenticated + Approved)

- `/owner/dashboard` - Owner dashboard
- `/owner/products` - Manage products
- `/owner/orders` - Manage orders
- `/owner/profile` - Owner profile

### Admin Routes (Authenticated)

- `/admin/dashboard` - Admin dashboard
- `/admin/owners` - Owner management
- `/admin/products` - Product management
- `/admin/users` - User management
- `/admin/profile` - Admin profile

## Key Features

### Authentication System

- JWT-based authentication with HTTP-only cookies
- Role-based access control (User, Owner, Admin)
- Protected routes with automatic redirection
- Owner approval workflow (pending → approved)

### Owner Approval Flow

1. Owner registers account
2. Account is created with `approved: false`
3. User sees "Registration Successful - Pending Approval" message
4. Admin reviews and approves/rejects account
5. Once approved, owner can log in and access dashboard

### Product Approval Flow

1. Owner creates product
2. Product status: `pending`
3. Admin reviews and approves/rejects
4. Approved products appear in marketplace

### Profile Pictures

- Users, owners, and admins can upload profile pictures
- Base64 image support
- Automatic fallback to initials if no picture

### Responsive Design

- Mobile-first approach
- TailwindCSS utility classes
- Modern UI with smooth animations
- Optimized for all screen sizes

## Components

### Modal

Reusable modal component for dialogs and forms

### ProtectedRoute

Route guard that checks authentication and role permissions

- Redirects unapproved owners to home page
- Blocks unauthenticated users

### Select

Styled select dropdown component

### Navbar

Navigation bar with role-specific menus

## State Management

### AuthContext

Global authentication state:

- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Auth status
- `role` - User role (user/owner/admin)
- `login()` - Login function
- `logout()` - Logout function

## API Integration

All API calls go through `/lib/api.js` which:

- Handles authentication token automatically
- Provides error handling
- Manages HTTP-only cookies
- Base URL from environment variable

## Styling

### TailwindCSS

- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Responsive design utilities
- Custom color palette

### Design System

- Consistent spacing and sizing
- Predefined color schemes per role:
  - **User**: Orange/Amber tones
  - **Owner**: Indigo/Purple tones
  - **Admin**: Blue tones
- Smooth transitions and hover effects

## Build and Deployment

```bash
# Create production build
npm run build

# Output will be in /dist directory
# Deploy /dist folder to your hosting service
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The frontend expects the backend API to be running at `http://localhost:5000`
- All API endpoints are prefixed with `/api`
- Profile pictures are stored as base64 strings
- Owner accounts cannot access dashboard until approved by admin
- Products require admin approval before appearing in marketplace
