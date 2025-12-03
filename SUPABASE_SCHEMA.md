# Supabase Schema Setup Guide

This guide explains how to set up the Supabase database schema for the Starcast Media Employee Portal.

## Prerequisites

- Access to your Supabase project: https://ytepzyundsauhctalwgw.supabase.co
- Admin permissions to run SQL queries

## Tables Overview

### 1. **employees**
Stores employee profile information
- `id`: Unique identifier (UUID)
- `user_id`: References the authenticated user
- `first_name`, `last_name`: Employee name
- `email`: Employee email address
- `role`: Job title/position
- `department`: Department name
- `phone`: Contact number
- `avatar_url`: Profile picture URL
- `status`: Employment status (active, inactive, on-leave, etc.)
- `hire_date`: Start date of employment
- `created_at`, `updated_at`: Timestamps

### 2. **timesheets**
Tracks work hours and time entries
- `id`: Unique identifier (UUID)
- `user_id`: References the employee
- `date`: Date of the timesheet entry
- `hours_worked`: Number of hours worked (0-24)
- `notes`: Optional notes about the work
- `status`: Approval status (pending, approved, rejected)
- `created_at`, `updated_at`: Timestamps
- **Constraint**: One entry per user per day (UNIQUE on user_id, date)

### 3. **documents**
Manages company documents and files
- `id`: Unique identifier (UUID)
- `user_id`: Document owner
- `name`: Document title
- `description`: Document summary
- `file_path`: Storage path in Supabase Storage
- `file_size`: Size in bytes
- `file_type`: MIME type (pdf, docx, etc.)
- `document_type`: Category (handbook, contract, tax-form, etc.)
- `visibility`: Access level (private, team, public)
- `created_at`, `updated_at`: Timestamps

### 4. **teams**
Represents team groups within the organization
- `id`: Unique identifier (UUID)
- `name`: Team name
- `description`: Team description
- `created_by`: User who created the team
- `created_at`, `updated_at`: Timestamps

### 5. **team_members**
Junction table for team membership
- `id`: Unique identifier (UUID)
- `user_id`: Team member reference
- `team_id`: Team reference
- `role`: Role within the team
- `joined_at`: When they joined the team
- **Constraint**: One membership per user per team (UNIQUE on user_id, team_id)

## How to Apply the Schema

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ytepzyundsauhctalwgw

# Run the migration
supabase db push
```

### Option 3: Individual SQL Execution

Execute the SQL sections in this order:
1. Extensions (uuid-ossp)
2. Table creation (employees, timesheets, documents, teams, team_members)
3. Indexes (for performance)
4. RLS configuration

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### Employees Table
- ✅ Users can view their own profile
- ✅ Users can view team members if in the same team
- ✅ Users can update their own profile

### Timesheets Table
- ✅ Users can only view, insert, update, and delete their own timesheets
- ✅ Fully restricted to the user's data

### Documents Table
- ✅ Users can view their own documents
- ✅ Public documents are visible to everyone
- ✅ Users can only manage their own documents

### Teams Table
- ✅ Users can view teams they created
- ✅ Users can view teams they're members of

### Team Members Table
- ✅ Users can view team members in their teams
- ✅ Users can only view their own membership

## Next Steps

After applying the schema:

1. **Test the schema**: Go to **Table Editor** in Supabase to verify all tables are created
2. **Configure Storage**: Set up a storage bucket for documents:
   - Create a bucket named `documents`
   - Enable public access if needed
   - Set RLS policies for document access
3. **Test Authentication**: Create a test user account via the app's signup
4. **Verify RLS**: Test that RLS policies work correctly
5. **Create Initial Data**: Add sample employees and teams for testing

## Storage Bucket Setup

Create a storage bucket for documents:

```sql
-- In Supabase Storage settings, create a new bucket:
Bucket name: documents
Public: false (or true if you want public access)
```

Then set up RLS policies for the bucket to match the documents table policies.

## Important Notes

⚠️ **Production Considerations:**
- Always test RLS policies thoroughly before going live
- Consider adding audit logs for sensitive operations
- Implement proper backup strategies
- Monitor database performance and add indexes as needed
- Use environment variables for sensitive operations

## Troubleshooting

### "Extensions don't exist"
- The `uuid-ossp` extension may already be enabled. Skip this step if you get an error.

### RLS Policies not working
- Make sure RLS is actually enabled: Check in the Supabase dashboard under Table Settings
- Verify `auth.uid()` is returning the correct user ID
- Test with SQL queries first before using the app

### Permission Denied errors
- Check that RLS policies exist for all operations (SELECT, INSERT, UPDATE, DELETE)
- Verify the authenticated user has the correct auth.uid()

## Support

For issues with the schema or RLS policies, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
