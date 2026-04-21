import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AppProvider } from "@/context/AppContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GMI School Managemet System" },
      { name: "description", content: "School Management System BY GMI TECH BALLARI" },
      { property: "og:title", content: "GMI School Managemet System" },
      { name: "twitter:title", content: "GMI School Managemet System" },
      { property: "og:description", content: "School Management System BY GMI TECH BALLARI" },
      { name: "twitter:description", content: "School Management System BY GMI TECH BALLARI" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b26ee50b-5e39-4a6b-8af6-1cef107b5548/id-preview-5a4fb425--2beca9a3-8a29-4c5d-9d6e-6c7c0f7b5935.lovable.app-1776789512836.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b26ee50b-5e39-4a6b-8af6-1cef107b5548/id-preview-5a4fb425--2beca9a3-8a29-4c5d-9d6e-6c7c0f7b5935.lovable.app-1776789512836.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}
