import { useParams } from "react-router-dom";
import { Card, CardBody, Divider, Skeleton, Tooltip } from "@heroui/react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MessageCircle,
  ThumbsUp,
  MessageSquare,
  ThumbsDown,
  Medal,
} from "lucide-react";

import walletStore, { Achievement } from "@/stores/wallet.store";
import UserCard from "@/components/user-card";

export default function ProfilePage() {
  const { address } = useParams();

  const { getUser, smartUserContract } = walletStore();

  const { data: user } = useSWR(
    address ? `user-${address}-${smartUserContract?.target}` : null,
    () => getUser(address as string),
  );

  return (
    <section className="container mx-auto py-8 pt-24 space-y-4">
      {!user ? (
        <>
          <Card isBlurred>
            <CardBody>
              <div className="flex flex-col gap-2 items-center">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="w-48 h-6 rounded-full" />
                <Skeleton className="w-52 h-6 rounded-full" />
                <Skeleton className="w-48 h-6 rounded-full" />
                <Skeleton className="w-52 h-6 rounded-full" />
              </div>
            </CardBody>
          </Card>
          <Card isBlurred>
            <CardBody>
              <div className="flex flex-row gap-2 items-center justify-around">
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xl font-bold flex items-center">
                    <Skeleton className="w-36 h-8 rounded" />
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center text-success-600">
                  <p className="text-xl font-bold flex items-center">
                    <Skeleton className="w-36 h-8 rounded" />
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center text-danger-600">
                  <p className="text-xl font-bold flex items-center">
                    <Skeleton className="w-36 h-8 rounded" />
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card
            isBlurred
            className="bg-gradient-to-br from-white/10 to-transparent border border-white/20"
          >
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out">
                  <div className="p-2 rounded-full bg-primary-500/20 text-primary-500">
                    <Skeleton className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col">
                    <Skeleton className="w-32 h-5 rounded" />
                    <Skeleton className="w-48 h-4 rounded mt-1" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out">
                  <div className="p-2 rounded-full bg-success-500/20 text-success-500">
                    <Skeleton className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col">
                    <Skeleton className="w-32 h-5 rounded" />
                    <Skeleton className="w-48 h-4 rounded mt-1" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out">
                  <div className="p-2 rounded-full bg-danger-500/20 text-danger-500">
                    <Skeleton className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col">
                    <Skeleton className="w-32 h-5 rounded" />
                    <Skeleton className="w-48 h-4 rounded mt-1" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <UserCard
            avatar={user.avatar}
            description={user.description}
            name={user.name}
          />
          <UserStats address={address as string} />
          <UserAchievements address={address as string} />
          <UserActivity address={address as string} />
        </>
      )}
    </section>
  );
}

