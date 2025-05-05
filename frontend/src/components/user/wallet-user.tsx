import { User } from "@heroui/react";
import useSWR from "swr";

import walletStore from "@/stores/wallet.store";

export default function WalletUser({
  address,
  description,
}: {
  address: string;
  description?: string;
}) {
  const { getUser, smartUserContract, isUserRegistered } = walletStore();
  const { data } = useSWR(
    `/api/users/${address}-${smartUserContract?.target}`,
    () => getUser(address),
  );

  const { data: isRegistered } = useSWR(
    `/api/is-user-registered/${address}-${smartUserContract?.target}`,
    () => isUserRegistered(address),
  );

  return (
    <div className="flex flex-row gap-2 items-center">
      <User
        avatarProps={{
          src: isRegistered ? data?.avatar : "https://placehold.co/200x200",
        }}
        description={
          description && (
            <span className="text-default-500 font-bold">{description}</span>
          )
        }
        name={
          <span className="text-default-900 font-bold">
            {isRegistered
              ? data?.name
              : address.slice(0, 6) + "..." + address.slice(-4)}
          </span>
        }
      />
    </div>
  );
}
