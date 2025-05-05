import { CardHeader } from "@heroui/react";
import { Card } from "@heroui/react";

export default function ContentCard({ contentHash }: { contentHash: string }) {
  return (
    <Card>
      <CardHeader>{contentHash}</CardHeader>
    </Card>
  );
}
