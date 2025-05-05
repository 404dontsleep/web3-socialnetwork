import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircleIcon } from "lucide-react";
import { ArrowDownIcon } from "lucide-react";
import { ArrowUpIcon } from "lucide-react";

import walletStore from "@/stores/wallet.store";
import { uploadToIPFS } from "@/apis/ipfs";
import { Editor, Markdown } from "@/components/md-editor/editor";
import WalletUser from "@/components/user/wallet-user";
import { format } from "@/utils/format";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createContent, address } = walletStore();

  const handleSubmit = async () => {
    if (!content) {
      addToast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung bài viết",
      });

      return;
    }

    try {
      setLoading(true);

      const ipfsHash = await uploadToIPFS(content);

      await createContent(ipfsHash);

      addToast({
        title: "Thành công",
        description: "Đã tạo bài viết mới",
      });
      navigate("/post");
    } catch (error: any) {
      addToast({
        title: "Lỗi",
        description: "Không thể tạo bài viết: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto py-8 pt-24">
      <Card isBlurred>
        <CardHeader>
          <h1 className="text-2xl font-bold">Tạo bài viết</h1>
        </CardHeader>
        <CardBody>
          <Editor value={content} onChange={(e) => setContent(e || "")} />
        </CardBody>
        <CardFooter>
          <Button
            fullWidth
            color="primary"
            isLoading={loading}
            variant="flat"
            onPress={handleSubmit}
          >
            Tạo bài viết
          </Button>
        </CardFooter>
      </Card>
      <Card isBlurred isPressable className="w-full mt-4">
        <CardHeader>
          <WalletUser
            address={address || ""}
            description={format.date(new Date().getTime())}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Markdown source={content} />
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center gap-2">
          <Button
            className="flex-1"
            color="success"
            endContent={<ArrowUpIcon />}
            variant="flat"
          >
            0
          </Button>
          <Button
            className="flex-1"
            color="danger"
            endContent={<ArrowDownIcon />}
            variant="flat"
          >
            0
          </Button>
          <Button className="flex-1" variant="flat">
            <MessageCircleIcon />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
