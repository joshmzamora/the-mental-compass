# Live Chat Database Setup Instructions

The live chat feature requires a database table in Supabase. Follow these steps to set it up:

## Option 1: Using the Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Create the live_chat_messages table for real-time chat functionality
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read messages
CREATE POLICY "Anyone can read chat messages"
  ON live_chat_messages
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create policy to allow authenticated users to insert messages
CREATE POLICY "Authenticated users can insert chat messages"
  ON live_chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create an index on created_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_live_chat_messages_created_at 
  ON live_chat_messages(created_at);

-- Enable real-time for this table
ALTER PUBLICATION supabase_realtime ADD TABLE live_chat_messages;

-- Add a comment
COMMENT ON TABLE live_chat_messages IS 'Stores real-time chat messages for the community live chat feature';
```

5. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
6. You should see a success message
7. The live chat will now work with real-time updates!

## Option 2: Using the Table Editor

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** in the left sidebar
3. Click **New Table**
4. Configure the table:
   - **Name**: `live_chat_messages`
   - **Columns**:
     - `id` (int8, primary key, auto-increment)
     - `user_id` (text, required)
     - `author` (text, required)
     - `content` (text, required)
     - `avatar` (text, required)
     - `created_at` (timestamptz, default: now())
5. Enable **Row Level Security** in the table settings
6. Add the policies manually using the policies tab
7. Go to **Database** → **Replication** and enable real-time for the table

## Verifying the Setup

1. Go to the Community page on your website
2. Navigate to the **Live Chat** tab
3. Try sending a message
4. If you see "Message sent!" without "(Local mode)" in the toast, it's working!
5. Open the page in another browser/window while logged in as a different user to test real-time updates

## Troubleshooting

- **"Database table not found" error**: The table hasn't been created yet. Follow the steps above.
- **Messages not appearing in real-time**: Make sure real-time is enabled for the table in Supabase dashboard
- **Can't send messages**: Check that you're logged in and the RLS policies are set correctly
- **Local mode messages**: These are stored temporarily in the browser and will work for demo purposes until the database is set up

## Features Once Set Up

✅ Real-time message updates across all users  
✅ Persistent chat history  
✅ Secure authentication via Supabase  
✅ Automatic timestamps  
✅ Row-level security protecting user data  
