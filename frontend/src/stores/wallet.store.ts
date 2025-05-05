import { Contract } from "ethers";
import { BrowserProvider } from "ethers";
import { create } from "zustand";
import { addToast } from "@heroui/react";

import { siteConfig } from "@/config/site";

// Định nghĩa types ở đây thay vì import
export interface User {
  user: string;
  name: string;
  avatar: string;
  description: string;
}

export interface Content {
  user: string;
  contentHash: string;
  timestamp: number;
  parent: string;
}

export interface Vote {
  content: string;
  user: string;
  isUpvote: boolean;
  timestamp: number;
}

export interface Achievement {
  user: string;
  name: string;
  description: string;
  timestamp: number;
}

function isSecondTime() {
  return localStorage.getItem("isSecondTime") === "true";
}

function setSecondTime() {
  localStorage.setItem("isSecondTime", "true");
}

interface WalletStore {
  address: string | null;
  connect: () => Promise<void>;
  isSecondTime: boolean;
  provider: BrowserProvider | null;
  contract: Contract | null;
  smartUserContract: Contract | null;
  smartContentContract: Contract | null;
  smartVoteContract: Contract | null;
  smartAchievementContract: Contract | null;
  balance: number;
  getBalance: () => Promise<number>;

  // SmartUser methods
  createUser: (
    name: string,
    avatar: string,
    description: string,
  ) => Promise<void>;
  getUser: (userAddress: string) => Promise<User>;
  isUserRegistered: (userAddress: string) => Promise<boolean>;

  // Initialize Smart User contract
  initializeSmartUserContract: () => Promise<void>;

  // SmartContent methods
  initializeSmartContentContract: () => Promise<void>;
  createContent: (contentHash: string) => Promise<void>;
  createContentByParent: (contentHash: string, parent: string) => Promise<void>;
  getContent: (userAddress: string) => Promise<Content>;
  getContentByParent: (parent: string) => Promise<string[]>;
  getContentByUser: (userAddress: string) => Promise<string[]>;
  getAllContents: () => Promise<string[]>;
  getContentCount: () => Promise<number>;
  getContentByIndex: (index: number) => Promise<string>;

  // SmartVote methods
  initializeSmartVoteContract: () => Promise<void>;
  createVote: (content: string, isUpvote: boolean) => Promise<void>;
  getVotesCountByContent: (
    content: string,
  ) => Promise<{ upVote: number; downVote: number }>;
  isVoted: (content: string, user: string) => Promise<boolean>;
  getVotesByContent: (content: string) => Promise<Vote[]>;
  getVotesByUser: (user: string) => Promise<Vote[]>;

  // SmartAchievement methods
  initializeSmartAchievementContract: () => Promise<void>;
  createAchievement: (name: string, description: string) => Promise<void>;
  getAchievement: (userAddress: string) => Promise<Achievement>;
  getAchievementsByUser: (userAddress: string) => Promise<string[]>;
}

