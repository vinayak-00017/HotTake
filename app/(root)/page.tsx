import Feed from "@/components/Feed";
import Logout from "@/components/Logout";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Feed></Feed>
      <Logout></Logout>
    </main>
  );
}
