



export interface User {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'chatter';
  teamId?: string;
  assignedModel?: string;
  name: string;
}


export interface Custom {
  teamId?: string;
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
  teamId?: string;
  id: string;
  date: string; // YYYY-MM-DD
  shift: 'night' | 'morning' | 'evening';
  model: string;
  operator: string;
}

export interface ModelInfo {
  teamId?: string;
  id: string;
  name: string;
}

export interface GuideFolder {
  teamId?: string;
  id: string;
  name: string;
  subFolders: { id: string; name: string }[];
}

export interface Guide {
  teamId?: string;
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  likes: string[];
  blockId?: string | null;
  subBlockId?: string | null;
}

export interface GuideComment {
  teamId?: string;
  id: string;
  guideId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Bonus {
  teamId?: string;
  id: string;
  userId: string; // The user (chatter) this bonus belongs to
  amount: number;
  description: string;
  date: string; // ISO string
}

export interface Contest {
  teamId?: string;
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
  teamId?: string;
  id: string;
  contestId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Roulette {
  teamId?: string;
  id: string;
  name: string;
  prizes: string[];
  isAdminOnly: boolean;
  authorId: string;
}

export interface Paste {
  teamId?: string;
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: number;
}
