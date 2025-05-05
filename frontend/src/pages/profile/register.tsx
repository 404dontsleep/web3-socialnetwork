import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@heroui/react";

import walletStore from "@/stores/wallet.store";
import UserCard from "@/components/user-card";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { address, createUser, isUserRegistered } = walletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Hero",
    avatar: "https://placehold.co/200x200",
    description: "I am a user of the platform",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert("Vui lòng kết nối ví trước khi đăng ký");

      return;
    }

    try {
      setIsLoading(true);

      // Kiểm tra xem người dùng đã đăng ký chưa
      const registered = await isUserRegistered(address);

      if (registered) {
        alert("Tài khoản đã tồn tại");
        navigate(`/profile/${address}`);

        return;
      }

      // Thực hiện đăng ký
      await createUser(formData.name, formData.avatar, formData.description);

      alert("Đăng ký thành công!");
      navigate(`/profile/${address}`);
    } catch (error) {
      addToast({
        title: "Lỗi đăng ký",
        description: `Đăng ký thất bại: ${error instanceof Error ? error.message : String(error)}`,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-4">
      <UserCard
        avatar={formData.avatar}
        description={formData.description}
        name={formData.name}
      />
      <Card isBlurred className="mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Create Profile</h1>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium" htmlFor="name">
                Tên hiển thị
              </label>
              <Input
                required
                id="name"
                name="name"
                placeholder="Nhập tên hiển thị"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium" htmlFor="avatar">
                URL ảnh đại diện
              </label>
              <Input
                required
                id="avatar"
                name="avatar"
                placeholder="Nhập URL ảnh đại diện"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="description">
                Giới thiệu bản thân
              </label>
              <Textarea
                required
                id="description"
                name="description"
                placeholder="Nhập giới thiệu bản thân"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
