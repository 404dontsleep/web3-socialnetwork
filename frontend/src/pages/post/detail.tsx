import { useParams } from "react-router-dom";
import { addToast, Button, Input, Skeleton } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import useSwr from "swr";
import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SendIcon } from "lucide-react";

import walletStore, { Content } from "@/stores/wallet.store";
import { format } from "@/utils/format";
import { readFromIPFS, uploadToIPFS } from "@/apis/ipfs";
import { Markdown } from "@/components/md-editor/editor";
import WalletUser from "@/components/user/wallet-user";

export default function PostDetailPage() {
  const { id } = useParams();
  const postAddress = id as string;
  const { getContent, smartContentContract } = walletStore();
  const { data, isLoading, error } = useSwr<Content>(
    `/api/posts-${postAddress}-${smartContentContract?.target}`,
    () => getContent(postAddress),
  );

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  if (!data) return <div>Không tìm thấy bài viết</div>;

  return (
    <section className="container mx-auto py-8 pt-24 space-y-4">
      <div className="flex flex-col gap-4">
        <ContentCard postAddress={postAddress} />
        <AddComment postAddress={postAddress} />
        <PostComment postAddress={postAddress} />
      </div>
    </section>
  );
}

function PostContent({ contentHash }: { contentHash: string }) {
  const { data, isLoading, error } = useSwr(`/api/ipfs/${contentHash}`, () =>
    readFromIPFS(contentHash),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <Markdown source={data} />;
}
function ContentCard({ postAddress }: { postAddress: string }) {
  const { getContent, smartContentContract } = walletStore();
  const { data } = useSwr<Content>(
    `/api/posts-${postAddress}-${smartContentContract?.target}`,
    () => getContent(postAddress),
  );

  if (!data) return <div>Không tìm thấy bài viết</div>;

  return (
    <Card isBlurred>
      <CardHeader>
        <WalletUser
          address={data.user}
          description={format.date(data.timestamp)}
        />
        <div className="ml-auto">
          <VoteComponent postAddress={postAddress} />
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-row gap-2 items-center">
          <div className="ml-12 flex-1 overflow-hidden">
            <PostContent contentHash={data.contentHash} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function VoteComponent({ postAddress }: { postAddress: string }): JSX.Element {
  const {
    getVotesCountByContent,
    isVoted,
    address,
    smartContentContract,
    smartVoteContract,
    createVote,
  } = walletStore();

  const { data: votesCount } = useSwr(
    `/api/votes-count-${postAddress}-${smartContentContract?.target}-${smartVoteContract?.target}`,
    () => getVotesCountByContent(postAddress),
  );

  const { data: isVotedData } = useSwr(
    `/api/is-voted-${postAddress}-${smartContentContract?.target}-${smartVoteContract?.target}-${address}`,
    () => isVoted(postAddress, address || ""),
  );

  const handleVote = async (isUpvote: boolean) => {
    await createVote(postAddress, isUpvote);
  };

  const haveVoted = isVotedData || false;

  return (
    <div className="flex flex-row gap-2 items-center">
      <Button
        className="font-bold"
        color={!haveVoted ? "success" : "default"}
        disabled={haveVoted}
        endContent={<ArrowUpIcon />}
        size="sm"
        variant="flat"
        onPress={() => handleVote(true)}
      >
        {votesCount?.upVote}
      </Button>
      <Button
        className="font-bold"
        color={!haveVoted ? "danger" : "default"}
        disabled={haveVoted}
        endContent={<ArrowDownIcon />}
        size="sm"
        variant="flat"
        onPress={() => handleVote(false)}
      >
        {votesCount?.downVote}
      </Button>
    </div>
  );
}

function AddComment({ postAddress }: { postAddress: string }): JSX.Element {
  const { createContentByParent } = walletStore();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const contentHash = await uploadToIPFS(content);

      await createContentByParent(contentHash, postAddress);
      setContent("");
      addToast({
        title: "Success",
        description: "Comment added successfully",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Comment failed" + error,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card isBlurred>
      <CardBody>
        <div className="flex flex-row gap-2">
          <Input
            isDisabled={isLoading}
            placeholder="Nhập bình luận"
            value={content}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onValueChange={(e: string) => setContent(e)}
          />
          <Button
            isIconOnly
            color="primary"
            isDisabled={isLoading}
            isLoading={isLoading}
            variant="flat"
            onPress={handleSubmit}
          >
            <SendIcon />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function PostComment({ postAddress }: { postAddress: string }) {
  const { getContentByParent, smartContentContract } = walletStore();
  const { data } = useSwr(
    `/api/comments/${postAddress}-${smartContentContract?.target}`,
    () => getContentByParent(postAddress),
    {
      refreshInterval: 5000,
    },
  );

  return (
    <div className="flex flex-col gap-4">
      {!data ? (
        <>
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
          <Skeleton className="h-20 rounded-md" />
        </>
      ) : data?.length === 0 ? (
        <Card isBlurred>
          <CardBody>
            <div className="text-center text-sm text-default-600">
              No comments yet
            </div>
          </CardBody>
        </Card>
      ) : (
        data?.map((postAddress) => (
          <ContentCard key={postAddress} postAddress={postAddress} />
        ))
      )}
    </div>
  );
}
