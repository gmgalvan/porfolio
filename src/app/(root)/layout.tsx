import "../globals.css";

// Root "/" only redirects to a language. On Netlify this is handled by the
// redirect rules in netlify.toml; this page is the fallback everywhere else.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
