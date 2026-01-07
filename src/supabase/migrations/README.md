# Supabase Database Setup for Real-Time Live Chat

## Setup Instructions

To enable the real-time live chat feature in the Community section, you need to create the `live_chat_messages` table in your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project (`wjasfbzealvvmtybcmtw`)

2. **Open the SQL Editor**
   - In the left sidebar, click on "SQL Editor"

3. **Run the Migration**
   - Copy the contents of `create_live_chat_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the SQL

4. **Enable Realtime (if not already enabled)**
   - Go to "Database" → "Replication" in the left sidebar
   - Make sure "supabase_realtime" publication is enabled
   - The table should appear in the list after running the migration

### What This Creates

The migration creates:
- ✅ A `live_chat_messages` table to store all chat messages
- ✅ Row Level Security policies for secure access
- ✅ Real-time subscriptions enabled
- ✅ Proper indexes for performance

### Verification

After running the migration, you can verify it worked by:
1. Going to "Table Editor" in Supabase
2. Looking for the `live_chat_messages` table
3. Testing the live chat in the Community → Live Chat tab

### Table Structure

```sql
live_chat_messages
  - id (bigserial, primary key)
  - user_id (text)
  - author (text)
  - content (text)
  - avatar (text)
  - created_at (timestamp with time zone)
```

## Troubleshooting

If the real-time feature doesn't work:
1. Check that the table was created successfully
2. Verify real-time is enabled for the table in Database → Replication
3. Make sure you're logged in to send messages
4. Check the browser console for any errors
