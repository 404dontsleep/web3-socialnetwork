export interface Post {
  id: number;
  author: string;
  contentHash: string;
  timestamp: number;
  score: number;
  parent: number;
}

export interface PostWithContent extends Post {
  content?: string;
  loading?: boolean;
  error?: string;
}
