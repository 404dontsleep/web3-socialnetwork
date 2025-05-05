import { Button, CardBody, Card } from "@heroui/react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { useEffect } from "react";

import walletStore from "@/stores/wallet.store";

export default function IndexPage() {
  const { address, isUserRegistered, smartUserContract } = walletStore();
  const { data: isRegistered, mutate } = useSWR(
    address ? `isUserRegistered-${address}` : null,
    () => isUserRegistered(address as string),
  );

  useEffect(() => {
    if (smartUserContract) {
      mutate();
    }
  }, [smartUserContract, address]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 bg-gray-50 transition-colors">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-6xl font-bold mb-6 dark:text-white text-gray-800">
          Mạng xã hội phi tập trung
        </h1>
        <p className="text-xl dark:text-gray-300 text-gray-700 mb-12">
          Tham gia cộng đồng của chúng tôi để chia sẻ, kết nối và tương tác với
          mọi người một cách an toàn và minh bạch trên blockchain
        </p>

        <div className="space-y-8">
          {address ? (
            isRegistered ? (
              <Link to="/post">
                <Button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 text-white"
                  size="lg"
                >
                  Khám phá các bài viết
                </Button>
              </Link>
            ) : (
              <Link to="/profile/register">
                <Button
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-500 dark:hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 text-white"
                  size="lg"
                >
                  Tạo tài khoản ngay
                </Button>
              </Link>
            )
          ) : (
            <div className="space-y-6">
              <p className="text-lg dark:text-blue-300 text-blue-600">
                Kết nối ví MetaMask của bạn để bắt đầu
              </p>
              <Button
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-amber-600 dark:to-orange-700 dark:hover:from-amber-500 dark:hover:to-orange-600 transform hover:scale-105 transition-all duration-300 text-white"
                size="lg"
                onPress={() => walletStore.getState().connect()}
              >
                Kết nối ví MetaMask
              </Button>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            isBlurred
            className="dark:bg-gray-800/50 bg-white/80 border dark:border-gray-700 border-gray-200 backdrop-blur-sm"
          >
            <CardBody>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-800">
                Phi tập trung
              </h3>
              <p className="dark:text-gray-300 text-gray-700">
                Dữ liệu được lưu trữ trên blockchain, không có trung gian kiểm
                soát
              </p>
            </CardBody>
          </Card>
          <Card
            isBlurred
            className="dark:bg-gray-800/50 bg-white/80 border dark:border-gray-700 border-gray-200 backdrop-blur-sm"
          >
            <CardBody>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-800">
                An toàn
              </h3>
              <p className="dark:text-gray-300 text-gray-700">
                Bảo mật cao với công nghệ blockchain và ví điện tử
              </p>
            </CardBody>
          </Card>
          <Card
            isBlurred
            className="dark:bg-gray-800/50 bg-white/80 border dark:border-gray-700 border-gray-200 backdrop-blur-sm"
          >
            <CardBody>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-800">
                Minh bạch
              </h3>
              <p className="dark:text-gray-300 text-gray-700">
                Mọi hoạt động đều được ghi lại và có thể kiểm chứng
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
