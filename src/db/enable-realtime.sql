-- Enable realtime subscriptions for tasks table
-- This enables real-time updates when tasks are created, updated, or deleted

-- Enable realtime for the tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- Optional: Enable realtime for users table if needed for user presence/status
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.users;