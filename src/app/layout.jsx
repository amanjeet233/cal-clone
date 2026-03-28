// src/app/layout.jsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "CalSchedule - Scheduling Made Simple",
  description: "Schedule meetings effortlessly with your personalized booking page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
