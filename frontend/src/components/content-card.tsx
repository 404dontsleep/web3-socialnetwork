import { CardHeader } from "@heroui/react";
import { Card } from "@heroui/react";

export default function ContentCard({
  contentHash,
  author,
  timestamp,
  score,
  parent,
}: {
  contentHash: string;
  author: string;
  timestamp: number;
  score: number;
  parent: number;
}) {
  return (
    <Card>
      <CardHeader>{author}</CardHeader>
    </Card>
  );
}
