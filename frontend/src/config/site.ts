export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Social Network",
  description: "Mạng xã hội phi tập trung với token SN",
  contractAddress: "0x51d08642F0E53FEe982B0927c5c02944648311dE",
  contractABI: [
    "function smartUser() view returns (address)",
    "function balanceOf(address account) view returns (uint256)",
    "function smartContent() view returns (address)",
    "function smartVote() view returns (address)",
    "function smartAchievement() view returns (address)",
  ],
  smartUserABI: [
    "function createUser(address _user, string memory _name, string memory _avatar, string memory _description)",
    "function getUser(address _user) view returns (tuple(address user, string name, string avatar, string description))",
    "function isUserRegistered(address _user) view returns (bool)",
  ],
  smartContentABI: [
    "function createContent(string memory _contentHash)",
    "function createContentByParent(string memory _contentHash, address _parent)",
    "function getContent(address _user) view returns (tuple(address user, string contentHash, uint256 timestamp, address parent))",
    "function getContentByParent(address _parent) view returns (address[])",
    "function getContentByUser(address _user) view returns (address[])",
    "function getAllContents() view returns (address[])",
    "function contentCount() view returns (uint256)",
    "function contents(address) view returns (tuple(address user, string contentHash, uint256 timestamp, address parent))",
    "function contentsByParent(address) view returns (address[])",
    "function contentsByUser(address) view returns (address[])",
    "function contentsByIndex(uint256) view returns (address)",
  ],
  smartVoteABI: [
    "function createVote(address _content, bool _isUpvote)",
    "function getVotesCountByContent(address _content) view returns (uint256 upVote, uint256 downVote)",
    "function isVoted(address, address) view returns (bool)",
    "function getVotesByContent(address _content) view returns (tuple(address content, address user, bool isUpvote, uint256 timestamp)[])",
    "function getVotesByUser(address _user) view returns (tuple(address content, address user, bool isUpvote, uint256 timestamp)[])",
  ],
  smartAchievementABI: [
    "function createAchievement(address _user, string memory _name, string memory _description)",
    "function getAchievement(address _achievementId) view returns (tuple(address user, string name, string description, uint256 timestamp))",
    "function getAchievementsByUser(address _user) view returns (address[])",
  ],
};
