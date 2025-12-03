# Quick Schema Setup Guide

## ⚡ Fastest Way (Copy & Paste - 2 minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://app.supabase.com/project/ytepzyundsauhctalwgw

Click **SQL Editor** in the left sidebar

### Step 2: Create New Query
Click **New Query** (top right)

### Step 3: Copy the Schema
Open the file `supabase-schema.sql` in this editor and copy ALL the SQL code

### Step 4: Paste & Run
- Paste the SQL into the Supabase editor
- Click the **Run** button (green play icon)
- Wait for completion (usually takes 10-30 seconds)

### Step 5: Verify
Go to **Table Editor** and you should see these new tables:
- ✅ employees
- ✅ timesheets
- ✅ documents
- ✅ teams
- ✅ team_members

---

## 🔧 Using Supabase CLI (Alternative)

If you prefer command line:

```bash
# Install Supabase CLI (one time)
npm install -g @supabase/cli

# Link your project
supabase link --project-ref ytepzyundsauhctalwgw

# Apply schema
supabase db push
```

---

## 📋 What Gets Created

### Tables (5 total)
- **employees** - Employee profiles and info
- **timesheets** - Work hours tracking
- **documents** - File management
- **teams** - Team groups
- **team_members** - Team memberships

### Security
- ✅ Row Level Security (RLS) on all tables
- ✅ User data isolation
- ✅ Team visibility policies
- ✅ Document sharing controls

### Performance
- ✅ Optimized indexes
- ✅ Unique constraints
- ✅ Foreign key relationships

---

## 🆘 Troubleshooting

**Q: I got an error in the SQL?**
A: Copy just the first few CREATE TABLE statements and run those first. Then run the rest.

**Q: Can I see what's being created?**
A: Yes! Open `supabase-schema.sql` in this editor to see all the SQL.

**Q: How do I test if it worked?**
A: In Supabase, click **Table Editor** and you should see the 5 new tables.

**Q: Do I need to set something up in my app?**
A: Not yet! The `.env.local` is already configured with your Supabase keys.

---

## ✅ Next Steps

Once the schema is applied:

1. **Start the dev server**: `npm run dev`
2. **Create a test account**: Use the app's signup
3. **Check the tables**: Verify data appears in Supabase
4. **Build & deploy**: `npm run build` then push to Netlify

Your app is ready to use once the schema is in place!