const walletStore = create<WalletStore>((set, get) => ({
  address: null,
  isSecondTime: isSecondTime(),
  provider: null,
  contract: null,
  smartUserContract: null,
  smartContentContract: null,
  smartVoteContract: null,
  smartAchievementContract: null,
  balance: 0,

  connect: async () => {
    if (!(window as any).ethereum) throw new Error("Ethereum is not installed");
    const ethereum = (window as any).ethereum;
    const provider = new BrowserProvider(ethereum);

    set({ provider });

    const contract = new Contract(
      siteConfig.contractAddress,
      siteConfig.contractABI,
      provider,
    );

    set({ contract });
    const accounts = await provider.send("eth_requestAccounts", []);

    if (!isSecondTime()) {
      setSecondTime();
    }

    set({ address: accounts[0], isSecondTime: true });

    ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    // Khởi tạo Smart User contract
    await get().initializeSmartUserContract();
    // Khởi tạo Smart Content contract
    await get().initializeSmartContentContract();
    // Khởi tạo Smart Vote contract
    await get().initializeSmartVoteContract();
    // Khởi tạo Smart Achievement contract
    await get().initializeSmartAchievementContract();
  },

  initializeSmartUserContract: async () => {
    const { contract, provider } = get();

    if (!contract || !provider)
      throw new Error("Contract or provider not connected");

    try {
      // Lấy địa chỉ SmartUser từ contract chính
      const smartUserAddress = await contract.smartUser();

      // Tạo instance cho SmartUser contract

      const smartUserContract = new Contract(
        smartUserAddress,
        siteConfig.smartUserABI,
        provider,
      );

      set({ smartUserContract });
    } catch (error) {
      addToast({
        title: "Error",
        description: `Cannot initialize Smart User contract [${error}]`,
        color: "danger",
      });
    }
  },

  initializeSmartContentContract: async () => {
    const { contract, provider } = get();

    if (!contract || !provider)
      throw new Error("Contract or provider not connected");

    try {
      // Lấy địa chỉ SmartContent từ contract chính
      const smartContentAddress = await contract.smartContent();

      // Tạo instance cho SmartContent contract
      const smartContentContract = new Contract(
        smartContentAddress,
        siteConfig.smartContentABI,
        provider,
      );

      set({ smartContentContract });
    } catch (error) {
      addToast({
        title: "Error",
        description: `Cannot initialize Smart Content contract [${error}]`,
        color: "danger",
      });
    }
  },

  getBalance: async () => {
    const { contract, address } = get();

    if (!contract || !address) throw new Error("Contract is not connected");

    const balance = await contract.balanceOf(address);
    const balanceInContract = Number(balance) / Math.pow(10, 18);

    set({ balance: balanceInContract });

    return balanceInContract;
  },

  // SmartUser methods
  createUser: async (name: string, avatar: string, description: string) => {
    const { smartUserContract, provider, address } = get();

    if (!smartUserContract || !provider || !address)
      throw new Error("Smart User contract not initialized");

    const signer = await provider.getSigner();
    const contractWithSigner = smartUserContract.connect(signer) as Contract;

    // Gọi hàm createUser từ SmartUser contract
    await contractWithSigner.createUser(address, name, avatar, description);
  },

  getUser: async (userAddress: string) => {
    const { smartUserContract } = get();

    if (!smartUserContract)
      throw new Error("Smart User contract not initialized");

    const user = await smartUserContract.getUser(userAddress);

    return {
      user: user.user,
      name: user.name,
      avatar: user.avatar,
      description: user.description,
    };
  },

  isUserRegistered: async (userAddress: string) => {
    const { smartUserContract } = get();

    if (!smartUserContract)
      throw new Error("Smart User contract not initialized");

    return await smartUserContract.isUserRegistered(userAddress);
  },

  // SmartContent methods
  createContent: async (contentHash: string) => {
    const { smartContentContract, provider, address } = get();

    if (!smartContentContract || !provider || !address)
      throw new Error("Smart Content contract not initialized");

    const signer = await provider.getSigner();
    const contractWithSigner = smartContentContract.connect(signer) as Contract;

    await contractWithSigner.createContent(contentHash);
  },

  createContentByParent: async (contentHash: string, parent: string) => {
    const { smartContentContract, provider, address } = get();

    if (!smartContentContract || !provider || !address)
      throw new Error("Smart Content contract not initialized");

    const signer = await provider.getSigner();
    const contractWithSigner = smartContentContract.connect(signer) as Contract;

    await contractWithSigner.createContentByParent(contentHash, parent);
  },

  getContent: async (userAddress: string) => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    const content = await smartContentContract.getContent(userAddress);

    return {
      user: content.user,
      contentHash: content.contentHash,
      timestamp: Number(content.timestamp),
      parent: content.parent,
    };
  },

  getContentByParent: async (parent: string) => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    return await smartContentContract.getContentByParent(parent);
  },

  getContentByUser: async (userAddress: string) => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    return await smartContentContract.getContentByUser(userAddress);
  },

  getAllContents: async () => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    return await smartContentContract.getAllContents();
  },

  getContentCount: async () => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    const count = await smartContentContract.contentCount();

    return Number(count);
  },

  getContentByIndex: async (index: number) => {
    const { smartContentContract } = get();

    if (!smartContentContract)
      throw new Error("Smart Content contract not initialized");

    return await smartContentContract.contentsByIndex(index);
  },

  initializeSmartVoteContract: async () => {
    const { contract, provider } = get();

    if (!contract || !provider)
      throw new Error("Contract or provider not connected");

    try {
      // Lấy địa chỉ SmartVote từ contract chính
      const smartVoteAddress = await contract.smartVote();

      // Tạo instance cho SmartVote contract
      const smartVoteContract = new Contract(
        smartVoteAddress,
        siteConfig.smartVoteABI,
        provider,
      );

      set({ smartVoteContract });
    } catch (error) {
      addToast({
        title: "Error",
        description: `Cannot initialize Smart Vote contract [${error}]`,
        color: "danger",
      });
    }
  },

  createVote: async (content: string, isUpvote: boolean) => {
    const { smartVoteContract, provider, address } = get();

    if (!smartVoteContract || !provider || !address)
      throw new Error("Smart Vote contract not initialized");

    const signer = await provider.getSigner();
    const contractWithSigner = smartVoteContract.connect(signer) as Contract;

    await contractWithSigner.createVote(content, isUpvote);
  },

  getVotesCountByContent: async (content: string) => {
    const { smartVoteContract } = get();

    if (!smartVoteContract)
      throw new Error("Smart Vote contract not initialized");

    const votes = await smartVoteContract.getVotesCountByContent(content);

    return {
      upVote: Number(votes.upVote),
      downVote: Number(votes.downVote),
    };
  },

  isVoted: async (content: string, user: string) => {
    const { smartVoteContract } = get();

    if (!smartVoteContract)
      throw new Error("Smart Vote contract not initialized");

    return await smartVoteContract.isVoted(content, user);
  },

  getVotesByContent: async (content: string) => {
    const { smartVoteContract } = get();

    if (!smartVoteContract)
      throw new Error("Smart Vote contract not initialized");

    const votes = await smartVoteContract.votesByContent(content);

    return votes.map((vote: any) => ({
      content: vote.content,
      user: vote.user,
      isUpvote: vote.isUpvote,
      timestamp: Number(vote.timestamp),
    }));
  },

  getVotesByUser: async (user: string) => {
    const { smartVoteContract } = get();

    if (!smartVoteContract)
      throw new Error("Smart Vote contract not initialized");

    const votes = await smartVoteContract.getVotesByUser(user);

    return votes.map((vote: any) => ({
      content: vote.content,
      user: vote.user,
      isUpvote: vote.isUpvote,
      timestamp: Number(vote.timestamp),
    }));
  },

  // SmartAchievement methods
  initializeSmartAchievementContract: async () => {
    const { contract, provider } = get();

    if (!contract || !provider)
      throw new Error("Contract or provider not connected");

    try {
      // Lấy địa chỉ SmartAchievement từ contract chính
      const smartAchievementAddress = await contract.smartAchievement();

      // Tạo instance cho SmartAchievement contract
      const smartAchievementContract = new Contract(
        smartAchievementAddress,
        siteConfig.smartAchievementABI,
        provider,
      );

      set({ smartAchievementContract });
    } catch (error) {
      addToast({
        title: "Error",
        description: `Cannot initialize Smart Achievement contract [${error}]`,
        color: "danger",
      });
    }
  },

  createAchievement: async (name: string, description: string) => {
    const { smartAchievementContract, provider, address } = get();

    if (!smartAchievementContract || !provider || !address)
      throw new Error("Smart Achievement contract not initialized");

    const signer = await provider.getSigner();
    const contractWithSigner = smartAchievementContract.connect(
      signer,
    ) as Contract;

    await contractWithSigner.createAchievement(address, name, description);
  },

  getAchievement: async (userAddress: string) => {
    const { smartAchievementContract } = get();

    if (!smartAchievementContract)
      throw new Error("Smart Achievement contract not initialized");

    const achievement =
      await smartAchievementContract.getAchievement(userAddress);

    return {
      user: achievement.user,
      name: achievement.name,
      description: achievement.description,
      timestamp: Number(achievement.timestamp),
    };
  },

  getAchievementsByUser: async (userAddress: string) => {
    const { smartAchievementContract } = get();

    if (!smartAchievementContract)
      throw new Error("Smart Achievement contract not initialized");

    const achievements =
      await smartAchievementContract.getAchievementsByUser(userAddress);

    return achievements.map((achievement: any) => achievement);
  },
}));

export default walletStore;