function UserStats({ address }: { address: string }) {
  const {
    smartContentContract,
    smartVoteContract,
    getVotesCountByContent,
    getContentByUser,
  } = walletStore();
  const [stats, setStats] = useState<{
    contentCount: number;
    upVoteCount: number;
    downVoteCount: number;
  }>({
    contentCount: 0,
    upVoteCount: 0,
    downVoteCount: 0,
  });

  useEffect(() => {
    if (!smartContentContract || !smartVoteContract) return;

    const asyncFunction = async () => {
      const contents = await getContentByUser(address as string);
      const votes = await Promise.all(
        contents.map((content) => getVotesCountByContent(content)),
      );

      setStats({
        contentCount: contents.length,
        upVoteCount: votes.reduce((acc, curr) => acc + curr.upVote, 0),
        downVoteCount: votes.reduce((acc, curr) => acc + curr.downVote, 0),
      });
    };

    asyncFunction();
  }, [address, smartContentContract, smartVoteContract]);

  return (
    <Card isBlurred>
      <CardBody>
        <div className="flex flex-row gap-2 items-center justify-around">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-xl font-bold flex items-center">
              {stats.contentCount}
              <MessageCircle />
            </p>
            <p className="text-sm font-bold">Content</p>
          </div>
          <div className="flex flex-col gap-2 items-center text-success-600">
            <p className="text-xl font-bold flex items-center">
              {stats.upVoteCount}
              <ArrowUpIcon />
            </p>
            <p className="text-sm font-bold">Up Vote</p>
          </div>
          <div className="flex flex-col gap-2 items-center text-danger-600">
            <p className="text-xl font-bold flex items-center">
              {stats.downVoteCount}
              <ArrowDownIcon />
            </p>
            <p className="text-sm font-bold">Down Vote</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function UserActivity({ address }: { address: string }) {
  const {
    getContentByUser,
    getContent,
    getVotesByUser,
    getAchievement,
    getAchievementsByUser,
    smartContentContract,
    smartVoteContract,
  } = walletStore();

  const [activitys, setActivitys] = useState<
    (
      | {
          type: "content";
          content: string;
          timestamp: number;
        }
      | {
          type: "vote";
          isUpvote: boolean;
          timestamp: number;
        }
      | {
          type: "achievement";
          name: string;
          timestamp: number;
        }
    )[]
  >([]);

  useEffect(() => {
    if (!smartContentContract || !smartVoteContract) return;

    const asyncFunction = async () => {
      const contents = await getContentByUser(address as string);
      const votes = await getVotesByUser(address as string);
      const achievements = await getAchievementsByUser(address as string);
      const allContents = await Promise.all(
        contents.map(async (content) => {
          const contentData = await getContent(content);

          return {
            address: content,
            timestamp: Number(contentData.timestamp),
          };
        }),
      );
      const allAchievements = await Promise.all(
        achievements.map(async (achievement) => {
          const achievementData = await getAchievement(achievement);

          return {
            address: achievement,
            name: achievementData.name,
            timestamp: Number(achievementData.timestamp),
          };
        }),
      );
      const _activitys: typeof activitys = [
        ...allContents.map((content) => ({
          type: "content" as const,
          content: content.address,
          timestamp: content.timestamp,
        })),
        ...votes.map((vote) => ({
          type: "vote" as const,
          isUpvote: vote.isUpvote,
          timestamp: vote.timestamp,
        })),
        ...allAchievements.map((achievement) => ({
          type: "achievement" as const,
          name: achievement.name,
          timestamp: achievement.timestamp,
        })),
      ];

      setActivitys(_activitys.sort((a, b) => b.timestamp - a.timestamp));
    };

    asyncFunction();
  }, [address, smartContentContract, smartVoteContract]);

  const renderActivity = (activity: (typeof activitys)[number]) => {
    switch (activity.type) {
      case "content":
        return {
          icon: <MessageSquare size={20} />,
          bgClass: "bg-primary-500/20 text-primary-500",
          message: "Posted new content",
        };
      case "vote":
        return activity.isUpvote
          ? {
              icon: <ThumbsUp size={20} />,
              bgClass: "bg-success-500/20 text-success-500",
              message: "Liked a post",
            }
          : {
              icon: <ThumbsDown size={20} />,
              bgClass: "bg-danger-500/20 text-danger-500",
              message: "Disliked a post",
            };
      case "achievement":
        return {
          icon: <Medal size={20} />,
          bgClass: "bg-warning-500/20 text-warning-500",
          message: `Earned achievement: ${activity.name}`,
        };
      default:
        return {
          icon: null,
          bgClass: "",
          message: "Unknown activity",
        };
    }
  };

  return (
    <Card
      isBlurred
      className="bg-gradient-to-br from-white/10 to-transparent border border-white/20"
    >
      <CardBody>
        <div className="flex flex-col gap-4">
          {activitys.map((activity) => {
            const { icon, bgClass, message } = renderActivity(activity);

            return (
              <div
                key={activity.timestamp}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out"
              >
                <div className={`p-2 rounded-full ${bgClass}`}>{icon}</div>

                <div className="flex flex-col">
                  <p className="text-sm font-medium text-default-600">
                    {message}
                  </p>
                  <p className="text-xs text-default-700">
                    {new Date(activity.timestamp * 1000).toLocaleString(
                      "en-US",
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

function UserAchievements({ address }: { address: string }) {
  const { getAchievementsByUser, smartAchievementContract, getAchievement } =
    walletStore();

  const [achievements, setAchievements] = useState<
    (Achievement & { address: string })[]
  >([]);

  useEffect(() => {
    if (!smartAchievementContract) return;

    const asyncFunction = async () => {
      const achievements = await getAchievementsByUser(address as string);
      const achievementData = await Promise.all(
        achievements.map(async (achievement) => {
          const achievementData = await getAchievement(achievement);

          return {
            address: achievement,
            user: achievementData.user,
            name: achievementData.name,
            description: achievementData.description,
            timestamp: Number(achievementData.timestamp),
          };
        }),
      );

      setAchievements(achievementData);
    };

    asyncFunction();
  }, [address, smartAchievementContract]);

  return (
    <Card isBlurred>
      <div className="w-full overflow-auto flex flex-row gap-4 p-4">
        {achievements.map((achievement) => (
          <Tooltip key={achievement.address} content={achievement.description}>
            <div
              key={achievement.address}
              className="flex flex-col gap-4 p-4 shadow-small items-center rounded-md"
            >
              <div className="p-3 rounded-full bg-warning-500/20 text-warning-500">
                <Medal className="w-6 h-6" />
              </div>
              <Divider />
              <div className="flex flex-col items-center w-40">
                <span className="text-lg font-semibold text-warning-500">
                  {achievement.name}
                </span>
                <span className="text-xs text-default-500">
                  {new Date(achievement.timestamp * 1000).toLocaleString(
                    "en-US",
                  )}
                </span>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
}
