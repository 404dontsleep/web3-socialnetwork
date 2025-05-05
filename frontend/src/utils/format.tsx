export const format = {
  date: (timestamp: number) => {
    return new Date(
      Number(BigInt(timestamp) * BigInt(1000)),
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },
};
