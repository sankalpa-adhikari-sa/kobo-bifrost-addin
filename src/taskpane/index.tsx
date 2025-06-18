import React from "react";
import { createRoot } from "react-dom/client";
import { FluentProvider } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import App from "./components/App";
import { MemoryRouter } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const APP_TITLE = "Kobotoolbox Add-in";
const queryClient = new QueryClient();

let isOfficeInitialized = false;

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();

  return (
    <FluentProvider theme={theme}>
      <MemoryRouter>
        <App title={APP_TITLE} isOfficeInitialized={isOfficeInitialized} />
      </MemoryRouter>
    </FluentProvider>
  );
};

const AppWithProviders: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemedApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  </QueryClientProvider>
);

const renderApp = () => {
  const container = document.getElementById("container");
  if (!container) {
    console.error("Failed to find the root container.");
    return;
  }

  createRoot(container).render(
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  );
};

Office.onReady(() => {
  isOfficeInitialized = true;
  renderApp();
});
