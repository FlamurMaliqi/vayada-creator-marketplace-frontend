# Vayada Creator Marketplace - Project Structure

This document outlines the clean, modular structure of the Vayada creator marketplace project.

## 📁 Directory Structure

```
vayada-creator-marketplace/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   └── [routes]/                # Future route pages
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   └── index.ts
│   │
│   ├── layout/                  # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   │
│   └── landing/                 # Landing page components
│       ├── hero/
│       │   ├── Hero.tsx
│       │   └── index.ts
│       ├── hotels/
│       │   ├── HotelsSection.tsx
│       │   └── index.ts
│       ├── creators/
│       │   ├── CreatorsSection.tsx
│       │   └── index.ts
│       ├── how-it-works/
│       │   ├── HowItWorks.tsx
│       │   └── index.ts
│       └── index.ts
│
├── lib/                         # Shared libraries
│   ├── types/                   # TypeScript types
│   │   ├── index.ts            # Core domain types
│   │   └── user.ts             # User-specific types
│   │
│   ├── constants/               # Application constants
│   │   ├── routes.ts           # Route definitions
│   │   ├── sections.ts         # Section IDs
│   │   ├── content.ts          # Content constants
│   │   └── index.ts            # Barrel export
│   │
│   ├── utils/                   # Utility functions
│   │   └── index.ts            # Helper functions
│   │
│   └── index.ts                 # Main library export
│
├── hooks/                       # Custom React hooks
│   ├── useScrollTo.ts
│   └── index.ts
│
├── services/                    # Business logic & API services
│   ├── api/                     # API services
│   │   ├── client.ts           # API client
│   │   ├── hotels.ts           # Hotel API
│   │   ├── creators.ts         # Creator API
│   │   └── index.ts
│   │
│   └── auth/                    # Authentication services
│       ├── auth.ts
│       └── index.ts
│
├── config/                      # Configuration files
│   └── site.ts                  # Site configuration
│
├── styles/                      # Global styles
│   └── variables.css            # CSS variables
│
└── public/                      # Static assets
    └── [assets]
```

## 🏗️ Architecture Principles

### 1. **Feature-Based Organization**
Components are organized by feature/domain rather than by type:
- `components/landing/` - All landing page components
- `components/layout/` - Layout components
- `components/ui/` - Reusable UI primitives

### 2. **Separation of Concerns**
- **Components**: UI presentation only
- **Services**: Business logic and API calls
- **Hooks**: Reusable stateful logic
- **Types**: Type definitions
- **Constants**: Configuration and content

### 3. **Barrel Exports**
Each directory has an `index.ts` file for clean imports:
```typescript
// Instead of:
import { Button } from '@/components/ui/Button'

// Use:
import { Button } from '@/components/ui'
```

### 4. **Type Safety**
All components and functions are typed with TypeScript:
- Domain types in `lib/types/`
- Component props interfaces
- API response types

## 📦 Key Directories Explained

### `/components`
- **ui/**: Reusable, generic UI components (Button, Input, Card, etc.)
- **layout/**: Layout components (Navigation, Footer, Sidebar)
- **landing/**: Feature-specific components for landing page

### `/lib`
- **types/**: TypeScript type definitions
- **constants/**: Application constants (routes, content, config)
- **utils/**: Pure utility functions

### `/services`
- **api/**: API service layer for backend communication
- **auth/**: Authentication and authorization logic

### `/hooks`
Custom React hooks for reusable stateful logic

### `/config`
Application configuration (site metadata, feature flags, etc.)

## 🔄 Adding New Features

### Adding a New Page
1. Create route in `app/[route]/page.tsx`
2. Create components in `components/[feature]/`
3. Add route to `lib/constants/routes.ts`
4. Export from appropriate barrel file

### Adding a New Component
1. Create component file in appropriate feature directory
2. Add to barrel export (`index.ts`)
3. Import using barrel export

### Adding a New API Service
1. Create service file in `services/api/`
2. Use `apiClient` from `services/api/client.ts`
3. Export from `services/api/index.ts`

### Adding New Types
1. Add to appropriate file in `lib/types/`
2. Export from `lib/types/index.ts`

## 🎯 Best Practices

1. **Always use barrel exports** for cleaner imports
2. **Keep components small and focused** - one responsibility
3. **Use TypeScript** for all new code
4. **Follow naming conventions**:
   - Components: PascalCase
   - Files: PascalCase for components, camelCase for utilities
   - Directories: kebab-case
5. **Document complex logic** with JSDoc comments
6. **Keep constants centralized** in `lib/constants/`

## 🚀 Future Additions

This structure supports easy addition of:
- Authentication pages (`app/auth/`)
- Dashboard pages (`app/hotel/`, `app/creator/`)
- Admin panel (`app/admin/`)
- API routes (`app/api/`)
- Database models (`lib/models/`)
- Validation schemas (`lib/validations/`)
- Middleware (`middleware.ts`)

