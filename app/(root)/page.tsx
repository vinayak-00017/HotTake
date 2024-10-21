import Feed from "@/components/Feed";
import { infinitePosts } from "@/lib/actions/post";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["prefetchInfinitePost"],
  //   queryFn: () => infinitePosts(0),
  //   initialPageParam: 0,
  //   getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  //   pages: 1,
  // });
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <Feed></Feed>
      {/* </HydrationBoundary> */}
    </main>
  );
}
