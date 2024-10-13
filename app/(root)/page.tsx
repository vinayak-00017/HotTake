import Feed from "@/components/Feed";

export default async function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <Feed></Feed>
    </main>
  );
}
