import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner"
import App from "./App.tsx";
import "./index.css";
import { WagmiProvider, deserialize, serialize } from "wagmi";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { config } from "./wagmi.config.ts";
import { structuralSharing } from "wagmi/query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      structuralSharing,
      retry: 0,
    },
    mutations: { networkMode: "offlineFirst" },
  },
});

const persister = createSyncStoragePersister({
  key: "vite-react.cache",
  serialize,
  storage: window.localStorage,
  deserialize,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <App />
        <Toaster />
      </PersistQueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
