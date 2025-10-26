# DevConnect Frontend Setup Guide

## For Collaborators

### Initial Setup (First Time)

1. **Clone the repository**
   ```bash
   git clone https://github.com/i-ssa/dev_connect_frontend.git
   cd dev_connect_frontend
   ```

   Or if you forked it:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dev_connect_frontend.git
   cd dev_connect_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including:
   - React
   - React Router DOM
   - Vite
   - All dev dependencies

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

### Daily Development Workflow

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Install any new dependencies** (if package.json was updated)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Project Structure

```
devconnect_frontend/
├── src/
│   ├── components/       # React components (Navbar, Footer, etc.)
│   ├── styles/          # All CSS files (centralized)
│   ├── assets/          # Images, logos, static files
│   ├── pages/           # Page components (to be created)
│   ├── data/            # Data files
│   ├── App.jsx          # Main app component with routing
│   ├── App.css          # Global app styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Public static files
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **React** (v19.1.1)
- **React Router DOM** (for routing)
- **Vite** (build tool & dev server)
- **ESLint** (code linting)

### Important Notes

- All CSS files are in the `src/styles/` folder for better organization
- Logo file is in `src/assets/devconnectlogo.png`
- Routing is set up with placeholder pages - actual page components need to be created

### Troubleshooting

**If you get dependency errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**If the dev server won't start:**
- Make sure port 5173 is not already in use
- Try `npm run dev -- --port 3000` to use a different port

**If you see old cached assets:**
- Hard refresh your browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
