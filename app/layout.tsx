import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProblemProvider } from "@/contexts/ProblemContext";

export const metadata: Metadata = {
  title: "プログラミング問題作成ツール",
  description: "コードの空欄問題を作成するための教育支援アプリケーション",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <ProblemProvider>
            {children}
          </ProblemProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
