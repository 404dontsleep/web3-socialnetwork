export interface User {
  userAddress: string;
  reputation: number;
  soulboundTokens: number[];
  voteWeight: number;
  lastVoteTime: number;
  voteCount24h: number;
  lastRewardTime: number;
}

export interface SoulboundToken {
  tokenId: number;
  achievement: string;
  timestamp: number;
}
