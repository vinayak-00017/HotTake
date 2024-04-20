import Logout from "@/components/Logout";
import Post from "@/components/Post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Post></Post>
      <Logout></Logout>
    </main>
  );
}
