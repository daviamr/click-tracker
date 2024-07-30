import ReactDOM from "react-dom/client";
import "./globals.css";
import { ThemeProvider } from "@/hook/theme-provider";
import { ContextStateProvider } from "./hook/state";
import { Routes } from "./routes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./hook/Auth";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <ContextStateProvider>
      <AuthProvider>
        <Routes />
        <ToastContainer style={{ fontSize: 14 }} />
      </AuthProvider>
    </ContextStateProvider>
  </ThemeProvider>
);
