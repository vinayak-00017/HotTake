import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "http://localhost:3000/api/graphql",
      // Disable Apollo's automatic fetch wrapper
      fetch: (uri, options) => {
        return fetch(uri, {
          ...options,
          next: { revalidate: 60 }, // Adjust the revalidation period as needed
        });
      },
    }),
  });
});
