import "./globals.css";

export const metadata = {
  title: "KneeMorph | Clinical knee insight",
  description: "A focused workspace for knee health information and imaging.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
