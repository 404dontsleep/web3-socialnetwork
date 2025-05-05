import { Fragment, Key, useEffect } from "react";
import {
  addToast,
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Skeleton,
} from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { ArrowLeftIcon, MoonIcon, SunDimIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import walletStore from "@/stores/wallet.store";
import themeStore from "@/stores/theme.store";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;
  const { address, isSecondTime, connect, getUser, smartUserContract } =
    walletStore();
  const { setTheme: setThemeStore } = themeStore();
  const { data: user } = useSWR(
    `/api/user/${address}-${smartUserContract?.target}`,
    () => (address ? getUser(address as string) : null),
  );

  useEffect(() => {
    setTheme(theme);
    setThemeStore(theme);
  }, [theme, setTheme, setThemeStore]);

  useEffect(() => {
    if (isSecondTime) {
      connect().catch((err: any) => {
        addToast({
          title: "Lỗi",
          description: "Không thể kết nối ví: " + err.message,
          color: "danger",
        });
      });
    }
  }, [isSecondTime, connect]);

  const handleConnect = () => {
    connect().catch((err: any) => {
      addToast({
        title: "Lỗi",
        description: "Không thể kết nối ví: " + err.message,
        color: "danger",
      });
    });
  };
  const onAction = (key: Key) => {
    if (key == "profile") {
      navigate(`/profile/${address}`);
    }
  };

  return (
    <section className="m-2 container mx-auto fixed top-0 left-0 right-0 z-10">
      <Card className="bg-transparent backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center w-full justify-start">
            {canGoBack && (
              <Button isIconOnly variant="flat" onPress={() => navigate(-1)}>
                <ArrowLeftIcon />
              </Button>
            )}
            <h1 className="ml-2 text-2xl font-bold">Navbar</h1>
            <div className="flex-1" />

            {address ? (
              <Fragment>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="ml-2 flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold">{user?.name}</p>
                        <p className="text-xs text-gray-500">
                          {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                      </div>
                      {user?.avatar ? (
                        <Image
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                          src={user.avatar}
                        />
                      ) : (
                        <Skeleton className="w-10 h-10 rounded-full" />
                      )}
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu onAction={onAction}>
                    <DropdownItem key="profile">Hồ sơ</DropdownItem>
                    <DropdownItem
                      key="theme"
                      endContent={
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                            setThemeStore(theme === "dark" ? "light" : "dark");
                          }}
                        >
                          {theme === "dark" ? <SunDimIcon /> : <MoonIcon />}
                        </Button>
                      }
                    >
                      Theme
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Fragment>
            ) : (
              <Button onPress={handleConnect}>Kết nối</Button>
            )}
          </div>
        </CardHeader>
      </Card>
    </section>
  );
}
