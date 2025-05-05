import { Avatar, Card, CardBody } from "@heroui/react";

export default function UserCard({
  name,
  avatar,
  description,
}: {
  name: string;
  avatar: string;
  description: string;
}) {
  return (
    <Card isBlurred>
      <CardBody>
        <div className="flex flex-col gap-2 items-center">
          <Avatar className="w-24 h-24" size="lg" src={avatar} />
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-default-500 whitespace-pre-wrap text-center">
            {description}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
