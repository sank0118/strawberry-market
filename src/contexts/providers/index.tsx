"use client";

import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// const queryClient = new QueryClient()
const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
