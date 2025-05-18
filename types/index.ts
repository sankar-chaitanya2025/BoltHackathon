export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  meeting_id: string;
  created_at: string;
  user?: User;
}

export interface Meeting {
  id: string;
  title: string;
  created_by: string;
  created_at: string;
  participants?: User[];
}