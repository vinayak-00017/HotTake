"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </QueryClientProvider>
    </SessionProvider>
  );
};
