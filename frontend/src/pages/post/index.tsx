import { Button, CardBody, CardFooter, Divider } from "@heroui/react";
import { Card, CardHeader } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import MDEditor from "@uiw/react-md-editor";
import { ArrowDownIcon, MessageCircleIcon } from "lucide-react";
import { ArrowUpIcon } from "lucide-react";
import { ethers } from "ethers";

import walletStore from "@/stores/wallet.store";
import { format } from "@/utils/format";
import { readFromIPFS } from "@/apis/ipfs";
import themeStore from "@/stores/theme.store";
import WalletUser from "@/components/user/wallet-user";

export default function PostPage() {
  const navigate = useNavigate();
  const { getAllContents, address, smartContentContract } = walletStore();
  const { data: contents, isLoading } = useSWR(
    "/api/contentCount" + smartContentContract?.target,
    () => getAllContents(),
  );

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (contents) {
    return (
      <section className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Bài viết</h1>
            {address && (
              <Button onPress={() => navigate("/post/create")}>
                Tạo bài viết mới
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : contents.length === 0 ? (
            <div className="text-center py-8">Chưa có bài viết nào</div>
          ) : (
            <div className="grid gap-8 grid-cols-1">
              {contents.map((contentAddress) => (
                <PostCard
                  key={contentAddress}
                  contentAddress={contentAddress}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export function PreviewPostContent({ contentHash }: { contentHash: string }) {
  const { theme } = themeStore();
  const { data, isLoading, error } = useSWR(`/api/ipfs/${contentHash}`, () =>
    readFromIPFS(contentHash),
  );

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div data-color-mode={theme}>
      <MDEditor.Markdown
        source={data}
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}

function PostCard({ contentAddress }: { contentAddress: string }) {
  const {
    getContent,
    smartContentContract,
    smartVoteContract,
    getVotesCountByContent,
  } = walletStore();
  const { data: content } = useSWR(
    `/api/content/${contentAddress}-${smartContentContract?.target}`,
    () => getContent(contentAddress),
  );
  const { data: votesCount } = useSWR(
    `/api/votes-count/${contentAddress}-${smartVoteContract?.target}`,
    () => getVotesCountByContent(contentAddress),
  );
  const navigate = useNavigate();

  if (!content) return <div>Không tìm thấy bài viết</div>;
  if (content.parent !== ethers.ZeroAddress) return null;
  if ((votesCount?.upVote || 0) < (votesCount?.downVote || 0)) return null;

  return (
    <Card
      isBlurred
      isPressable
      onPress={() => navigate(`/post/${contentAddress}`)}
    >
      <CardHeader>
        <WalletUser
          address={content.user}
          description={format.date(content.timestamp)}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <PreviewPostContent contentHash={content.contentHash} />
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between items-center gap-2">
        <Button
          className="flex-1"
          color="success"
          endContent={<ArrowUpIcon />}
          variant="flat"
        >
          {votesCount?.upVote}
        </Button>
        <Button
          className="flex-1"
          color="danger"
          endContent={<ArrowDownIcon />}
          variant="flat"
        >
          {votesCount?.downVote}
        </Button>
        <Button className="flex-1" variant="flat">
          <MessageCircleIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
