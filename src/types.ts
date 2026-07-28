



export interface User {
  id: string;
  email: string;
  role: 'admin' | 'chatter';
  assignedModel?: string;
  name: string;
}


export interface Custom {
  id: string;
  model: string;
  customNumber: string;
  fanLink: string;
  status: 'pending' | 'done' | 'declined';
  statusComment?: string;
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

export interface Contest {
  id: string;
  title: string;
  content: string; // Description and image links can be in markdown or just text/HTML? Wait, guides use markdown? Let's check GuidesPanel.
  imageUrls?: string[];
  authorId: string;
  authorName: string;
  createdAt: number;
  likes: string[];
}

export interface ContestComment {
  id: string;
  contestId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Roulette {
  id: string;
  name: string;
  prizes: string[];
  isAdminOnly: boolean;
  authorId: string;
}
