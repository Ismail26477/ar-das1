# How to Start Your Server and Frontend

Your project is a **Vite + React** application with **Supabase** backend.

## Quick Start (Copy & Paste)

### Step 1: Open Terminal and Navigate to Project

```bash
cd ar-das1
```

### Step 2: Install Dependencies (First Time Only)

```bash
pnpm install
```

OR if you don't have pnpm installed:
```bash
npm install
```

### Step 3: Start the Development Server

```bash
pnpm dev
```

OR:
```bash
npm run dev
```

You should see output like:
```
VITE v5.4.19  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 4: Open in Browser

1. Open your browser
2. Visit: **http://localhost:5173/**
3. You should see the dashboard

---

## Full Terminal Commands (Copy & Paste Everything)

If you want to run everything at once, open your terminal and paste this:

```bash
# Navigate to project
cd ar-das1

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Then open: **http://localhost:5173/**

---

## If You Get Errors

### Error: "pnpm not found"
Install pnpm first:
```bash
npm install -g pnpm
```

Then run:
```bash
pnpm install
pnpm dev
```

### Error: "Port 5173 is already in use"
Kill the process using that port:

**Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5173 | xargs kill -9
```

Then restart:
```bash
pnpm dev
```

### Error: "Cannot find module @supabase/supabase-js"
Run:
```bash
pnpm install
pnpm dev
```

---

## Project Structure

```
ar-das1/
├── src/
│   ├── pages/          # Your dashboard pages (Products, Orders, Customers)
│   ├── components/     # UI components
│   ├── hooks/          # Custom hooks (useSupabase, useDatabase)
│   ├── integrations/   # Supabase setup
│   └── App.tsx         # Main app component
├── package.json        # Project dependencies
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── .env               # Environment variables (Supabase credentials)
```

---

## What Gets Started

When you run `pnpm dev`:

✅ **Frontend Server** - Vite dev server at http://localhost:5173/
✅ **Database Connection** - Connected to your Supabase
✅ **Hot Module Reload** - Changes auto-reload in browser
✅ **API Integration** - Supabase queries work

---

## Verify Everything Works

After starting the server:

1. **Check console for errors** - Open DevTools (F12) → Console
2. **Products page** - Visit http://localhost:5173/products
3. **Look for products** - Should see: GoPro Hero 12, Sony WH-1000XM5, etc.
4. **Check console logs** - Should see: `[v0] Products data: Array(...)`

---

## Development Workflow

```bash
# Start development server
pnpm dev

# While server is running, open new terminal for other commands:

# Run linter
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Stop the Server

Press `Ctrl + C` in the terminal to stop the server.

---

## Environment Variables (.env)

Your project needs these variables in `.env` file:

```
VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already in your `.env` file, so you don't need to add them.

---

## Troubleshooting Checklist

- [ ] Terminal shows "VITE v5.4.19 ready in XXX ms"
- [ ] Console shows no red errors (warning are OK)
- [ ] Page loads at http://localhost:5173/
- [ ] Products appear on Products page
- [ ] Console shows `[v0] Products data: Array(...)` when loading

If all checks pass ✅, everything is working!

---

## That's It!

Your server and frontend are now running. The Supabase backend is automatically connected.

**Just run:** `pnpm dev`

**Then visit:** http://localhost:5173/
