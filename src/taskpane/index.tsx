import React from "react";
import App from "./components/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let isOfficeInitialized = false;

const title = "Kobotoolbox Add-in";
const queryClient = new QueryClient();
const render = (Component: typeof App) => {
  createRoot(document.getElementById("container") as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <FluentProvider theme={webLightTheme}>
          <Component title={title} isOfficeInitialized={isOfficeInitialized} />
        </FluentProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});
