# Starcast Media Employee Portal

A modern, secure employee management portal built with Vite, React, TypeScript, and Supabase.

## Features

✅ **Authentication System**
- User signup and login with Supabase
- Protected routes - unauthenticated users redirected to login
- Session management and logout functionality
- Email-based authentication

✅ **Dark Theme UI**
- Modern dark mode with Tailwind CSS
- Responsive design for all devices
- Smooth animations and transitions
- Blue accent colors for brand consistency

✅ **Employee Dashboard**
- Personalized welcome message with user email
- Quick access to all employee features
- Getting started guide for new employees

✅ **Core Features**
- **Settings**: Update profile information
- **Timesheet**: Track work hours (ready for integration)
- **Team**: View team members (ready for Supabase integration)
- **Documents**: Access company resources (ready for file storage)

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **UI Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **HTTP Client**: Axios
- **Database**: Supabase (PostgreSQL)

## Quick Start

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions to:
- Deploy to Vercel
- Configure custom domain (`employee.starcast.only`)
- Set up Supabase CORS
- Configure DNS records

Quick steps:
```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Side menu navigation
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/           # React Context for state management
│   └── AuthContext.tsx # Authentication state and logic
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Settings.tsx    # User settings
│   ├── Team.tsx        # Team members
│   ├── Timesheet.tsx   # Time tracking
│   └── Documents.tsx   # Document management
├── lib/                # Utility functions
│   └── supabase.ts     # Supabase client setup
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from your [Supabase Dashboard](https://app.supabase.com):
1. Go to Settings → API
2. Copy your Project URL and anon public key

## Authentication

The app uses Supabase Authentication with:
- Email signup validation
- Password confirmation on signup
- Session persistence
- Automatic logout capability
- Protected routes for authenticated users only

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For detailed deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
