import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  title: "FitForge AI — Your AI Gym Trainer",
  description:
    "AI-powered health chat, personalized Indian diet plans, muscle-specific workout tutorials, hire certified trainers, and find top gyms near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
