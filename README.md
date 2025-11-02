# Warehouse Management Frontend - React Application

A modern, responsive web application built with React and TypeScript for managing warehouse inventory. This frontend provides an intuitive interface for managing categories, items, and users with real-time updates and a clean, professional design.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Components Overview](#-components-overview)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Styling](#-styling)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Contributing](#-contributing)

## ✨ Features

- **🔐 User Authentication**: Secure login/logout with JWT token management
- **📊 Dashboard**: **TBD**
- **📦 Category Management**: Create, edit, delete, and organize product categories
- **🏷️ Item Management**: Complete CRUD operations for inventory items

## 🛠 Tech Stack

### Core Technologies
- **React 19.1.1**
- **TypeScript 5.8.3**
- **Vite 7.1.0**

### UI & Styling
- **Material-UI (MUI) 7.3.1**

### State & Data Management
- **Zustand 5.0.8**
- **TanStack Query 5.87.4**
- **Axios 1.11.0**

### Routing & Navigation
- **React Router DOM 7.8.0**

### Additional Libraries
- **React Toastify 11.0.5**
- **MUI Color Input 7.0.0**
- **clsx 2.1.1**

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js 18.0+** or higher
- **npm 9.0+** or **yarn 1.22+**
- **Backend API** running (Spring Boot warehouse management API)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

2. **Update Environment Variables**
   Edit `.env` file with your configuration:
   ```bash
   # Backend API URL (update port and version as needed)
   VITE_BACKEND_URL=http://localhost:8080/api

   # Application Name
   VITE_APP_NAME=Warehouse Management System
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Preview Production Build

**TBD**

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Category/           # Category-related components
│   │   ├── CategoryCard/
│   │   ├── CategoryForm/
│   │   ├── CategoryTable/
│   │   └── CreateCategoryCard/
│   ├── Item/              # Item management components
│   │   ├── ItemForm/
│   │   └── ItemTable/
│   ├── Navbar/            # Navigation component
│   ├── Table/             # Generic table components
│   │   ├── EntityTable/
│   │   └── PaginatedTable/
│   └── ConfirmationDialog/ # Reusable confirmation dialog
├── pages/                 # Page components (routes)
│   ├── Dashboard/         # Main dashboard
│   ├── Login/            # Authentication page
│   ├── CategoryManagement/ # Category management page
│   ├── ItemManagement/   # Item management page
│   ├── UserManagement/   # User management page
│   └── Explore/          # Exploration/search page
├── queries/              # TanStack Query hooks
│   ├── CategoryQueries/
│   └── ItemQueries/
├── store/               # Zustand state management
│   └── AuthStore/       # Authentication store
├── types/               # TypeScript type definitions
│   ├── category.ts
│   ├── item.ts
│   └── login.ts
├── utils/               # Utility functions
│   └── useDebouncedValue.ts
├── api.ts               # API client configuration
├── config.ts           # Environment configuration
├── routers.tsx         # Route definitions
└── theme.ts            # Material-UI theme configuration
```

## 🧩 Components Overview

### Core Components

#### Authentication & Navigation
- **Login**: User authentication with form validation
- **Navbar**: Main navigation with user menu and logout

#### Category Management
- **CategoryCard**: Individual category display card
- **CategoryForm**: Create/edit category form with validation
- **CategoryTable**: Data table with sorting and filtering
- **CreateCategoryCard**: Quick category creation interface

#### Item Management
- **ItemForm**: Comprehensive item creation/editing form
- **ItemTable**: Advanced item listing with category associations

#### Generic Components
- **PaginatedTable**: Reusable table with pagination, sorting, and filtering
- **ConfirmationDialog**: Modal for confirming destructive actions
- **EntityTable**: Base table component for consistent data display

## 🏪 State Management

### Authentication Store (Zustand)
```typescript
// Global authentication state
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  login: (credentials) => { /* ... */ },
  logout: () => { /* ... */ },
  checkAuth: () => { /* ... */ }
}))
```

### Server State (TanStack Query)
- **Caching**: Automatic caching of API responses
- **Background Updates**: Automatic refetching and synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Error Handling**: Centralized error management

## 🔌 API Integration

### API Client Configuration
```typescript
// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Query Hooks Examples
```typescript
// Category queries
const useCategoriesQuery = () => useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories
});

// Item mutations
const useCreateItemMutation = () => useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    queryClient.invalidateQueries(['items']);
  }
});
```

## 🧪 Features Walkthrough

### Dashboard
- TBD

### Category Management
- Visual category cards with color coding
- Inline editing and quick actions
- Hierarchical category organization

### Item Management
- Advanced filtering and search
- Category associations with visual indicators

### User Management
- Role-based access control
- User profile management
- Activity monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with proper prop types
- **Hooks**: Custom hooks for reusable logic
- **Styling**: Use MUI components with consistent theme
- **Testing**: Add tests for new components and utilities

### File Naming Conventions
- **Components**: PascalCase (e.g., `CategoryCard/index.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useCategories.ts`)
- **Types**: camelCase with `.ts` extension (e.g., `category.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Issues**
```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Verify environment variables
echo $VITE_BACKEND_URL
```

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

**Authentication Problems**
- Check if JWT token is stored in localStorage
- Verify token expiration
- Confirm backend authentication endpoints

---

**Note**: This frontend application requires a backend API as well as a sql database to be running. Make sure to set up and configure the backend before using this application.