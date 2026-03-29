// src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Cal.com Clone - The better way to schedule your meetings",
  description: "A high-fidelity clone of Cal.com for scheduling logic.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
