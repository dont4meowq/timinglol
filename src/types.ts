export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
}

export interface Section {
  id: string;
  title: string;
  notes: Note[];
  collapsed: boolean;
  model: string; // 'Shared' or specific model like 'Aska'
  order?: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'chatter';
  assignedModel?: string;
  name: string;
}

export interface Fan {
  id: string;
  model: string;
  nickname: string;
  fetishes: string;
  spending: 'whale' | 'normal' | 'low';
  timezone: string;
  notes: string;
  tagColor: 'red' | 'gold' | 'green' | 'blue' | 'none';
  link?: string;
}

export interface Custom {
  id: string;
  model: string;
  fanLink: string;
  price: string;
  duration: string;
  outfit: string;
  request: string;
  status: 'pending' | 'done' | 'declined';
  authorId: string;
  authorName: string;
  createdAt: number;
}

export interface DayOff {
  id: string;
  date: string; // YYYY-MM-DD
  shift: 'night' | 'morning' | 'evening';
  model: string;
  operator: string;
}

export interface ModelInfo {
  id: string;
  name: string;
}

export interface Guide {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  likes: string[];
}

export interface GuideComment {
  id: string;
  guideId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Bonus {
  id: string;
  userId: string; // The user (chatter) this bonus belongs to
  amount: number;
  description: string;
  date: string; // ISO string
}
