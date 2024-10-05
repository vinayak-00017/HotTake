import Feed from "@/components/Feed";
import Logout from "@/components/Logout";
// import { allPosts, infinitePosts} from "@/lib/actions/post";

export default async function Home() {
  // const initialPosts = await infinitePosts(0);

  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <Logout></Logout>
      <Feed></Feed>
    </main>
  );
}
