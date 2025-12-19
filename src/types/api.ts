export interface UserProfile {
  id: string;
  address: string;
  nickname: string;
  avatar: string;
  inviteCode: string;
  inviteCount: number;
  totalPoints: number;
  totalEarnings: number;
  createdAt: string;
}

export interface IntegralRecord {
  id: number;
  time: string;
  action: string;
  amount: number;
  type: 'earn' | 'spend';
}

export interface EarningsRecord {
  id: number;
  time: string;
  action: string;
  amount: number | string;
  type: 'cash' | 'token';
  unit: string;
}

export interface SponsorRecord {
  id: number;
  nickname: string;
  avatar: string;
  poolCount: number;
  ranking: number;
  sponsorCount: number;
  totalAmount: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  price: number;
  rating: number;
  isActive: boolean;
}

export interface RankingItem {
  id: string;
  address: string;
  nickname: string;
  avatar: string;
  value: number;
  rank: number;
}

export interface TaskInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  status: 'pending' | 'completed' | 'claimed';
  requirements: string[];
  deadline?: string;
}

export interface WalletConnection {
  address: string;
  signature: string;
}

export interface WalletBalance {
  balance: string;
  symbol: string;
  decimals: number;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
}

export interface UserRanking {
  rank: number;
  total: number;
  value: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}