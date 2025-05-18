# MeetSpace - Virtual Meeting Platform

A modern, feature-rich virtual meeting platform built with Next.js, Supabase, and WebRTC. Includes AI-powered meeting assistance, breakout rooms, and accessibility features.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── meeting/          # Meeting room features
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── meeting/          # Meeting-specific components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Global state management
├── supabase/             # Database migrations
└── types/                # TypeScript definitions
```

## Key Configuration Files

- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS theme and plugins
- `components.json`: shadcn/ui configuration
- `artillery.yml`: Load testing configuration
- `.github/workflows/ci.yml`: CI/CD pipeline

## Core Features

### Authentication
Entry Point: `app/auth/`
- Email/password authentication
- Protected routes
- Session management

### Dashboard
Entry Point: `app/dashboard/page.tsx`
- Meeting management
- Quick join functionality
- Meeting history

### Meeting Room
Entry Point: `app/meeting/[id]/page.tsx`
- Real-time video/audio
- Screen sharing
- Chat system
- AI assistant
- Breakout rooms

### AI Features
Entry Points:
- `hooks/useAIHelper.ts`: Meeting analysis
- `hooks/useInterestAnalysis.ts`: Group sorting
- `components/meeting/AIHelper.tsx`: UI integration

## Component Dependencies

### Meeting Room Components
```
VideoGrid
├── VideoTile
└── ControlBar
    ├── SettingsPanel
    └── AIHelper

ChatPanel
├── MessageItem
└── AIHelper

BreakoutRooms
└── useBreakoutRooms (store)
```

### Layout Components
```
MainLayout
├── Navbar
└── Footer
```

## State Management

- `useAuth`: Authentication state
- `useBreakoutRooms`: Breakout room management
- `useCalmMode`: Focus mode settings
- `useSettings`: User preferences

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run load tests
npm run test:load

# Build for production
npm run build
```

## Testing

- Load Testing: Artillery.io configuration in `artillery.yml`
- Accessibility: Automated WCAG 2.2 checks
- Performance: Lighthouse audits in CI/CD

## Database

Supabase handles:
- User authentication
- Meeting data
- Chat messages
- Performance metrics

## Deployment

Automated deployment pipeline:
1. GitHub Actions trigger
2. Lighthouse audit
3. Netlify deployment
4. Discord notifications

## Environment Variables

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ANTHROPIC_API_KEY=
```

## Security Features

- Row Level Security (RLS)
- End-to-end encryption
- Protected API routes
- CORS configuration

## Accessibility

- WCAG 2.2 compliance
- Automated accessibility checks
- Color contrast validation
- Screen reader support

## Performance Optimization

- Code splitting
- Image optimization
- Lazy loading
- Cache management