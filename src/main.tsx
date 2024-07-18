import ReactDOM from "react-dom/client";
import "./globals.css";
import { App } from "./App";
import { ThemeProvider } from "@/hook/theme-provider";
import { ContextStateProvider } from "./hook/state";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <ContextStateProvider>
      <App />
    </ContextStateProvider>
  </ThemeProvider>
);
