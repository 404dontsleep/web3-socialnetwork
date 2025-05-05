// contracts/MessageBoard.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SmartUser {
    struct User {
        address user;
        string name;
        string avatar;
        string description;
    }

    mapping(address => User) public users;

    event UserCreated(address indexed user, string name, string avatar, string description);

    SocialNetwork public socialNetwork;

    constructor(address _socialNetwork) {
        socialNetwork = SocialNetwork(_socialNetwork);
    }

    function createUser(address _user, string memory _name, string memory _avatar, string memory _description) public {
        require(users[_user].user == address(0), "User already exists");
        users[_user] = User(_user, _name, _avatar, _description);
        socialNetwork.smartAchievement().createAchievement(_user, "Welcome", "Welcome to Social Network");
        emit UserCreated(_user, _name, _avatar, _description);
    }

    function getUser(address _user) public view returns (User memory) {
        return users[_user];
    }

    function isUserRegistered(address _user) public view returns (bool) {
        return users[_user].user != address(0);
    }

}

contract SmartContent {
    struct Content {
        address user;
        string contentHash;
        uint256 timestamp;
        address parent;
    }

    mapping(address => Content) public contents;
    mapping(address => address[]) public contentsByParent;
    mapping(address => address[]) public contentsByUser;

    mapping(uint256 => address) public contentsByIndex;
    uint256 public contentCount;

    event ContentCreated(address indexed user, string contentHash, uint256 timestamp, address parent);

    SocialNetwork public socialNetwork;

    constructor(address _socialNetwork) {
        socialNetwork = SocialNetwork(_socialNetwork);
    }

    function createContent(string memory _contentHash) public {
        address contentId = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, _contentHash, block.timestamp)))));
        
        Content memory content = Content(msg.sender, _contentHash, block.timestamp, address(0));
        contents[contentId] = content;
        contentsByUser[msg.sender].push(contentId);
        contentCount++;
        contentsByIndex[contentCount] = contentId;
        emit ContentCreated(msg.sender, _contentHash, block.timestamp, address(0));
    }

    function createContentByParent(string memory _contentHash, address _parent) public {
        address contentId = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, _contentHash, block.timestamp)))));
        
        Content memory content = Content(msg.sender, _contentHash, block.timestamp, _parent);
        contents[contentId] = content;
        contentsByParent[_parent].push(contentId);
        contentsByUser[msg.sender].push(contentId);
        contentCount++;
        contentsByIndex[contentCount] = contentId;
        emit ContentCreated(msg.sender, _contentHash, block.timestamp, _parent);
    }

    function getContent(address _user) public view returns (Content memory) {
        return contents[_user];
    }

    function getContentByUser(address _user) public view returns (address[] memory) {
        return contentsByUser[_user];
    }

    function getContentByParent(address _parent) public view returns (address[] memory) {
        return contentsByParent[_parent];
    }

    function getAllContents() public view returns (address[] memory) {
        address[] memory allAddresses = new address[](contentCount);
        for (uint256 i = 1; i <= contentCount; i++) {
            allAddresses[i - 1] = contentsByIndex[i];
        }
        return allAddresses;
    }
}

contract SmartVote {
    struct Vote {
        address content;
        address user;
        bool isUpvote;
        uint256 timestamp;
    }

    mapping(address => Vote[]) public votesByContent;
    mapping(address => Vote[]) public votesByUser;
    mapping(address => mapping(address => bool)) public isVoted;

    SocialNetwork public socialNetwork;

    constructor(address _socialNetwork) {
        socialNetwork = SocialNetwork(_socialNetwork);
    }

    function createVote(address _content, bool _isUpvote) public {
        require(isVoted[_content][msg.sender] == false, "User already voted");
        Vote memory vote = Vote(_content, msg.sender, _isUpvote, block.timestamp);
        votesByContent[_content].push(vote);
        votesByUser[msg.sender].push(vote);
        isVoted[_content][msg.sender] = true;
    }

    function getVotesCountByContent(address _content) public view returns (uint256 upVote, uint256 downVote) {
        Vote[] memory votes = votesByContent[_content];
        uint256 up = 0;
        uint256 down = 0;
        
        for(uint256 i = 0; i < votes.length; i++) {
            if(votes[i].isUpvote) {
                up++;
            } else {
                down++; 
            }
        }
        
        return (up, down);
    }

    function getVotesByContent(address _content) public view returns (Vote[] memory) {
        return votesByContent[_content];
    }

    function getVotesByUser(address _user) public view returns (Vote[] memory) {
        return votesByUser[_user];
    }

}

contract SmartAchievement {
    struct Achievement {
        address user;
        string name;
        string description;
        uint256 timestamp;
    }

    mapping(address => Achievement) public achievements;
    mapping(address => address[]) public achievementsByUser;

    SocialNetwork public socialNetwork;

    constructor(address _socialNetwork) {
        socialNetwork = SocialNetwork(_socialNetwork);
    }

    modifier onlySocialNetwork() {
        require(msg.sender == address(socialNetwork.smartUser()) || msg.sender == address(socialNetwork.smartContent()) || msg.sender == address(socialNetwork.smartVote()), "Only in the social network can call this function");
        _;
    }

    function createAchievement(address _user, string memory _name, string memory _description) public onlySocialNetwork {
        address achievementId = address(uint160(uint256(keccak256(abi.encodePacked(_user, _name, _description, block.timestamp)))));    
        Achievement memory achievement = Achievement(_user, _name, _description, block.timestamp);
        achievements[achievementId] = achievement;
        achievementsByUser[_user].push(achievementId);
    }

    function getAchievement(address _achievementId) public view returns (Achievement memory) {
        return achievements[_achievementId];
    }

    function getAchievementsByUser(address _user) public view returns (address[] memory) {
        return achievementsByUser[_user];
    }
    
}

contract SocialNetwork is ERC20("Social Network", "SN"), Ownable, ReentrancyGuard {

    SmartUser public smartUser;
    SmartContent public smartContent;
    SmartVote public smartVote;
    SmartAchievement public smartAchievement;

    constructor() Ownable(msg.sender) {
        smartUser = new SmartUser(address(this));
        smartContent = new SmartContent(address(this));
        smartVote = new SmartVote(address(this));
        smartAchievement = new SmartAchievement(address(this));
    }

    
}

