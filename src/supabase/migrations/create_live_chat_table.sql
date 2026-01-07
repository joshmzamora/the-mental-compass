-- Create the live_chat_messages table for real-time chat functionality
-- Run this SQL in your Supabase SQL Editor to set up the table

-- Create the table
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
