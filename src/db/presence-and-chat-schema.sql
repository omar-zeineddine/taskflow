-- TaskFlow Presence and Chat Schema
-- This schema adds user presence tracking and chat functionality

-- User Presence table for tracking online/offline status
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  is_online BOOLEAN DEFAULT false NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  heartbeat TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  
  -- Ensure one presence record per user
  UNIQUE(user_id)
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  
  -- Add constraints
  CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0),
  CONSTRAINT message_length CHECK (length(message) <= 1000)
);

-- Enable Row Level Security
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_presence table
-- Users can view all presence records (for showing who's online)
CREATE POLICY "Users can view all presence records" ON public.user_presence
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can insert their own presence record
CREATE POLICY "Users can insert their own presence" ON public.user_presence
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own presence record
CREATE POLICY "Users can update their own presence" ON public.user_presence
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own presence record
CREATE POLICY "Users can delete their own presence" ON public.user_presence
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages table
-- Users can view all chat messages
CREATE POLICY "Users can view all chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can insert their own messages
CREATE POLICY "Users can insert their own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages (for editing)
CREATE POLICY "Users can update their own messages" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_presence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER handle_user_presence_updated_at
  BEFORE UPDATE ON public.user_presence
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_presence_updated_at();

CREATE TRIGGER handle_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to clean up old presence records (users offline for > 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_stale_presence()
RETURNS void AS $$
BEGIN
  UPDATE public.user_presence 
  SET is_online = false 
  WHERE is_online = true 
    AND heartbeat < (NOW() - INTERVAL '5 minutes');
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_is_online ON public.user_presence(is_online);
CREATE INDEX IF NOT EXISTS idx_user_presence_heartbeat ON public.user_presence(heartbeat);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC); 